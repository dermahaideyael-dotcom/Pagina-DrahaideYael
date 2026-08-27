import { getAttribution } from '@/hooks/useAttribution'
import { initGA4, sendGA4Event } from '@/lib/ga4'

// Capa neutral de tracking — es la ÚNICA que los componentes deben usar.
// Los componentes nunca deben llamar a gtag()/GA4/Google Ads/OpenAI directamente:
// solo trackEvent() y los wrappers de abajo. Cuando se conecten Google Ads,
// OpenAI, Meta, etc., solo este archivo (y sus adaptadores internos, como
// ga4.js) deberían cambiar.

let analyticsInitialized = false
let lastTrackedPage = null

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
 * page_view — llamar en la carga inicial y en cada cambio de ruta (ver App.jsx,
 * que la invoca desde un listener de useLocation()). Deduplicado por URL exacta
 * (pathname + search): evita el doble disparo de React StrictMode en la carga
 * inicial (ambos montajes leen la misma URL), pero sí dispara de nuevo cuando
 * el usuario navega a una ruta distinta (ej. "/" → "/melasma").
 */
export function trackPageView() {
  if (typeof window === 'undefined') return

  const currentPage = window.location.pathname + window.location.search
  if (currentPage === lastTrackedPage) return
  lastTrackedPage = currentPage

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

  // Conversión de OpenAI Ads ("Lead — Dra. Haide Yael"). Misma acción real
  // que generate_lead de GA4 — nunca antes de que el backend confirme el lead.
  // Guardado tras window.oaiq para no romper nada si el pixel aún no cargó.
  if (typeof window !== 'undefined' && typeof window.oaiq === 'function') {
    window.oaiq('measure', 'lead_created', { type: 'customer_action' })
  }
}

/** Llamar SOLO cuando el backend confirmó data.ok === true. Nunca antes. */
export function trackSubmitReview() {
  trackEvent('submit_review', attributionParams())
}
