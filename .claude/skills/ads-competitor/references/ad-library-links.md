# Formato de links de la Meta Ad Library (Ruta B)

La Ad Library pública (`https://www.facebook.com/ads/library/`) es
navegable sin login para cualquier página/anunciante y cualquier país.
Estos son los dos formatos de URL a generar — nunca se scrapea esta
página, solo se construye el link y se entrega al usuario para revisión
manual.

## Con `page_id` conocido

```
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=<PAIS>&search_type=page&view_all_page_id=<PAGE_ID>
```

## Sin `page_id` (fallback por nombre)

```
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=<PAIS>&q=<NOMBRE_URL_ENCODED>&search_type=keyword_unordered&media_type=all
```

`<NOMBRE_URL_ENCODED>` debe ir codificado para URL (espacios como `%20` o
`+`, acentos escapados).

## Reglas

- `<PAIS>` es siempre un código de país de 2 letras real (México = `MX`).
  No inventar códigos de país.
- Un competidor = un link. Nunca combinar varios competidores en una sola
  query — cada uno debe poder revisarse y compartirse por separado.
- `active_status=active` muestra solo anuncios corriendo actualmente, que
  es la señal más útil para "qué está probando el competidor ahora" y
  para inferir "cuánto lleva corriendo = posible señal de que funciona".
  Si se quiere ver histórico/inactivos, cambiar a `active_status=all`
  explícitamente y decirlo en el hallazgo.

## Ejemplo (México, sin page_id)

Competidor: "Clínica Dermatológica Ejemplo"

```
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=MX&q=Cl%C3%ADnica%20Dermatol%C3%B3gica%20Ejemplo&search_type=keyword_unordered&media_type=all
```
