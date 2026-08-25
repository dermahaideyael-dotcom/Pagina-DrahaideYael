import { useEffect } from 'react'
import { useAttribution } from '@/hooks/useAttribution'
import { initAnalytics, trackPageView } from '@/lib/analytics'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Pharmacy from '@/components/Pharmacy'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

function App() {
  useAttribution()

  // Se ejecuta después del efecto de useAttribution() (los hooks de un mismo
  // componente corren sus efectos en el orden en que se llaman), así el
  // page_view inicial ya puede leer first_touch/last_touch recién capturados.
  useEffect(() => {
    initAnalytics()
    trackPageView()
  }, [])

  return (
    <div className="min-h-screen bg-nude-50 text-primary-900">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Pharmacy />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
