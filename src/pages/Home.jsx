import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TreatmentHighlights from '@/components/TreatmentHighlights'
import VideoIntro from '@/components/VideoIntro'
import About from '@/components/About'
import Services from '@/components/Services'
import Pharmacy from '@/components/Pharmacy'
import Testimonials from '@/components/Testimonials'
import ConsultationSteps from '@/components/ConsultationSteps'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const GALLERY_SLIDES = [
  { name: 'cara', alt: 'Cuidado de piel — Dra. Haide Yael' },
  { name: 'brazos', alt: 'Atención personalizada — Dra. Haide Yael' },
  { name: 'crema', alt: 'Producto profesional — Dra. Haide Yael' },
  { name: 'luz-piel-natural', alt: 'Tu luz, tu esencia — Dra. Haide Yael' },
  { name: 'manos-pausa-para-ti', alt: 'Una pausa para ti — Dra. Haide Yael' },
  { name: 'piel-en-calma', alt: 'Tu piel, en calma — Dra. Haide Yael' },
  { name: 'ritual-hidratacion', alt: 'Pequeños rituales, grandes cuidados — Dra. Haide Yael' },
  { name: 'texturas-cuidado', alt: 'El arte de cuidarte — Dra. Haide Yael' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-nude-50 text-primary-900">
      <Header />
      <main>
        <Hero />
        <TreatmentHighlights />
        <VideoIntro />
        <About />
        <Services />
        <Pharmacy />
        <Testimonials />
        <ConsultationSteps bgClassName="bg-white" />
        <Gallery slides={GALLERY_SLIDES} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
