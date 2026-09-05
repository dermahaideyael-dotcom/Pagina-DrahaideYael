#!/usr/bin/env python3
"""Investigación pre-campaña para Google Ads de la clínica de la Dra. Haide
Yael Guerrero Quiroz: tendencias por vertical (Módulo 1, vía Brave Search +
Claude) y generación de links de Ad Library / análisis de anuncios de
competencia pegados manualmente (Módulo 2, Ruta B -- nunca scraping).

Este script es el equivalente "sin sesión de Claude Code abierta" de las
skills ads-research / ads-competitor (.claude/skills/), pensado para uso
programado/desatendido. Produce el mismo esquema de salida que esas skills
-- ver .claude/skills/master-marketing-orchestrator/references/research-schema.md
(fuente de verdad; este script mantiene su propia copia del esquema en
TRENDING_OUTPUT_SCHEMA / COMPETITOR_OUTPUT_SCHEMA, actualizar ambos a mano
si cambia uno).

Uso:
    python campaign_research.py --trending --topic "tendencias melasma 2026" --vertical manchas_melasma
    python campaign_research.py --generate-ad-library-links --competitors "Clínica X,Dra. Y" --country MX
    python campaign_research.py --analyze-pasted anuncio_competidor.txt --competitor "Clínica X"

Requisitos previos:
    - .env en la raíz del repo con ANTHROPIC_API_KEY y BRAVE_API_KEY (ver
      .env.example). Sin BRAVE_API_KEY, --trending sigue corriendo pero
      marca busqueda_web_verificada: false y NO inventa tendencias --
      nunca se llama a Anthropic sin una búsqueda real que sintetizar.
    - Venv propio de este repo (no el de MiroFish -- este script no tiene
      relación con esa herramienta):
        python -m venv .venv
        .venv\\Scripts\\Activate.ps1
        pip install -r scripts\\requirements-campaign-research.txt
      Ver scripts/README-campaign-research.md para más detalle.
    - --generate-ad-library-links no necesita ninguna API key (offline puro).

Nunca inventa una tendencia sin señal de búsqueda real, ni un ángulo/hook de
competencia sin texto realmente pegado por el usuario.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse

if sys.platform == "win32":
    # Mismo ajuste que scripts/mirofish_orchestrator.py -- evita mojibake en
    # la consola de Windows al imprimir progreso con acentos/ñ.
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            _stream.reconfigure(encoding="utf-8", errors="replace")

from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

try:
    import requests
except ImportError:
    print(
        "Falta el paquete 'requests'. Crea el venv de este repo e instala "
        "las dependencias:\n"
        "  python -m venv .venv\n"
        "  .venv\\Scripts\\Activate.ps1\n"
        "  pip install -r scripts\\requirements-campaign-research.txt",
        file=sys.stderr,
    )
    sys.exit(1)

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    print(
        "Aviso: falta 'python-dotenv', no se carga .env automáticamente -- "
        "exporta ANTHROPIC_API_KEY/BRAVE_API_KEY a mano si no usás el venv "
        "de este repo (ver scripts/requirements-campaign-research.txt).",
        file=sys.stderr,
    )

# anthropic es import diferido (ver build_anthropic_client) porque
# --generate-ad-library-links no lo necesita para nada y debe poder correr
# incluso si el paquete no está instalado.


DEFAULT_MODEL = "claude-sonnet-5"
DEFAULT_EFFORT = "high"
# Sonnet 4.5 y Haiku 4.5 devuelven error si se les manda output_config.effort;
# a claude-sonnet-5 nunca se le manda temperature/top_p/top_k (removido, 400).
MODELS_WITHOUT_EFFORT_SUPPORT = {"claude-haiku-4-5", "claude-sonnet-4-5"}
BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"
AD_LIBRARY_BASE = "https://www.facebook.com/ads/library/"
DEFAULT_OUTPUT_DIR = "docs/campaign-research"
DEFAULT_CLIENT_ID = "dra-haide-yael-guerrero"
VERTICALES_CONOCIDAS = {"caida_cabello", "acne", "manchas_melasma", "rejuvenecimiento", "otro"}


class ResearchError(RuntimeError):
    """Fallo terminal de este comando puntual."""


class BraveSearchUnavailable(RuntimeError):
    """Búsqueda real no disponible/fallida -- no es fatal para el comando,
    pero bloquea cualquier síntesis: nunca se sintetiza una tendencia sin
    resultados de búsqueda reales detrás."""


# --------------------------------------------------------------------------
# Esquema de salida (ver research-schema.md -- misma forma que las skills)
# --------------------------------------------------------------------------

@dataclass
class Evidence:
    url: str
    publisher: Optional[str] = None
    fecha_publicacion: Optional[str] = None
    fecha_consulta: str = field(default_factory=lambda: datetime.now().date().isoformat())
    confianza: Optional[str] = None
    licencia_o_uso: Optional[str] = None
    refresh_due: Optional[str] = None


@dataclass
class ResearchEnvelope:
    client_id: str
    research_type: str  # "trending_topics" | "competitor_ads"
    vertical: str
    generated_at: str
    generated_by: str
    busqueda_web_verificada: bool
    status: str  # ready | needs_input | blocked | complete
    facts: list
    assumptions: list
    recommendations: list
    risks: list
    approval_required: bool
    next_action: str
    evidence: list
    findings: list

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_suffix(path.suffix + ".tmp")
        tmp.write_text(json.dumps(asdict(self), ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(path)


def log(msg: str) -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    try:
        print(line, flush=True)
    except UnicodeEncodeError:
        print(line.encode("ascii", errors="replace").decode("ascii"), flush=True)


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE).strip().lower()
    return re.sub(r"[\s_-]+", "-", text) or "research"


# --------------------------------------------------------------------------
# Brave Search
# --------------------------------------------------------------------------

class BraveSearchClient:
    def __init__(self, api_key: Optional[str], timeout: int = 15):
        self.api_key = api_key
        self.timeout = timeout
        self.session = requests.Session()

    def search(self, query: str, count: int = 10) -> list[dict]:
        if not self.api_key:
            raise BraveSearchUnavailable("BRAVE_API_KEY no está configurada.")
        try:
            resp = self.session.get(
                BRAVE_SEARCH_URL,
                params={"q": query, "count": count},
                headers={"Accept": "application/json", "X-Subscription-Token": self.api_key},
                timeout=self.timeout,
            )
        except requests.exceptions.ConnectionError as exc:
            raise BraveSearchUnavailable(f"No se pudo conectar a Brave Search: {exc}") from exc
        except requests.exceptions.Timeout as exc:
            raise BraveSearchUnavailable(f"Timeout llamando a Brave Search (>{self.timeout}s): {exc}") from exc

        if resp.status_code != 200:
            err = BraveSearchUnavailable(
                f"Brave Search devolvió status {resp.status_code}: {resp.text[:300]}"
            )
            err._http_status = resp.status_code  # type: ignore[attr-defined]
            raise err

        try:
            data = resp.json()
        except ValueError as exc:
            raise BraveSearchUnavailable("Brave Search devolvió una respuesta no-JSON.") from exc

        results = data.get("web", {}).get("results", [])
        return [
            {
                "url": r.get("url", ""),
                "title": r.get("title", ""),
                "description": r.get("description", ""),
                "age": r.get("age"),
            }
            for r in results
        ]


# --------------------------------------------------------------------------
# Síntesis vía Anthropic (claude-sonnet-5, structured outputs)
# --------------------------------------------------------------------------

TRENDING_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "tipo": {"type": "string", "enum": ["trending_topic"]},
                    "tema": {"type": "string"},
                    "por_que_es_tendencia": {"type": "string"},
                    "angulo_sugerido_para_ad": {"type": "string"},
                    "respaldo_medico": {"type": "string", "enum": ["alto", "medio", "bajo"]},
                    "confianza_tendencia": {"type": "string", "enum": ["alta", "media", "baja"]},
                    "fuentes_usadas": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "url": {"type": "string"},
                                "titulo": {"type": "string"},
                                "publisher": {"type": "string"},
                                "fecha": {"type": "string"},
                            },
                            "required": ["url", "titulo", "publisher", "fecha"],
                            "additionalProperties": False,
                        },
                    },
                },
                "required": [
                    "tipo", "tema", "por_que_es_tendencia", "angulo_sugerido_para_ad",
                    "respaldo_medico", "confianza_tendencia", "fuentes_usadas",
                ],
                "additionalProperties": False,
            },
        },
    },
    "required": ["findings"],
    "additionalProperties": False,
}

COMPETITOR_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "tipo": {"type": "string", "enum": ["competitor_ad"]},
                    "pagina_anunciante": {"type": "string"},
                    "angulos_detectados": {"type": "array", "items": {"type": "string"}},
                    "hooks_usados": {"type": "array", "items": {"type": "string"}},
                    "ctas_usados": {"type": "array", "items": {"type": "string"}},
                    "patron_creativo": {
                        "type": "string",
                        "enum": ["imagen", "video", "carrusel", "desconocido"],
                    },
                    "lo_que_parece_funcionar": {"type": "string"},
                    "oportunidad_diferenciacion": {"type": "string"},
                },
                "required": [
                    "tipo", "pagina_anunciante", "angulos_detectados", "hooks_usados",
                    "ctas_usados", "patron_creativo", "lo_que_parece_funcionar",
                    "oportunidad_diferenciacion",
                ],
                "additionalProperties": False,
            },
        },
    },
    "required": ["findings"],
    "additionalProperties": False,
}

SYSTEM_PROMPT_TRENDING = (
    "Eres analista de tendencias médicas para ads de una clínica de "
    "dermatología/tricología (Dra. Haide Yael Guerrero Quiroz). SOLO puedes "
    "citar como fuente los URLs que aparecen en los resultados de búsqueda "
    "que se te dan a continuación -- nunca inventes una URL o fuente "
    "ausente del contexto. Si los resultados no sustentan ninguna tendencia "
    "real, responde findings: []. respaldo_medico solo puede ser 'alto' si "
    "la fuente es médica primaria/oficial (sociedad médica, revista "
    "indexada, guía clínica) -- popularidad en redes sociales nunca es "
    "'alto', a lo sumo sustenta confianza_tendencia."
)

SYSTEM_PROMPT_COMPETITOR = (
    "Analiza ÚNICAMENTE el texto de anuncio pegado a continuación, de la "
    "página/marca indicada. No inventes ángulos, hooks, CTAs, formato o "
    "duración que el texto no sustente explícitamente. Si algo no está en "
    "el texto, usa una lista vacía o 'desconocido' en vez de inventarlo. "
    "lo_que_parece_funcionar debe leerse como inferencia razonada, nunca "
    "como un hecho de rendimiento de la cuenta del competidor."
)


def build_anthropic_client():
    try:
        import anthropic
    except ImportError as exc:
        raise ResearchError(
            "Falta el paquete 'anthropic'. Instalalo en el venv de este "
            "repo: pip install -r scripts\\requirements-campaign-research.txt"
        ) from exc

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ResearchError(
            "Falta ANTHROPIC_API_KEY (ver .env / .env.example en la raíz del repo)."
        )
    return anthropic.Anthropic(api_key=api_key)


def _output_config(model: str, effort: str, schema: dict) -> dict:
    config: dict[str, Any] = {"format": {"type": "json_schema", "schema": schema}}
    if model not in MODELS_WITHOUT_EFFORT_SUPPORT:
        config["effort"] = effort
    return config


def synthesize_trending(
    client, topic: str, vertical: str, search_results: list[dict],
    model: str = DEFAULT_MODEL, effort: str = DEFAULT_EFFORT,
) -> dict:
    context = json.dumps(search_results, ensure_ascii=False, indent=2)
    user_msg = (
        f"Tema/vertical: {vertical}\n"
        f"Búsqueda: {topic}\n\n"
        f"Resultados de búsqueda reales (Brave Search):\n{context}\n\n"
        "Sintetiza hallazgos de tendencia siguiendo el esquema, citando "
        "solo URLs presentes arriba."
    )
    response = client.messages.create(
        model=model,
        max_tokens=4096,
        system=SYSTEM_PROMPT_TRENDING,
        messages=[{"role": "user", "content": user_msg}],
        output_config=_output_config(model, effort, TRENDING_OUTPUT_SCHEMA),
    )
    text = next((b.text for b in response.content if b.type == "text"), "{}")
    return json.loads(text)


def synthesize_competitor_analysis(
    client, competitor: str, pasted_text: str,
    model: str = DEFAULT_MODEL, effort: str = DEFAULT_EFFORT,
) -> dict:
    user_msg = (
        f"Página/marca anunciante: {competitor}\n\n"
        f"Texto de anuncio(s) pegado por el usuario:\n{pasted_text}\n\n"
        "Analiza únicamente este texto siguiendo el esquema."
    )
    response = client.messages.create(
        model=model,
        max_tokens=4096,
        system=SYSTEM_PROMPT_COMPETITOR,
        messages=[{"role": "user", "content": user_msg}],
        output_config=_output_config(model, effort, COMPETITOR_OUTPUT_SCHEMA),
    )
    text = next((b.text for b in response.content if b.type == "text"), "{}")
    return json.loads(text)


def validate_sources_against_context(findings: list[dict], raw_results: list[dict]) -> list[str]:
    """Cruza cada fuentes_usadas[].url citada por el modelo contra las URLs
    reales que devolvió Brave. Devuelve advertencias para cualquier URL
    citada que no esté realmente entre los resultados -- señal concreta de
    que el modelo pudo haber alucinado una fuente."""
    real_urls = {r["url"] for r in raw_results if r.get("url")}
    warnings: list[str] = []
    for finding in findings:
        for fuente in finding.get("fuentes_usadas", []):
            url = fuente.get("url")
            if url and url not in real_urls:
                warnings.append(
                    f"URL citada por el modelo no aparece en los resultados de "
                    f"búsqueda reales: {url} (tema: {finding.get('tema')})"
                )
                finding["confianza_tendencia"] = "baja"
    return warnings


# --------------------------------------------------------------------------
# Ad Library links (Ruta B, sin red, nunca scraping)
# --------------------------------------------------------------------------

def build_ad_library_link(competitor: str, country: str, page_id: Optional[str] = None) -> str:
    if page_id:
        params = {
            "active_status": "active",
            "ad_type": "all",
            "country": country,
            "search_type": "page",
            "view_all_page_id": page_id,
        }
    else:
        params = {
            "active_status": "active",
            "ad_type": "all",
            "country": country,
            "q": competitor,
            "search_type": "keyword_unordered",
            "media_type": "all",
        }
    return f"{AD_LIBRARY_BASE}?{urllib.parse.urlencode(params, quote_via=urllib.parse.quote)}"


# --------------------------------------------------------------------------
# Comandos
# --------------------------------------------------------------------------

def _empty_envelope(client_id: str, research_type: str, vertical: str, generated_by: str) -> ResearchEnvelope:
    return ResearchEnvelope(
        client_id=client_id,
        research_type=research_type,
        vertical=vertical,
        generated_at=datetime.now().isoformat(),
        generated_by=generated_by,
        busqueda_web_verificada=False,
        status="blocked",
        facts=[],
        assumptions=[],
        recommendations=[],
        risks=[],
        approval_required=False,
        next_action="",
        evidence=[],
        findings=[],
    )


def cmd_trending(args: argparse.Namespace) -> int:
    if not args.topic:
        log("ERROR: --trending requiere --topic.")
        return 1
    vertical = args.vertical or "otro"

    envelope = _empty_envelope(args.client_id, "trending_topics", vertical, "script:campaign_research.py")

    if args.dry_run:
        log(f"[dry-run] --trending topic={args.topic!r} vertical={vertical!r}")
        return 0

    brave = BraveSearchClient(os.environ.get("BRAVE_API_KEY"))
    try:
        results = brave.search(args.topic, count=args.search_count)
    except BraveSearchUnavailable as exc:
        log(f"Búsqueda no disponible: {exc}")
        envelope.risks = ["Sin búsqueda real, cualquier tendencia sería inventada -- no se llamó a Anthropic."]
        envelope.next_action = (
            "Configurar BRAVE_API_KEY en .env, o correr la skill ads-research "
            "en una sesión de Claude Code (usa WebSearch nativo, sin API key propia)."
        )
        out_path = Path(args.output_dir) / f"{slugify(vertical)}-trending-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        envelope.save(out_path)
        log(f"Guardado (bloqueado, sin búsqueda real): {out_path}")
        return 0

    if not results:
        log("Brave Search no devolvió resultados para esta búsqueda.")
        envelope.status = "needs_input"
        envelope.next_action = "Reformular --topic; la búsqueda no trajo resultados."
        out_path = Path(args.output_dir) / f"{slugify(vertical)}-trending-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        envelope.save(out_path)
        log(f"Guardado (sin resultados): {out_path}")
        return 0

    log(f"Brave Search devolvió {len(results)} resultados reales, sintetizando con {args.model}...")
    client = build_anthropic_client()
    parsed = synthesize_trending(client, args.topic, vertical, results, model=args.model, effort=args.effort)
    findings = parsed.get("findings", [])
    warnings = validate_sources_against_context(findings, results)
    for w in warnings:
        log(f"ADVERTENCIA: {w}")

    envelope.busqueda_web_verificada = True
    envelope.status = "ready"
    envelope.findings = findings
    envelope.risks = warnings
    envelope.evidence = [
        asdict(Evidence(url=r["url"], publisher=None, fecha_consulta=datetime.now().date().isoformat()))
        for r in results
    ]

    out_path = Path(args.output_dir) / f"{slugify(vertical)}-trending-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    envelope.save(out_path)
    log(f"Listo. {len(findings)} hallazgo(s) de tendencia guardados en: {out_path}")
    return 0


def cmd_generate_ad_library_links(args: argparse.Namespace) -> int:
    if not args.competitors:
        log("ERROR: --generate-ad-library-links requiere --competitors \"Nombre 1,Nombre 2\".")
        return 1
    names = [n.strip() for n in args.competitors.split(",") if n.strip()]
    if not names:
        log("ERROR: --competitors no tiene ningún nombre válido.")
        return 1

    if args.dry_run:
        log(f"[dry-run] --generate-ad-library-links competitors={names} country={args.country}")
        return 0

    findings = []
    for name in names:
        page_id = args.page_id if len(names) == 1 else None
        link = build_ad_library_link(name, args.country, page_id=page_id)
        findings.append({
            "tipo": "competitor_ad",
            "pagina_anunciante": name,
            "link_ad_library": link,
            "pais": args.country,
            "fecha_captura": datetime.now().date().isoformat(),
            "angulos_detectados": [],
            "hooks_usados": [],
            "ctas_usados": [],
            "patron_creativo": "desconocido",
            "lo_que_parece_funcionar": "",
            "oportunidad_diferenciacion": "",
            "observado_directamente": False,
            "texto_pegado_por": None,
        })
        log(f"{name}: {link}")

    envelope = ResearchEnvelope(
        client_id=args.client_id,
        research_type="competitor_ads",
        vertical=args.vertical or "otro",
        generated_at=datetime.now().isoformat(),
        generated_by="script:campaign_research.py",
        busqueda_web_verificada=False,
        status="needs_input",
        facts=[],
        assumptions=[],
        recommendations=[],
        risks=[],
        approval_required=False,
        next_action="Revisar cada link de Ad Library manualmente y volver a correr con --analyze-pasted.",
        evidence=[],
        findings=findings,
    )
    slug = slugify(names[0]) if len(names) == 1 else "competidores"
    out_path = Path(args.output_dir) / f"{slug}-competitor-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    envelope.save(out_path)
    log(f"Links guardados en: {out_path}")
    return 0


def cmd_analyze_pasted(args: argparse.Namespace) -> int:
    if not args.competitor:
        log("ERROR: --analyze-pasted requiere --competitor \"Nombre\".")
        return 1
    source = Path(args.analyze_pasted)
    if not source.exists():
        log(f"ERROR: no existe el archivo {source}.")
        return 1
    pasted_text = source.read_text(encoding="utf-8").strip()
    if not pasted_text:
        log(f"ERROR: {source} está vacío -- no hay nada que analizar.")
        return 1

    if args.dry_run:
        log(f"[dry-run] --analyze-pasted {source} competitor={args.competitor!r} ({len(pasted_text)} chars)")
        return 0

    client = build_anthropic_client()
    log(f"Analizando texto pegado de {source} con {args.model}...")
    parsed = synthesize_competitor_analysis(client, args.competitor, pasted_text, model=args.model, effort=args.effort)
    findings = parsed.get("findings", [])
    for f in findings:
        f["pagina_anunciante"] = args.competitor
        f["link_ad_library"] = build_ad_library_link(args.competitor, args.country, page_id=args.page_id)
        f["pais"] = args.country
        f["fecha_captura"] = datetime.now().date().isoformat()
        f["observado_directamente"] = True
        f["texto_pegado_por"] = "usuario"

    envelope = ResearchEnvelope(
        client_id=args.client_id,
        research_type="competitor_ads",
        vertical=args.vertical or "otro",
        generated_at=datetime.now().isoformat(),
        generated_by="script:campaign_research.py",
        busqueda_web_verificada=False,
        status="ready" if findings else "needs_input",
        facts=[],
        assumptions=[],
        recommendations=[],
        risks=[],
        approval_required=False,
        next_action="" if findings else "El modelo no produjo hallazgos -- revisar el texto pegado.",
        evidence=[],
        findings=findings,
    )
    out_path = Path(args.output_dir) / f"{slugify(args.competitor)}-competitor-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    envelope.save(out_path)
    log(f"Listo. {len(findings)} hallazgo(s) guardados en: {out_path}")
    return 0


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    actions = parser.add_mutually_exclusive_group(required=True)
    actions.add_argument("--trending", action="store_true", help="Módulo 1: detectar tendencias del vertical vía Brave Search + Claude.")
    actions.add_argument("--generate-ad-library-links", action="store_true", help="Módulo 2 Ruta B: generar links de Ad Library por competidor (offline, sin API keys).")
    actions.add_argument("--analyze-pasted", metavar="ARCHIVO_TXT", help="Módulo 2 Ruta B: analizar con Claude el texto de anuncio(s) pegado en este archivo.")

    parser.add_argument("--client-id", default=DEFAULT_CLIENT_ID)
    parser.add_argument("--topic", help="Búsqueda a hacer en Brave para --trending, ej. 'tendencias melasma 2026'.")
    parser.add_argument("--vertical", choices=sorted(VERTICALES_CONOCIDAS), help="Vertical de la clínica.")
    parser.add_argument("--competitors", help="Lista de nombres separada por comas, para --generate-ad-library-links.")
    parser.add_argument("--competitor", help="Un solo nombre, para --analyze-pasted.")
    parser.add_argument("--country", default="MX", help="Código de país de 2 letras para la Ad Library.")
    parser.add_argument("--page-id", help="page_id de Meta si se conoce (solo aplica a un único competidor).")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--effort", default=DEFAULT_EFFORT, choices=["low", "medium", "high", "xhigh", "max"])
    parser.add_argument("--search-count", type=int, default=10)
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--dry-run", action="store_true", help="Valida los argumentos y no hace ninguna llamada de red/API.")

    args = parser.parse_args()

    try:
        if args.trending:
            return cmd_trending(args)
        if args.generate_ad_library_links:
            return cmd_generate_ad_library_links(args)
        if args.analyze_pasted:
            return cmd_analyze_pasted(args)
    except ResearchError as exc:
        log(f"ERROR: {exc}")
        return 1
    except Exception as exc:  # noqa: BLE001 -- último recurso, reportar con claridad en vez de traceback crudo
        log(f"ERROR inesperado: {exc}")
        return 1

    return 1  # no debería llegar acá (mutually_exclusive_group required=True)


if __name__ == "__main__":
    sys.exit(main())
