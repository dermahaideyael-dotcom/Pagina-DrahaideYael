import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAttribution } from '@/hooks/useAttribution'
import { initAnalytics, trackPageView } from '@/lib/analytics'
import Home from '@/pages/Home'
import Melasma from '@/pages/Melasma'
import Acne from '@/pages/Acne'
import CaidaCabello from '@/pages/CaidaCabello'
import Rejuvenecimiento from '@/pages/Rejuvenecimiento'

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/melasma" element={<Melasma />} />
      <Route path="/acne" element={<Acne />} />
      <Route path="/caida-cabello" element={<CaidaCabello />} />
      <Route path="/rejuvenecimiento" element={<Rejuvenecimiento />} />
    </Routes>
  )
}

export default App
