// Adaptador aislado del OpenAI Ads Pixel — completamente independiente de
// GA4 (ga4.js/analytics.js). No envía ningún evento todavía, solo carga
// el SDK base. Los eventos de conversión se agregarán en una fase posterior,
// explícitamente autorizada.

const PIXEL_ID = 'BDFMUGidMnEQhtfSRBYKZC'

// Guard propio (independiente del de GA4) para que, aunque este efecto se
// dispare más de una vez (ej. React StrictMode en desarrollo), oaiq('init', ...)
// solo se llame una sola vez desde nuestro código.
let initialized = false

export function initOpenAIPixel() {
  if (typeof window === 'undefined' || initialized) return
  initialized = true

  // Si ya existe window.oaiq (otra instalación previa del pixel), no
  // volvemos a inyectar el script ni a llamar a init — evita duplicados.
  if (window.oaiq) return

  // Snippet oficial de OpenAI Ads Manager, sin modificar.
  ;(function (w, d, s, u) {
    if (w.oaiq) return
    var q = function () {
      q.q.push(arguments)
    }
    q.q = []
    w.oaiq = q
    var j = d.createElement(s)
    j.async = 1
    j.src = u
    var f = d.getElementsByTagName(s)[0]
    f.parentNode.insertBefore(j, f)
  })(window, document, 'script', 'https://bzrcdn.openai.com/sdk/oaiq.min.js')

  window.oaiq('init', { pixelId: PIXEL_ID, debug: true })
}
