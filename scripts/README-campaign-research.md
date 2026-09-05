# campaign_research.py

Investigación pre-campaña (tendencias + competidores) para uso sin sesión
de Claude Code abierta. Es el equivalente headless de las skills
`ads-research` / `ads-competitor` (`.claude/skills/`) — mismo esquema de
salida, ver
`.claude/skills/master-marketing-orchestrator/references/research-schema.md`.

Este script usa su **propio venv**, separado del que usan
`mirofish_orchestrator.py`/`condense_personas.py` (esos dependen del venv
externo de MiroFish; este no tiene nada que ver con MiroFish).

## Setup (una sola vez)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r scripts\requirements-campaign-research.txt
```

Agregar a `.env` (raíz del repo, ver `.env.example`):

```
ANTHROPIC_API_KEY=sk-ant-...
BRAVE_API_KEY=BSA...
```

`BRAVE_API_KEY` se obtiene en https://brave.com/search/api/. Sin ella,
`--trending` sigue corriendo pero marca `busqueda_web_verificada: false` y
no inventa ninguna tendencia.

## Uso

```powershell
.venv\Scripts\Activate.ps1

# Módulo 1 — tendencias
python scripts\campaign_research.py --trending --topic "tendencias melasma 2026" --vertical manchas_melasma

# Módulo 2, Ruta B — generar links de Ad Library (offline, sin API keys)
python scripts\campaign_research.py --generate-ad-library-links --competitors "Clínica X,Dra. Y" --country MX

# Módulo 2, Ruta B — analizar texto de anuncio ya revisado y pegado a mano
python scripts\campaign_research.py --analyze-pasted anuncio_competidor.txt --competitor "Clínica X"
```

Salida en `docs/campaign-research/<slug>-<trending|competitor>-<fecha-hora>.json`.

Nunca scrapea la Ad Library de Meta ni inventa contenido de anuncios que no
fue pegado por el usuario.
