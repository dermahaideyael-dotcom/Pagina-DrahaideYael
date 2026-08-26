import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Pharmacy from '@/components/Pharmacy'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Home() {
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
