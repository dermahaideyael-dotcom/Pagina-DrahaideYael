import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAttribution } from '@/hooks/useAttribution'
import { initAnalytics, trackPageView } from '@/lib/analytics'

// Cada ruta se descarga solo cuando se visita, así una landing de anuncio
// (ej. /melasma) no le hace descargar al visitante el código de las otras
// páginas que nunca va a ver.
const Home = lazy(() => import('@/pages/Home'))
const Melasma = lazy(() => import('@/pages/Melasma'))
const Acne = lazy(() => import('@/pages/Acne'))
const CaidaCabello = lazy(() => import('@/pages/CaidaCabello'))
const Rejuvenecimiento = lazy(() => import('@/pages/Rejuvenecimiento'))

function App() {
  useAttribution()
  const location = useLocation()

  // Se ejecuta después del efecto de useAttribution() (los hooks de un mismo
  // componente corren sus efectos en el orden en que se llaman), así el
  // page_view inicial ya puede leer first_touch/last_touch recién capturados.
  useEffect(() => {
    initAnalytics()
  }, [])

  // Se dispara en la carga inicial y en cada cambio de ruta (trackPageView()
  // deduplica por URL exacta, así que no duplica el de la carga inicial).
  useEffect(() => {
    trackPageView()
  }, [location.pathname, location.search])

  return (
    <Suspense fallback={<div className="min-h-screen bg-nude-50" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/melasma" element={<Melasma />} />
        <Route path="/acne" element={<Acne />} />
        <Route path="/caida-cabello" element={<CaidaCabello />} />
        <Route path="/rejuvenecimiento" element={<Rejuvenecimiento />} />
      </Routes>
    </Suspense>
  )
}

export default App
