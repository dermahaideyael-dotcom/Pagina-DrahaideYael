import {
  ArrowRight,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import WhatsAppButton from '@/components/WhatsAppButton'
import { trackClickPhone, trackClickWhatsApp } from '@/lib/analytics'

const WHATSAPP_HREF =
  'https://wa.me/525584041696?text=' +
  encodeURIComponent('Hola, quiero agendar una valoración por manchas / melasma.') +
  '&utm_source=chatgpt&utm_medium=paid&utm_campaign=melasma'

const BENEFICIOS = [
  { title: 'Piel más uniforme', description: 'Tono de piel más parejo en las zonas tratadas.' },
  { title: 'Manchas visiblemente reducidas', description: 'Tratamientos según el tipo y profundidad del melasma.' },
  { title: 'Aspecto más luminoso', description: 'Mejora en la textura y luminosidad general de la piel.' },
  { title: 'Prevención de nuevas manchas', description: 'Protección solar médica como parte del plan.' },
]

const CAROUSEL_SLIDES = [
  { name: 'melasma-carrusel-1', alt: 'Manchas y melasma — Dra. Haide Yael' },
  { name: 'melasma-carrusel-2', alt: 'Manchas y melasma — Dra. Haide Yael' },
  { name: 'melasma-carrusel-3', alt: 'Manchas y melasma — Dra. Haide Yael' },
  { name: 'melasma-carrusel-4', alt: 'Manchas y melasma — Dra. Haide Yael' },
  { name: 'melasma-carrusel-5', alt: 'Daño solar acumulado' },
]

export default function Melasma() {
  return (
    <div className="min-h-screen bg-nude-50 text-primary-900">
      <Header />

      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden bg-nude-50 pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-nude-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />

          <div className="section-container relative grid items-center gap-12 md:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-nude-200 px-4 py-1.5 text-sm font-medium text-primary-800">
                Dermatología Clínica — Manchas y Melasma
              </span>

              <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-primary-900 md:text-5xl">
                ¿Tienes manchas o melasma?
              </h1>

              <p className="mt-4 text-xl font-medium text-accent-600">
                Diagnóstico dermatológico especializado, no cremas genéricas.
              </p>

              <p className="section-subtitle mt-5 text-nude-700">
                La Dra. Haide Yael evalúa tu piel de forma individual y diseña un
                plan de tratamiento realista, sustentado en evidencia científica,
                para ayudarte a manejar el melasma y las manchas del rostro.
              </p>

              <div className="mt-8">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackClickWhatsApp}
                  className="btn-primary"
                >
                  Agenda tu valoración
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] bg-white p-3 shadow-xl shadow-primary-900/10">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
                  <img
                    src="/doctora-800.webp"
                    srcSet="/doctora-480.webp 480w, /doctora-800.webp 800w"
                    sizes="(min-width: 768px) 500px, 90vw"
                    alt="Dra. Haide Yael, especialista en dermatología clínica"
                    width={800}
                    height={1000}
                    fetchpriority="high"
                    loading="eager"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Problema */}
        <section className="bg-white py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                El problema
              </span>
              <h2 className="section-title mt-6">¿Por qué aparecen las manchas?</h2>
              <p className="section-subtitle">
                Las manchas y el melasma pueden originarse por exposición solar,
                cambios hormonales o factores genéticos — identificar la causa
                es clave antes de cualquier tratamiento.
              </p>
            </div>
            <div>
              <img
                src="/images/melasma-problema.webp"
                alt="Por qué salen las manchas"
                width={600}
                height={760}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-[420px] rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* 3. Solución */}
        <section className="bg-nude-100 py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <img
                src="/images/melasma-solucion.webp"
                alt="Manchas"
                width={600}
                height={741}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-[420px] rounded-2xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
                La solución
              </span>
              <h2 className="section-title mt-6">Así trata la Dra. Haide el melasma</h2>
              <p className="section-subtitle">
                Con un diagnóstico dermatológico especializado, la Dra. Haide
                diseña un tratamiento personalizado que combina técnicas médicas
                con protección solar estricta para ayudar a uniformar el tono de
                tu piel.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Diagnóstico', 'Plan personalizado', 'Resultados naturales'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm"
                  >
                    <Sparkles size={14} className="text-primary-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Resultados / Beneficios */}
        <section className="bg-white py-20 md:py-28">
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Beneficios
              </span>
              <h2 className="section-title mt-6">Lo que buscamos lograr juntos</h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {BENEFICIOS.map((b) => (
                <div key={b.title} className="rounded-2xl border border-nude-200 bg-nude-50 p-6">
                  <p className="text-base font-bold text-primary-950">{b.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{b.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <img
                src="/images/melasma-beneficios.webp"
                alt="Qué mancha tienes"
                width={700}
                height={776}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-[480px] rounded-2xl"
              />
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-nude-500">
              Los resultados pueden variar según cada paciente y no garantizamos
              resultados específicos.
            </p>
          </div>
        </section>

        {/* 5. Equipamiento / Procedimiento */}
        <section className="bg-nude-100 py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
                Tecnología
              </span>
              <h2 className="section-title mt-6">Equipo y procedimientos</h2>
              <p className="section-subtitle">
                Empleamos <strong>láser</strong>, <strong>luz pulsada</strong> y{' '}
                <strong>tratamientos tópicos especializados</strong>,
                seleccionados según el tipo y profundidad de tus manchas.
              </p>
            </div>
            <div>
              <img
                src="/images/melasma-equipo.webp"
                alt="Tratamiento para manchas y melasma"
                width={600}
                height={746}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-[420px] rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* 6. CTA principal */}
        <section className="bg-primary-950 py-16 md:py-20">
          <div className="section-container text-center">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Agenda tu valoración por manchas o melasma
            </h2>
            <div className="mt-6">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackClickWhatsApp}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* 7. Galería / carrusel */}
        <section className="bg-white py-20 md:py-28">
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Galería
              </span>
              <h2 className="section-title mt-6">Manchas y melasma</h2>
            </div>
          </div>

          <Gallery slides={CAROUSEL_SLIDES} />
        </section>

        {/* 8. CTA secundario */}
        <section className="bg-nude-100 py-16 md:py-20">
          <div className="section-container grid items-center gap-8 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">
            <div>
              <h3 className="font-display text-2xl font-bold text-primary-950">
                ¿Lista para tratar tus manchas?
              </h3>
              <p className="mt-3 text-sm text-nude-600">
                Escríbenos por WhatsApp o llámanos — consultorio en Plaza
                Mandarina Interlomas, Huixquilucan, Estado de México. Lun - Vie:
                10:00 AM - 8:00 PM · Sáb: 8:00 AM - 3:00 PM.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row md:justify-end">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackClickWhatsApp}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href="tel:+525584041696"
                onClick={trackClickPhone}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-nude-300 bg-nude-50 px-6 py-3.5 text-sm font-semibold text-primary-800 transition hover:bg-nude-100"
              >
                <Phone size={18} />
                Llamar 55 8404 1696
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
