// Adaptador interno de GA4 — SOLO analytics.js debe importar este archivo.
// Los componentes nunca deben llamar nada de aquí directamente (ver analytics.js).

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID

let scriptInjected = false

/**
 * Punto único donde debería conectarse un futuro sistema de consentimiento
 * (CMP). Cuando se implemente, esta función debe devolver `false` hasta que
 * el usuario haya aceptado analítica, y GA4 no se cargará ni disparará nada.
 * Hoy siempre devuelve true — no bloquea nada.
 */
function hasAnalyticsConsent() {
  return true
}

export function isGA4Configured() {
  return typeof window !== 'undefined' && Boolean(GA4_ID) && hasAnalyticsConsent()
}

/** Inyecta gtag.js una sola vez y configura GA4 sin enviar page_view automático. */
export function initGA4() {
  if (!isGA4Configured() || scriptInjected) return
  scriptInjected = true

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  // send_page_view: false — el page_view se dispara explícitamente desde
  // analytics.js (trackPageView), para controlar exactamente cuándo y evitar duplicados.
  window.gtag('config', GA4_ID, { send_page_view: false })
}

export function sendGA4Event(eventName, params) {
  if (!isGA4Configured() || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
