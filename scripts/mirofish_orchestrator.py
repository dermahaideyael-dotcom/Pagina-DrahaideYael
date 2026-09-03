#!/usr/bin/env python3
"""Orquestador end-to-end de MiroFish para el proyecto de la Dra. Haide Yael.

Llama a la API HTTP local de MiroFish (http://localhost:5001 por defecto) en
la secuencia completa —subir material semilla, construir el grafo, generar
agentes/config, correr la simulación social, y generar el reporte final— sin
intervención manual, para que el resto del sistema de campañas pueda invocarlo
por sí solo.

Uso:
    python mirofish_orchestrator.py <campaña.md o .txt> [opciones]
    python mirofish_orchestrator.py --resume <state.json>

Elenco de personas (skill synthetic-identity-architect):
    Si existe docs/mirofish-personas/<slug-de-campaña>.md (generado con la
    skill "synthetic-identity-architect"), se autodetecta y se sube como
    segundo archivo semilla junto con la campaña, y simulation_requirement
    instruye a MiroFish a instanciar exactamente esas identidades en vez de
    inventar las suyas -- ver --personas / --no-personas para forzar un
    archivo específico o desactivar la autodetección.

Requisitos previos (no los gestiona este script):
    - MiroFish corriendo: backend en :5001 (`uv run python run.py` dentro de
      MiroFish/backend) y, si se quiere ver en vivo, frontend aparte en :3001
      (`npm run dev` dentro de MiroFish/frontend). Backend y frontend deben
      lanzarse como procesos SEPARADOS — si comparten un solo `npm run dev`,
      reiniciar uno reinicia el otro y, si hay una pestaña del navegador
      abierta en el Step 3, su `onMounted` relanza la simulación sola y choca
      con este script. Ver MiroFish/backend/.env para las API keys de
      Groq/Zep/fallback Gemini.

Lecciones aplicadas de la primera corrida piloto (2026-09, campaña caída de
cabello) — ver memoria de proyecto "mirofish-focus-group-lessons":
    - El material semilla debe listar personas ya diferenciadas con objeción
      propia, no un párrafo genérico de "público objetivo" — si no, MiroFish
      colapsa entidades institucionales duplicadas y genera muy pocos agentes
      paciente reales.
    - simulation_requirement debe prohibir explícitamente duplicar entidades
      institucionales y, si importa el número de agentes, pedirlo de forma
      imperativa (MiroFish puede autoreducirlo igual).
    - max_rounds bajo (10-20) es suficiente y mucho más barato que 72; la
      actividad orgánica real se agota rápido incluso sin bugs.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile

if sys.platform == "win32":
    # Evita mojibake en la consola de Windows al imprimir progreso con
    # acentos/ñ -- mismo ajuste que ya lleva MiroFish/backend/scripts/
    # run_parallel_simulation.py para el mismo problema.
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            _stream.reconfigure(encoding="utf-8", errors="replace")
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

try:
    import requests
except ImportError:
    print(
        "Falta el paquete 'requests'. Este script está pensado para "
        "correrse con el intérprete de MiroFish, que ya lo tiene instalado:\n"
        '  & "C:\\Users\\jonat\\OneDrive\\Documentos\\MiroFish\\backend\\.venv\\Scripts\\python.exe" '
        '"scripts\\mirofish_orchestrator.py" <archivo>',
        file=sys.stderr,
    )
    sys.exit(1)


DEFAULT_BASE_URL = os.environ.get("MIROFISH_BASE_URL", "http://localhost:5001")
DEFAULT_OUTPUT_DIR = "docs/mirofish-reports"


class OrchestratorError(RuntimeError):
    """Fallo terminal: el script debe detenerse y reportar con claridad."""


class StageTimeout(RuntimeError):
    """La etapa no terminó dentro del tope de espera, pero puede seguir
    corriendo del lado del servidor — no es necesariamente un fallo."""


# --------------------------------------------------------------------------
# Estado persistente (para --resume)
# --------------------------------------------------------------------------

@dataclass
class RunState:
    source_file: str
    campaign_name: str
    base_url: str
    platform: str
    max_rounds: int
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now().isoformat())
    project_id: Optional[str] = None
    graph_id: Optional[str] = None
    graph_build_task_id: Optional[str] = None
    simulation_id: Optional[str] = None
    prepare_task_id: Optional[str] = None
    report_id: Optional[str] = None
    report_task_id: Optional[str] = None
    stage: str = "start"  # start -> ontology -> graph -> sim_created -> prepared -> simulated -> stopped -> report -> done
    output_path: Optional[str] = None
    personas_file: Optional[str] = None
    persona_count: Optional[int] = None

    def save(self, path: Path) -> None:
        self.updated_at = datetime.now().isoformat()
        tmp = path.with_suffix(path.suffix + ".tmp")
        tmp.write_text(json.dumps(asdict(self), ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(path)

    @classmethod
    def load(cls, path: Path) -> "RunState":
        data = json.loads(path.read_text(encoding="utf-8"))
        return cls(**data)


def log(msg: str) -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    try:
        print(line, flush=True)
    except UnicodeEncodeError:
        # Consola sin UTF-8 (no debería pasar con el reconfigure de arriba,
        # pero si algún caller redirige stdout de otra forma que lo pisa,
        # el logging nunca debe tumbar el orquestador) -- degradar en vez
        # de propagar.
        print(line.encode("ascii", errors="replace").decode("ascii"), flush=True)


# --------------------------------------------------------------------------
# Cliente HTTP delgado
# --------------------------------------------------------------------------

class MiroFishClient:
    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def get(self, path: str, **kwargs) -> dict:
        return self._call("GET", path, **kwargs)

    def post(self, path: str, **kwargs) -> dict:
        return self._call("POST", path, **kwargs)

    def _call(self, method: str, path: str, **kwargs) -> dict:
        timeout = kwargs.pop("timeout", self.timeout)
        try:
            resp = self.session.request(method, self._url(path), timeout=timeout, **kwargs)
        except requests.exceptions.ConnectionError as exc:
            raise OrchestratorError(
                f"No se pudo conectar a MiroFish en {self.base_url}. "
                "¿Está corriendo el backend? "
                "(cd MiroFish/backend && uv run python run.py)"
            ) from exc
        except requests.exceptions.Timeout as exc:
            raise OrchestratorError(
                f"Timeout de red llamando a {method} {path} (>{timeout}s). "
                "MiroFish puede seguir vivo pero no respondió a tiempo."
            ) from exc

        try:
            data = resp.json()
        except ValueError:
            raise OrchestratorError(
                f"{method} {path} devolvió una respuesta no-JSON "
                f"(status {resp.status_code}): {resp.text[:500]}"
            )

        # 409/404/400 con cuerpo JSON de error: dejar que el caller decida
        # (algunos flujos, como report/generate con ingestión pendiente,
        # esperan poder inspeccionar el cuerpo de un 409).
        data["_http_status"] = resp.status_code
        return data

    def health_check(self) -> bool:
        try:
            self.session.get(self._url("/health"), timeout=5)
            return True
        except requests.exceptions.ConnectionError:
            return False
        except requests.exceptions.Timeout:
            return True  # respondió, aunque lento -- servidor vivo


# --------------------------------------------------------------------------
# Construcción del simulation_requirement a partir del markdown de campaña
# --------------------------------------------------------------------------

ANTI_DUPLICATE_RULE = (
    "Genera solo UN agente por cada entidad institucional (la clínica, la "
    "doctora, la plataforma de anuncios) -- no dupliques la misma entidad "
    "aunque el texto la mencione de formas ligeramente distintas."
)

PERSONA_ID_RE = re.compile(r"^#{0,6}\s*AGENT ID:\s*(\S+)", flags=re.MULTILINE)


def count_personas(personas_text: str) -> int:
    """Cuenta identidades DERM-NNN en un archivo de synthetic-identity-architect."""
    return len(PERSONA_ID_RE.findall(personas_text))


def find_personas_file(campaign_name: str, source_path: Path) -> Optional[Path]:
    """Autodetecta un archivo de personas ya generado para esta campaña.

    Busca en docs/mirofish-personas/<slug>.md, probando primero el slug del
    nombre de campaña y después el del nombre del archivo semilla -- cubre
    tanto "python orchestrator.py seed.md --campaign 'Caída de Cabello'"
    como invocarlo sin --campaign explícito.
    """
    personas_dir = Path("docs/mirofish-personas")
    if not personas_dir.is_dir():
        return None
    for candidate_slug in {slugify(campaign_name), slugify(source_path.stem)}:
        candidate = personas_dir / f"{candidate_slug}.md"
        if candidate.is_file():
            return candidate
    return None


def build_simulation_requirement(
    markdown_text: str,
    min_patient_agents: Optional[int],
    persona_count: Optional[int] = None,
) -> str:
    """Arma la instrucción de simulación a partir del markdown de campaña.

    No duplica el documento completo (eso va como archivo semilla aparte);
    solo extrae una instrucción de dirección corta, aplicando las reglas
    anti-duplicado y de conteo de agentes aprendidas en el demo piloto.
    """
    # Heurística simple: usar el primer encabezado "## " como pista de tema,
    # y buscar una sección de preguntas/objetivo si existe.
    headers = re.findall(r"^##?\s+(.+)$", markdown_text, flags=re.MULTILINE)
    topic_hint = headers[0] if headers else "esta campaña"

    parts = [
        f"Simula reacciones realistas de redes sociales al material adjunto "
        f"sobre {topic_hint}. Las personas deben discutir orgánicamente "
        f"(publicar, comentar, reaccionar entre sí), no solo repetir el "
        f"contenido inicial.",
        ANTI_DUPLICATE_RULE,
    ]

    if persona_count:
        # Hay un archivo de synthetic-identity-architect adjunto como
        # segundo archivo semilla: instruir a MiroFish a instanciar
        # exactamente esas identidades ya diferenciadas en vez de inventar
        # las suyas -- esto es lo que corrige de raíz la duplicación de
        # entidades institucionales y los pacientes genéricos del demo
        # piloto (ver memoria "mirofish-focus-group-lessons").
        parts.append(
            f"El segundo archivo adjunto contiene EXACTAMENTE {persona_count} "
            f"identidades de pacientes potenciales ya definidas (formato "
            f"'AGENT ID: DERM-NNN', cada una con nombre sintético, motivación, "
            f"objeciones y estilo de búsqueda propios) para el mismo problema. "
            f"Instancia un agente por cada una de esas {persona_count} "
            f"identidades tal cual están descritas -- no las resumas, no las "
            f"fusiones, no inventes personas adicionales ni reduzcas el "
            f"número aunque el volumen de búsqueda del tema parezca bajo. "
            f"Usa el nombre sintético de cada identidad como su nombre de "
            f"agente."
        )
    elif min_patient_agents:
        parts.append(
            f"Genera al menos {min_patient_agents} agentes de tipo paciente "
            f"potencial, cada uno con una objeción o situación distinta -- "
            f"no reduzcas este número aunque el volumen de búsqueda del tema "
            f"parezca bajo."
        )

    parts.append(
        "El análisis final debe cubrir: si el mensaje genera clic/interés, "
        "si es coherente con lo que ven después, si el copy de beneficios "
        "genera confianza o suena a promesa exagerada, si el precio se "
        "percibe razonable, qué haría dudar o abandonar antes de contactar, "
        "y qué tan probable es la conversión."
    )
    parts.append(
        "El reporte final completo (títulos de sección y todo el análisis) debe "
        "estar escrito enteramente en español -- no en chino ni en inglés."
    )
    return " ".join(parts)


# --------------------------------------------------------------------------
# Polling genérico
# --------------------------------------------------------------------------

def poll_until(
    check_fn,
    *,
    interval: float,
    max_wait: float,
    stage_name: str,
    progress_fn=None,
) -> Any:
    """Llama a check_fn() cada `interval` segundos hasta que devuelva un
    valor truthy (distinto de None/False), o hasta agotar max_wait.

    check_fn debe devolver:
        - None/False  -> seguir esperando
        - cualquier otro valor -> se devuelve tal cual (terminado)
    Puede levantar OrchestratorError para fallar de inmediato (estado
    terminal de error, no ambiguo).
    """
    start = time.monotonic()
    last_progress_log = 0.0
    while True:
        result = check_fn()
        if result:
            return result

        elapsed = time.monotonic() - start
        if elapsed >= max_wait:
            raise StageTimeout(
                f"'{stage_name}' no terminó tras {max_wait:.0f}s de espera. "
                f"MiroFish puede seguir corriendo del lado del servidor -- "
                f"usa --resume para retomar sin perder lo ya hecho."
            )

        if progress_fn and elapsed - last_progress_log >= 15:
            progress_fn()
            last_progress_log = elapsed

        time.sleep(interval)


# --------------------------------------------------------------------------
# Pasos del pipeline
# --------------------------------------------------------------------------

def step_ontology(
    client: MiroFishClient,
    state: RunState,
    source_path: Path,
    requirement: str,
    personas_path: Optional[Path] = None,
) -> None:
    if state.stage not in ("start", "ontology"):
        return
    if personas_path:
        log(
            f"[1/8] Subiendo material semilla ({source_path.name}) + "
            f"elenco de personas ({personas_path.name}, {state.persona_count} "
            f"identidades) y generando ontología..."
        )
    else:
        log(f"[1/8] Subiendo material semilla y generando ontología ({source_path.name})...")

    # requests admite múltiples archivos bajo la misma clave 'files' pasando
    # una lista de tuplas -- así el endpoint los recibe con
    # request.files.getlist('files') tal como espera el backend.
    files_payload = [("files", (source_path.name, open(source_path, "rb")))]
    if personas_path:
        files_payload.append(("files", (personas_path.name, open(personas_path, "rb"))))
    try:
        resp = client.post(
            "/api/graph/ontology/generate",
            files=files_payload,
            data={"simulation_requirement": requirement},
            timeout=180,
        )
    finally:
        for _, (_, fh) in files_payload:
            fh.close()
    if not resp.get("success"):
        raise OrchestratorError(f"Falló la generación de ontología: {resp.get('error')}")
    state.project_id = resp["data"]["project_id"]
    state.stage = "graph"
    log(f"  -> project_id={state.project_id}")


def step_build_graph(client: MiroFishClient, state: RunState, max_wait: float, poll_interval: float) -> None:
    if state.stage not in ("graph",):
        return
    log("[2/8] Construyendo grafo de conocimiento (Zep)...")
    resp = client.post("/api/graph/build", json={"project_id": state.project_id}, timeout=60)
    if not resp.get("success"):
        raise OrchestratorError(f"Falló al iniciar el build del grafo: {resp.get('error')}")
    data = resp["data"]

    # OJO: 'reused: true' NO significa que ya terminó -- el backend lo devuelve
    # tanto si el build está en curso (con task_id para pollear, mensaje
    # 'graphBuilding') como si ya completó ('graphBuildComplete'). Confiar
    # ciegamente en 'reused' hizo que avanzáramos a simulación/reporte con un
    # grafo todavía incompleto, y el reporte lo rechazó con 409 repetidamente.
    # Por eso: si hay task_id, siempre pollear (es idempotente/barato incluso
    # si el task ya estaba 'completed'); solo se salta el polling si la
    # respuesta ya trae graph_id sin ningún task_id que consultar.
    task_id = data.get("task_id")
    if not task_id:
        if not data.get("graph_id"):
            raise OrchestratorError(f"Respuesta inesperada de /api/graph/build sin task_id ni graph_id: {data}")
        state.graph_id = data["graph_id"]
        state.stage = "sim_created"
        log(f"  -> graph_id={state.graph_id} (sin task_id que pollear, asumido completo)")
        return
    state.graph_build_task_id = task_id

    def check():
        r = client.get(f"/api/graph/task/{task_id}")
        d = r.get("data", {})
        if d.get("status") == "completed":
            return d
        if d.get("status") == "failed":
            raise OrchestratorError(f"Build del grafo falló: {d.get('error')}")
        return None

    def progress():
        r = client.get(f"/api/graph/task/{task_id}")
        d = r.get("data", {})
        log(f"  ... build del grafo: {d.get('progress', 0)}% ({d.get('message', '')})")

    result = poll_until(check, interval=poll_interval, max_wait=max_wait, stage_name="build del grafo", progress_fn=progress)
    state.graph_id = result["result"]["graph_id"]
    state.stage = "sim_created"
    log(f"  -> graph_id={state.graph_id} ({result['result'].get('node_count')} nodos, {result['result'].get('edge_count')} relaciones)")


def step_create_simulation(client: MiroFishClient, state: RunState) -> None:
    if state.stage not in ("sim_created",):
        return
    log("[3/8] Creando simulación...")
    resp = client.post(
        "/api/simulation/create",
        json={"project_id": state.project_id, "graph_id": state.graph_id},
        timeout=30,
    )
    if not resp.get("success"):
        raise OrchestratorError(f"Falló al crear la simulación: {resp.get('error')}")
    state.simulation_id = resp["data"]["simulation_id"]
    state.stage = "prepared"
    log(f"  -> simulation_id={state.simulation_id}")


def step_prepare(client: MiroFishClient, state: RunState, max_wait: float, poll_interval: float) -> None:
    if state.stage not in ("prepared",):
        return
    log("[4/8] Generando agentes/perfiles y configuración de simulación (LLM)...")
    resp = client.post("/api/simulation/prepare", json={"simulation_id": state.simulation_id}, timeout=60)
    if not resp.get("success"):
        raise OrchestratorError(f"Falló al iniciar prepare: {resp.get('error')}")
    data = resp["data"]

    if data.get("already_prepared"):
        state.stage = "simulated"
        info = data.get("prepare_info", {})
        log(f"  -> ya estaba preparada: {info.get('profiles_count', '?')} agentes")
        return

    task_id = data.get("task_id")
    state.prepare_task_id = task_id

    def check():
        r = client.post("/api/simulation/prepare/status", json={"task_id": task_id, "simulation_id": state.simulation_id})
        d = r.get("data", {})
        status = d.get("status")
        if status in ("ready", "completed"):
            return d
        if status == "failed":
            raise OrchestratorError(f"Prepare falló: {d.get('error')}")
        return None

    def progress():
        r = client.post("/api/simulation/prepare/status", json={"task_id": task_id, "simulation_id": state.simulation_id})
        d = r.get("data", {})
        log(f"  ... prepare: {d.get('progress', 0)}% ({d.get('message', '')})")

    poll_until(check, interval=poll_interval, max_wait=max_wait, stage_name="prepare", progress_fn=progress)
    state.stage = "simulated"
    log("  -> agentes y config listos")


def step_run_simulation(client: MiroFishClient, state: RunState, max_wait: float, poll_interval: float) -> None:
    if state.stage not in ("simulated",):
        return
    log(f"[5/8] Corriendo simulación (platform={state.platform}, max_rounds={state.max_rounds})...")
    resp = client.post(
        "/api/simulation/start",
        json={
            "simulation_id": state.simulation_id,
            "platform": state.platform,
            "max_rounds": state.max_rounds,
            "force": True,
        },
        timeout=60,
    )
    if not resp.get("success"):
        raise OrchestratorError(f"Falló al arrancar la simulación: {resp.get('error')}")

    def check():
        r = client.get(f"/api/simulation/{state.simulation_id}/run-status")
        d = r.get("data", {})
        status = d.get("runner_status")
        if status == "failed":
            raise OrchestratorError(
                f"La simulación falló (runner_status=failed): {d.get('error')}. "
                f"Revisar MiroFish/backend/uploads/simulations/{state.simulation_id}/simulation.log"
            )
        if status in ("completed", "stopped"):
            return d
        # Progreso 100% pero el proceso sigue en modo "esperar comandos"
        # (comportamiento normal de OASIS) -- hay que detenerlo a mano para
        # que pase a un estado terminal apto para generar reporte.
        if d.get("progress_percent") == 100 and status == "running":
            log("  -> ambas plataformas al 100%, deteniendo limpio...")
            stop_resp = client.post("/api/simulation/stop", json={"simulation_id": state.simulation_id}, timeout=30)
            return stop_resp.get("data", d)
        return None

    def progress():
        r = client.get(f"/api/simulation/{state.simulation_id}/run-status")
        d = r.get("data", {})
        log(
            f"  ... twitter r{d.get('twitter_current_round', 0)}/{state.max_rounds} "
            f"({d.get('twitter_actions_count', 0)} acciones) | "
            f"reddit r{d.get('reddit_current_round', 0)}/{state.max_rounds} "
            f"({d.get('reddit_actions_count', 0)} acciones)"
        )

    poll_until(check, interval=poll_interval, max_wait=max_wait, stage_name="simulación", progress_fn=progress)
    state.stage = "report"
    log("  -> simulación en estado terminal, lista para reporte")


def step_generate_report(client: MiroFishClient, state: RunState, max_wait: float, poll_interval: float, max_report_attempts: int) -> dict:
    if state.stage == "done" and state.output_path:
        return {}

    log("[6-8/8] Generando reporte final...")

    last_error = None
    for attempt in range(1, max_report_attempts + 1):
        resp = client.post(
            "/api/report/generate",
            json={"simulation_id": state.simulation_id, "force_regenerate": attempt > 1},
            timeout=30,
        )
        if not resp.get("success"):
            # 409: simulación no está en estado terminal todavía (barrera de
            # ingestión de Zep) -- esperar un poco y reintentar el POST, no
            # es un fallo real.
            if resp.get("_http_status") == 409:
                log(f"  ... {resp.get('error')} (reintentando en 15s)")
                time.sleep(15)
                continue
            raise OrchestratorError(f"No se pudo iniciar la generación del reporte: {resp.get('error')}")

        data = resp["data"]
        if data.get("already_generated"):
            report_id = data["report_id"]
        else:
            task_id = data["task_id"]
            report_id = data["report_id"]
            state.report_task_id = task_id

            def check():
                r = client.post("/api/report/generate/status", json={"task_id": task_id})
                d = r.get("data", {})
                if d.get("status") == "completed":
                    return d
                if d.get("status") == "failed":
                    raise StageTimeout(d.get("error", "fallo desconocido"))  # tratado como reintentable abajo
                return None

            def progress():
                r = client.post("/api/report/generate/status", json={"task_id": task_id})
                d = r.get("data", {})
                log(f"  ... reporte: {d.get('progress', 0)}%")

            try:
                poll_until(check, interval=poll_interval, max_wait=max_wait, stage_name="reporte", progress_fn=progress)
            except StageTimeout as exc:
                last_error = str(exc)
                log(
                    f"  intento {attempt}/{max_report_attempts} falló ({last_error[:200]}). "
                    f"Suele ser saturación transitoria de la API del proveedor de LLM -- reintentando..."
                )
                time.sleep(min(10 * attempt, 60))
                continue

        state.report_id = report_id
        report = client.get(f"/api/report/{report_id}")
        state.stage = "done"
        return report["data"]

    raise OrchestratorError(
        f"La generación del reporte falló {max_report_attempts} veces seguidas. "
        f"Último error: {last_error}. Esto puede significar que se agotó la cuota "
        f"gratuita de Groq Y del fallback de Gemini configurados en MiroFish/.env "
        f"-- revisar y, si hace falta, rotar LLM_FALLBACK_MODEL_NAME a otro modelo "
        f"vigente (ver https://ai.google.dev/gemini-api/docs/models para modelos "
        f"actuales) antes de reintentar con --resume."
    )


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE).strip().lower()
    return re.sub(r"[\s_-]+", "-", text) or "campana"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", nargs="?", help="Markdown/texto de la campaña (contexto + anuncio + landing)")
    parser.add_argument("--campaign", help="Nombre de campaña (default: derivado del nombre de archivo)")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--platform", default="parallel", choices=["parallel", "twitter", "reddit"])
    parser.add_argument("--max-rounds", type=int, default=20)
    parser.add_argument("--min-patient-agents", type=int, default=None, help="Fuerza un mínimo de agentes tipo paciente en el simulation_requirement (ignorado si se usa --personas / se autodetecta un archivo de personas)")
    parser.add_argument("--personas", metavar="PERSONAS_MD", help="Archivo de identidades sintéticas (salida de la skill synthetic-identity-architect) a incluir como segundo archivo semilla. Si se omite, se autodetecta en docs/mirofish-personas/<slug-de-campaña>.md")
    parser.add_argument("--no-personas", action="store_true", help="No autodetectar ni incluir ningún archivo de personas, aunque exista uno para esta campaña")
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--poll-interval", type=float, default=5.0)
    parser.add_argument("--max-wait-graph", type=float, default=1300, help="Debe ser mayor que ZEP_INGESTION_WAIT_TIMEOUT_SECONDS del backend de MiroFish (hoy 1200s en MiroFish/backend/app/utils/zep.py), si no el orquestador se rinde antes de que el propio MiroFish termine o falle de verdad")
    parser.add_argument("--max-wait-prepare", type=float, default=1200)
    parser.add_argument("--max-wait-simulation", type=float, default=7200)
    parser.add_argument("--max-wait-report", type=float, default=900)
    parser.add_argument("--max-report-attempts", type=int, default=5)
    parser.add_argument("--resume", metavar="STATE_JSON", help="Retomar una corrida guardada")
    parser.add_argument("--dry-run", action="store_true", help="Solo valida que MiroFish esté corriendo y sale")
    args = parser.parse_args()

    client = MiroFishClient(args.base_url)

    if args.dry_run:
        ok = client.health_check()
        if ok:
            log(f"MiroFish responde en {args.base_url}. Listo para orquestar.")
            return 0
        log(f"MiroFish NO responde en {args.base_url}. Iniciarlo con:")
        log("  cd MiroFish/backend && uv run python run.py")
        return 1

    if args.resume:
        state_path = Path(args.resume)
        state = RunState.load(state_path)
        log(f"Retomando corrida '{state.campaign_name}' desde etapa '{state.stage}' ({state_path})")
    else:
        if not args.source:
            parser.error("Falta el archivo de campaña (o usa --resume <state.json>)")
        source_path = Path(args.source)
        if not source_path.exists():
            log(f"No existe el archivo: {source_path}")
            return 1

        campaign_name = args.campaign or source_path.stem
        output_dir = Path(args.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        state_path = output_dir / f"{slugify(campaign_name)}-{timestamp}.state.json"

        state = RunState(
            source_file=str(source_path),
            campaign_name=campaign_name,
            base_url=args.base_url,
            platform=args.platform,
            max_rounds=args.max_rounds,
        )
        state.save(state_path)
        log(f"Nueva corrida '{campaign_name}'. Estado en: {state_path}")

    if not client.health_check():
        log(f"MiroFish no responde en {state.base_url}. Iniciarlo con:")
        log("  cd MiroFish/backend && uv run python run.py")
        log(f"Y reintentar con: --resume {state_path}")
        return 1

    source_path = Path(state.source_file)

    personas_path: Optional[Path] = None
    requirement = ""
    if state.stage in ("start", "ontology"):
        if state.personas_file:
            # Resumiendo una corrida que ya había resuelto qué archivo de
            # personas usar (aunque no haya llegado a subirlo) -- no
            # volver a autodetectar, usar el mismo para no cambiar de
            # elenco a mitad de camino.
            personas_path = Path(state.personas_file)
        elif not args.no_personas:
            personas_path = Path(args.personas) if args.personas else find_personas_file(state.campaign_name, source_path)
            if args.personas and not personas_path.is_file():
                log(f"No existe el archivo de personas indicado: {personas_path}")
                return 1

        persona_count = None
        if personas_path:
            persona_count = count_personas(personas_path.read_text(encoding="utf-8"))
            state.personas_file = str(personas_path)
            state.persona_count = persona_count
            log(f"Elenco de personas encontrado: {personas_path} ({persona_count} identidades)")
        elif not args.no_personas:
            log(
                "Sin archivo de personas para esta campaña (docs/mirofish-personas/ vacío o "
                "sin coincidencia) -- generá uno primero con la skill synthetic-identity-architect "
                "si querés evitar la duplicación de entidades del demo piloto. Continuando sin él."
            )

        requirement = build_simulation_requirement(
            source_path.read_text(encoding="utf-8"), args.min_patient_agents, persona_count
        )

    start_time = time.monotonic()
    try:
        step_ontology(client, state, source_path, requirement, personas_path)
        state.save(state_path)

        step_build_graph(client, state, args.max_wait_graph, args.poll_interval)
        state.save(state_path)

        step_create_simulation(client, state)
        state.save(state_path)

        step_prepare(client, state, args.max_wait_prepare, args.poll_interval)
        state.save(state_path)

        step_run_simulation(client, state, args.max_wait_simulation, args.poll_interval)
        state.save(state_path)

        report = step_generate_report(
            client, state, args.max_wait_report, args.poll_interval, args.max_report_attempts
        )
        state.save(state_path)

    except StageTimeout as exc:
        state.save(state_path)
        log(f"TIMEOUT: {exc}")
        log(f"Estado guardado. Para retomar: python {Path(__file__).name} --resume {state_path}")
        return 2
    except OrchestratorError as exc:
        state.save(state_path)
        log(f"ERROR: {exc}")
        return 1
    except Exception as exc:  # noqa: BLE001 - último resguardo: nunca dejar
        # un traceback crudo sin guardar el estado. Un bug propio del
        # orquestador (o de una librería) no debe verse distinto, para quien
        # lo invoca automatizado, de un fallo de negocio ya manejado arriba.
        state.save(state_path)
        log(f"ERROR INESPERADO ({type(exc).__name__}): {exc}")
        log(f"Estado guardado. Para retomar: python {Path(__file__).name} --resume {state_path}")
        return 1

    output_dir = Path(args.output_dir) if not args.resume else state_path.parent
    output_path = output_dir / f"{slugify(state.campaign_name)}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
    header = (
        f"---\n"
        f"campaña: {state.campaign_name}\n"
        f"archivo_fuente: {state.source_file}\n"
        + (f"archivo_personas: {state.personas_file} ({state.persona_count} identidades)\n" if state.personas_file else "")
        + f"simulation_id: {state.simulation_id}\n"
        f"report_id: {state.report_id}\n"
        f"generado: {datetime.now().isoformat()}\n"
        f"---\n\n"
    )
    output_path.write_text(header + report.get("markdown_content", ""), encoding="utf-8")
    state.output_path = str(output_path)
    state.save(state_path)

    elapsed = time.monotonic() - start_time
    log("=" * 60)
    log(f"Listo en {elapsed / 60:.1f} min. Campaña: {state.campaign_name}")
    log(f"simulation_id={state.simulation_id} report_id={state.report_id}")
    log(f"Reporte guardado en: {output_path}")
    outline = report.get("outline", {})
    if outline.get("sections"):
        log("Secciones del reporte:")
        for s in outline["sections"]:
            log(f"  - {s.get('title')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
