---
name: ads-competitor
description: "Genera links directos a la Meta Ad Library pública (Ruta B, sin credenciales ni scraping) para revisar manualmente anuncios de competidores de la clínica, y analiza con Claude el texto de anuncios que el usuario/doctora pegue tras revisarlos. Úsala en el paso 4 de google-ads-manager y el paso 1 de creative-ads-studio cuando haya competidores nombrados. Nunca scrapees Ad Library ni inventes contenido de anuncios que no fue pegado/observado."
---

# Ads Competitor — Competitor Ad Intelligence (Módulo 2, Ruta B)

0. Si no se conoce el `client_id` del contexto activo, detente y pregunta.
1. Confirma competidores nombrados (página o nombre de marca), país/
   geografía y objetivo antes de generar nada. Si el usuario no nombró
   competidores concretos, pregunta — no los inventes ni los asumas.
2. Genera el link de Ad Library apropiado (ver
   `references/ad-library-links.md` para el formato exacto):
   - Si se conoce el `page_id` de Meta: usa la variante
     `view_all_page_id=<PAGE_ID>`.
   - Si solo se conoce el nombre: usa la variante de búsqueda por término
     (`search_type=keyword_unordered&q=<NOMBRE>`) como fallback.
3. Entrega los links al usuario/doctora para revisión manual. No
   scrapees Ad Library, no automatices su fetch, no uses herramientas de
   terceros no contratadas (Meta Developer API, Foreplay, PowerAdSpy,
   BigSpy, Winning Hunter, Sensor Tower, etc.) salvo que el usuario
   confirme explícitamente que ya tiene esas credenciales — en ese caso,
   pregunta antes de asumir que se puede usar automatización adicional.
4. Cuando el usuario pegue texto observado (copy, hooks, CTA, tiempo
   corriendo, formato), analiza SOLO ese texto pegado y produce un
   hallazgo `competitor_ad` (esquema en
   `../master-marketing-orchestrator/references/research-schema.md`):
   `pagina_anunciante`, `link_ad_library`, `pais`, `fecha_captura`,
   `angulos_detectados`, `hooks_usados`, `ctas_usados`, `patron_creativo`
   (imagen/video/carrusel/desconocido), `lo_que_parece_funcionar`
   (inferencia explícita a partir del tiempo corriendo, marcada como
   inferencia, nunca como hecho), `oportunidad_diferenciacion`,
   `observado_directamente: true`.
5. Si no hay texto pegado todavía, el hallazgo se limita a
   `link_ad_library` + `pagina_anunciante` con
   `observado_directamente: false` y `status: needs_input` — nunca
   completes `angulos_detectados`/`hooks_usados`/etc. sin texto real
   pegado.
6. Separa siempre observación directa (lo que el usuario pegó) de
   inferencia (spend, performance, estrategia) — nunca presentes una
   inferencia como si fuera un dato de cuenta real del competidor.
7. Devuelve el envelope con `generated_by: "skill:ads-competitor"`, más el
   contrato de agente estándar.
8. Guarda el envelope como
   `docs/campaign-research/<competidor-slug>-competitor-<YYYYmmdd-HHMMSS>.json`.

Respeta los términos de uso de Meta, no uses autenticación no autorizada,
no reproduzcas creatividad protegida más allá de lo necesario para el
análisis interno.
