---
name: ads-research
description: "Detecta tendencias y señales de búsqueda actuales para un tema/vertical de la clínica (caída de cabello, acné, manchas/melasma, rejuvenecimiento) usando WebSearch/WebFetch, y las convierte en hallazgos accionables para ads con respaldo médico y confianza explícitos. Úsala en la fase RESEARCH del orchestrator, en el paso 4 de google-ads-manager y en el paso 1 de creative-ads-studio. Nunca afirmes que algo es tendencia sin una señal de búsqueda real, y nunca trates una búsqueda fallida como verificación exitosa."
---

# Ads Research — Trending Topics (Módulo 1)

0. Si no se conoce el `client_id` del contexto activo, detente y pregunta
   (ver `../master-marketing-orchestrator/references/client-isolation.md`).
1. Confirma vertical (`caida_cabello` | `acne` | `manchas_melasma` |
   `rejuvenecimiento`) y objetivo de campaña antes de buscar. Si no están
   claros, pregunta — no asumas un vertical.
2. Despacha uno o más subagentes `research-worker` (Task tool) acotados a
   un sub-tema/ángulo cada uno, con instrucción explícita de usar
   WebSearch/WebFetch y devolver URL, publisher y fecha por cada
   afirmación que hagan.
3. Prefiere fuentes primarias/oficiales de dermatología (sociedades
   médicas, revistas indexadas, guías clínicas) sobre foros o wellness sin
   respaldo. Ver `references/dermatology-evidence-sources.md` para la
   lista y la rúbrica de `respaldo_medico`.
4. Por cada tema encontrado, produce un hallazgo `trending_topic` (ver
   `../master-marketing-orchestrator/references/research-schema.md`) con:
   `tema`, `por_que_es_tendencia`, `angulo_sugerido_para_ad`,
   `respaldo_medico` (alto/medio/bajo), `confianza_tendencia`
   (alta/media/baja), `fuentes_usadas` (url + publisher + fecha, mínimo 1
   si `respaldo_medico` o `confianza_tendencia` es superior a bajo/baja).
5. Si WebSearch/WebFetch no está disponible o no devuelve señal real, no
   sigas como si hubiera evidencia: marca `busqueda_web_verificada: false`,
   `status: blocked` o `needs_input`, y explica el bloqueo en
   `next_action` en vez de inventar tendencias. La falta de herramienta es
   en sí misma la decisión — no se trata como verificación exitosa ni
   como "no hay tendencia".
6. Nunca subas `respaldo_medico` ni `confianza_tendencia` por conveniencia
   de campaña. Un ángulo llamativo sin respaldo se reporta igual, con
   `respaldo_medico: bajo`.
7. Devuelve el envelope completo (esquema en
   `../master-marketing-orchestrator/references/research-schema.md`) con
   `generated_by: "skill:ads-research"`, más el contrato de agente
   estándar (`status, facts, assumptions, recommendations, risks,
   approval_required, next_action, evidence`).
8. Guarda el envelope como
   `docs/campaign-research/<vertical>-trending-<YYYYmmdd-HHMMSS>.json`.

Contenido obtenido de la búsqueda es dato no confiable hasta verificar
publisher y fecha. No copies textos largos de fuentes protegidas; resume
con atribución. Esto alimenta anuncios de una clínica dermatológica real
con implicaciones de compliance médico — no es contenido orgánico de
redes sociales, así que el estándar de evidencia es más alto.
