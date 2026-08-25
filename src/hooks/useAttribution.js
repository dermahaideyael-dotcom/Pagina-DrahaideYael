import { useEffect } from 'react'

const FIRST_TOUCH_KEY = 'dha_attribution_first_touch'
const LAST_TOUCH_KEY = 'dha_attribution_last_touch'

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const CLICK_ID_PARAMS = ['gclid', 'fbclid']

const EMPTY_TOUCH = {
  source: null,
  medium: null,
  campaign: null,
  content: null,
  term: null,
  gclid: null,
  fbclid: null,
  landing_page: null,
  referrer: null,
  timestamp: null,
}

function safeGetItem(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // localStorage no disponible (modo privado, cuota llena, etc.) — no bloquear la app
  }
}

function readTouchFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const touch = {}

  UTM_PARAMS.forEach((key) => {
    touch[key.replace('utm_', '')] = params.get(key) || null
  })
  CLICK_ID_PARAMS.forEach((key) => {
    touch[key] = params.get(key) || null
  })

  touch.landing_page = window.location.pathname + window.location.search
  touch.referrer = document.referrer || null
  touch.timestamp = new Date().toISOString()

  return touch
}

function hasCampaignData(touch) {
  return Boolean(
    touch.source || touch.medium || touch.campaign || touch.content ||
    touch.term || touch.gclid || touch.fbclid
  )
}

/**
 * Lee los parámetros de campaña de la URL actual y actualiza first_touch/last_touch
 * en localStorage. first_touch se escribe una sola vez en la vida del navegador y
 * nunca se sobrescribe. last_touch se actualiza solo cuando la visita trae datos de
 * campaña nuevos (si el usuario navega sin UTM/gclid/fbclid, se conserva el último
 * touch de campaña que sí existió).
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return

  const currentTouch = readTouchFromUrl()

  if (!safeGetItem(FIRST_TOUCH_KEY)) {
    safeSetItem(FIRST_TOUCH_KEY, JSON.stringify(currentTouch))
  }

  if (hasCampaignData(currentTouch)) {
    safeSetItem(LAST_TOUCH_KEY, JSON.stringify(currentTouch))
  } else if (!safeGetItem(LAST_TOUCH_KEY)) {
    // Todavía no hay ningún last_touch guardado (primera visita, sin campaña) —
    // se inicializa con la visita actual para no dejarlo vacío indefinidamente.
    safeSetItem(LAST_TOUCH_KEY, JSON.stringify(currentTouch))
  }
}

/** Lee first_touch/last_touch ya guardados, sin volver a leer la URL. */
export function getAttribution() {
  try {
    const first = JSON.parse(safeGetItem(FIRST_TOUCH_KEY) || 'null') || EMPTY_TOUCH
    const last = JSON.parse(safeGetItem(LAST_TOUCH_KEY) || 'null') || EMPTY_TOUCH
    return { first_touch: first, last_touch: last }
  } catch {
    return { first_touch: EMPTY_TOUCH, last_touch: EMPTY_TOUCH }
  }
}

/** Aplana { first_touch, last_touch } a claves planas first_touch_source, last_touch_medium, etc. */
export function flattenAttribution(attribution) {
  const flat = {}

  ;['first_touch', 'last_touch'].forEach((key) => {
    const touch = attribution[key] || EMPTY_TOUCH
    flat[`${key}_source`] = touch.source ?? null
    flat[`${key}_medium`] = touch.medium ?? null
    flat[`${key}_campaign`] = touch.campaign ?? null
    flat[`${key}_content`] = touch.content ?? null
    flat[`${key}_term`] = touch.term ?? null
    flat[`${key}_gclid`] = touch.gclid ?? null
    flat[`${key}_fbclid`] = touch.fbclid ?? null
    flat[`${key}_landing_page`] = touch.landing_page ?? null
    flat[`${key}_timestamp`] = touch.timestamp ?? null
  })

  return flat
}

/** Ejecuta captureAttribution() una sola vez al montar la app. */
export function useAttribution() {
  useEffect(() => {
    captureAttribution()
  }, [])
}
