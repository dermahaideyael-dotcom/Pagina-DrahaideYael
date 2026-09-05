# Esquema de investigación pre-campaña (RESEARCH)

Usado por las skills `ads-research` y `ads-competitor`, y por
`scripts/campaign_research.py` (que mantiene su propia copia en código de
estos mismos campos — `TRENDING_OUTPUT_SCHEMA` / `COMPETITOR_OUTPUT_SCHEMA`;
si cambia uno, actualizar el otro a mano).

El envelope **es** el contrato de agente de `agent-contracts.md`
(`status`, `facts`, `assumptions`, `recommendations`, `risks`,
`approval_required`, `next_action`, `evidence`), extendido con los campos
de abajo. Esto es intencional: cualquier consumidor que ya sepa leer el
contrato de agente estándar puede leer un envelope de research sin código
especial.

## Envelope

```json
{
  "client_id": "dra-haide-yael-guerrero",
  "research_type": "trending_topics",
  "vertical": "manchas_melasma",
  "generated_at": "2026-09-04T12:00:00-06:00",
  "generated_by": "skill:ads-research",
  "busqueda_web_verificada": true,
  "status": "ready",
  "facts": [],
  "assumptions": [],
  "recommendations": [],
  "risks": [],
  "approval_required": false,
  "next_action": "",
  "evidence": [
    {
      "url": "https://...",
      "publisher": "Academia Mexicana de Dermatología",
      "fecha_publicacion": "2026-06-01",
      "fecha_consulta": "2026-09-04",
      "confianza": "alta",
      "licencia_o_uso": "resumen con atribución, sin copia de texto extenso",
      "refresh_due": "2026-12-04"
    }
  ],
  "findings": []
}
```

- `research_type`: `"trending_topics"` (Módulo 1) o `"competitor_ads"`
  (Módulo 2).
- `vertical`: uno de `caida_cabello`, `acne`, `manchas_melasma`,
  `rejuvenecimiento`, u `otro`.
- `generated_by`: identifica el origen, ej. `"skill:ads-research"` o
  `"script:campaign_research.py"` — así se puede distinguir Track A de
  Track B sin cambiar el resto del esquema.
- `busqueda_web_verificada`: `false` cuando no hubo señal real de
  búsqueda (WebSearch/WebFetch no disponible, o `BRAVE_API_KEY` ausente/
  fallando en el script). Nunca se pone `true` con hallazgos inventados.
- `findings`: lista de objetos tipados por `tipo` (ver abajo).

## `trending_topic` (Módulo 1)

```json
{
  "tipo": "trending_topic",
  "tema": "Manchas post-inflamatorias por acné en piel morena",
  "por_que_es_tendencia": "...",
  "angulo_sugerido_para_ad": "...",
  "respaldo_medico": "alto",
  "confianza_tendencia": "media",
  "fuentes_usadas": [
    {"url": "https://...", "titulo": "...", "publisher": "...", "fecha": "2026-05-10"}
  ]
}
```

- `respaldo_medico` ∈ `{alto, medio, bajo}` — ver
  `../../ads-research/references/dermatology-evidence-sources.md` para la
  rúbrica exacta. Es evidencia dermatológica real, no popularidad en redes.
- `confianza_tendencia` ∈ `{alta, media, baja}` — qué tan segura es la
  señal de que esto es tendencia ahora mismo.
- `fuentes_usadas`: obligatorio con al menos 1 entrada real cuando
  `respaldo_medico` o `confianza_tendencia` es superior a `bajo`/`baja`.
  Sin fuente real, ambos campos deben quedar en su nivel más bajo.

## `competitor_ad` (Módulo 2, Ruta B)

```json
{
  "tipo": "competitor_ad",
  "pagina_anunciante": "Clínica X",
  "link_ad_library": "https://www.facebook.com/ads/library/?...",
  "pais": "MX",
  "fecha_captura": "2026-09-04",
  "angulos_detectados": [],
  "hooks_usados": [],
  "ctas_usados": [],
  "patron_creativo": "imagen",
  "lo_que_parece_funcionar": "...",
  "oportunidad_diferenciacion": "...",
  "observado_directamente": true,
  "texto_pegado_por": "usuario"
}
```

- `observado_directamente: false` es obligatorio (y
  `angulos_detectados`/`hooks_usados`/`ctas_usados`/
  `lo_que_parece_funcionar` deben quedar vacíos) mientras no se haya pegado
  texto real observado — el finding es entonces solo un link para revisión
  manual, nunca un análisis inventado.
- `lo_que_parece_funcionar` es siempre una inferencia (ej. a partir de
  cuánto tiempo lleva corriendo el anuncio) — nunca se presenta como hecho
  de rendimiento real, porque Ruta B no tiene acceso a métricas reales de
  la cuenta del competidor.
