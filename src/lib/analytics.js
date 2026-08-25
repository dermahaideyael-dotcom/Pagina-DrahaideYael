import { getAttribution } from '@/hooks/useAttribution'
import { initGA4, sendGA4Event } from '@/lib/ga4'

// Capa neutral de tracking — es la ÚNICA que los componentes deben usar.
// Los componentes nunca deben llamar a gtag()/GA4/Google Ads/OpenAI directamente:
// solo trackEvent() y los wrappers de abajo. Cuando se conecten Google Ads,
// OpenAI, Meta, etc., solo este archivo (y sus adaptadores internos, como
// ga4.js) deberían cambiar.

let analyticsInitialized = false
let initialPageViewSent = false

/** Inicializa todas las plataformas conectadas (hoy: solo GA4). Llamar una sola vez. */
export function initAnalytics() {
  if (typeof window === 'undefined' || analyticsInitialized) return
  analyticsInitialized = true
  initGA4()
}

/**
 * Solo campos de atribución no sensibles y de bajo cardinality — nunca PII,
 * nunca gclid/fbclid (esos se guardan en nuestra capa de atribución para
 * futuras integraciones con plataformas publicitarias, pero no se envían
 * como parámetros personalizados de GA4 sin una razón documentada).
 */
function attributionParams() {
  if (typeof window === 'undefined') return {}

  const { first_touch, last_touch } = getAttribution()

  const raw = {
    first_touch_source: first_touch.source,
    first_touch_medium: first_touch.medium,
    first_touch_campaign: first_touch.campaign,
    first_touch_content: first_touch.content,
    first_touch_term: first_touch.term,
    last_touch_source: last_touch.source,
    last_touch_medium: last_touch.medium,
    last_touch_campaign: last_touch.campaign,
    last_touch_content: last_touch.content,
    last_touch_term: last_touch.term,
    // first_touch_landing_page = página de entrada de la primera visita registrada.
    // last_touch_landing_page = página de entrada del último touch/campaña registrado.
    // current_page = página exacta en la que ocurre este evento ahora mismo.
    first_touch_landing_page: first_touch.landing_page,
    last_touch_landing_page: last_touch.landing_page,
    current_page: window.location.pathname + window.location.search,
  }

  // Quitar claves null/undefined para no mandar parámetros vacíos a GA4
  return Object.fromEntries(Object.entries(raw).filter(([, v]) => v != null))
}

/**
 * Envía un evento a través de todas las plataformas conectadas.
 * NUNCA debe romper la página — cualquier fallo se ignora en silencio.
 */
export function trackEvent(eventName, parameters = {}) {
  if (typeof window === 'undefined') return

  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName, ...parameters })

    sendGA4Event(eventName, parameters)

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[analytics] ${eventName}`, {
        params: parameters,
        timestamp: new Date().toISOString(),
      })
    }
  } catch {
    // El tracking nunca debe interrumpir la experiencia del usuario
  }
}

/**
 * page_view — llamar una sola vez en la carga inicial (ver App.jsx).
 * Protegido con un flag propio (independiente de initAnalytics) porque
 * React StrictMode ejecuta los efectos de montaje dos veces en desarrollo,
 * y esta función se invoca desde un useEffect distinto al de initAnalytics().
 * El día que se agregue un router con rutas propias (/acne, /melasma, etc.),
 * cada cambio de ruta debe volver a llamar trackPageView() de forma explícita
 * (ej. en un listener de cambio de ubicación) — este flag solo cubre la carga inicial.
 */
export function trackPageView() {
  if (initialPageViewSent) return
  initialPageViewSent = true
  trackEvent('page_view', attributionParams())
}

export function trackClickWhatsApp() {
  trackEvent('click_whatsapp', attributionParams())
}

export function trackClickPhone() {
  trackEvent('click_phone', attributionParams())
}

export function trackFormStart() {
  trackEvent('form_start', attributionParams())
}

/** Llamar SOLO cuando el backend confirmó data.ok === true. Nunca antes. */
export function trackGenerateLead() {
  trackEvent('generate_lead', attributionParams())
}

/** Llamar SOLO cuando el backend confirmó data.ok === true. Nunca antes. */
export function trackSubmitReview() {
  trackEvent('submit_review', attributionParams())
}
