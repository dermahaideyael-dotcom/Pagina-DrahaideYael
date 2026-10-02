import {
  ArrowRight,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'
import WhatsAppButton from '@/components/WhatsAppButton'
import ImageCarousel from '@/components/ImageCarousel'
import Reveal from '@/components/Reveal'
import ConsultationSteps from '@/components/ConsultationSteps'
import { trackClickPhone, trackClickWhatsApp } from '@/lib/analytics'

const WHATSAPP_HREF =
  'https://wa.me/525584041696?text=' +
  encodeURIComponent('Hola, quiero agendar una valoración por acné / cicatrices.') +
  '&utm_source=chatgpt&utm_medium=paid&utm_campaign=acne'

const BENEFICIOS = [
  { title: 'Piel más clara y uniforme', description: 'Reducción visible de brotes activos e inflamación.' },
  { title: 'Cicatrices visiblemente reducidas', description: 'Tratamientos orientados a mejorar textura y marcas.' },
  { title: 'Menos brotes recurrentes', description: 'Un plan que ataca la causa, no solo el síntoma.' },
  { title: 'Confianza restaurada', description: 'Acompañamiento médico en cada etapa del proceso.' },
]

const CAROUSEL_SLIDES = [
  { src: '/images/gallery-acne-1.webp', alt: 'Valoración dermatológica de acné' },
  { src: '/images/gallery-acne-2.webp', alt: 'Limpieza suave de piel con acné' },
  { src: '/images/gallery-acne-3.webp', alt: 'Cuidado de piel con acné' },
  { src: '/images/gallery-acne-4.webp', alt: 'Paciente con acné' },
  { src: '/images/gallery-acne-5.webp', alt: 'Paciente con acné' },
]

export default function Acne() {
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
                Dermatología Clínica — Acné y Cicatrices
              </span>

              <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-primary-900 md:text-5xl">
                ¿Tienes acné o cicatrices?
              </h1>

              <p className="mt-4 text-xl font-medium text-accent-600">
                Diagnóstico dermatológico especializado, no productos genéricos.
              </p>

              <p className="section-subtitle mt-5 text-nude-700">
                La Dra. Haide Yael evalúa tu piel de forma individual y diseña un
                plan de tratamiento realista, sustentado en evidencia científica,
                para ayudarte a manejar el acné y sus secuelas.
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

        {/* 2. CTA — piel sin acné */}
        <section className="bg-white py-14 sm:py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <ImageCarousel slides={CAROUSEL_SLIDES} />
            </Reveal>

            <Reveal delay={150}>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Empieza hoy
              </span>
              <h2 className="section-title mt-6">
                Una piel más clara empieza con un buen diagnóstico
              </h2>
              <p className="section-subtitle">
                Identificar la causa real de tu acné es el primer paso para
                tratarlo de forma efectiva, controlar los brotes y prevenir
                nuevas cicatrices.
              </p>

              <div className="mt-8">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackClickWhatsApp}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  Agenda tu valoración
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. Problema */}
        <section className="bg-white py-14 sm:py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                El problema
              </span>
              <h2 className="section-title mt-6">¿Por qué aparece el acné?</h2>
              <p className="section-subtitle">
                El acné puede aparecer por cambios hormonales, estrés o el uso
                de productos inadecuados, y en la etapa adulta suele ser más
                persistente y dejar marcas si no se trata a tiempo.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <img
                src="/images/placeholder-acne.webp"
                alt="Acné"
                width={400}
                height={436}
                loading="lazy"
                className="mx-auto w-full max-w-[400px] rounded-2xl"
              />
            </Reveal>
          </div>
        </section>

        {/* 4. Solución */}
        <section className="bg-nude-100 py-14 sm:py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <Reveal delay={150} className="order-2 md:order-1">
              <img
                src="/images/placeholder-solution-acne.webp"
                alt="Solución para el acné"
                width={400}
                height={464}
                loading="lazy"
                className="mx-auto w-full max-w-[400px] rounded-2xl"
              />
            </Reveal>
            <Reveal className="order-1 md:order-2">
              <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
                La solución
              </span>
              <h2 className="section-title mt-6">Así trata la Dra. Haide el acné</h2>
              <p className="section-subtitle">
                La Dra. Haide combina limpieza profunda, tratamientos médicos
                específicos según tu tipo de acné y un plan de cuidado
                post-tratamiento para ayudar a controlar los brotes y prevenir
                nuevas cicatrices.
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
            </Reveal>
          </div>
        </section>

        {/* Tu primera consulta */}
        <ConsultationSteps bgClassName="bg-nude-50" />

        {/* 5. Resultados / Beneficios */}
        <section className="bg-white py-14 sm:py-20 md:py-28">
          <div className="section-container">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Beneficios
              </span>
              <h2 className="section-title mt-6">Lo que buscamos lograr juntos</h2>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {BENEFICIOS.map((b, i) => (
                <Reveal key={b.title} delay={(i % 2) * 100} className="rounded-2xl border border-nude-200 bg-nude-50 p-6">
                  <p className="text-base font-bold text-primary-950">{b.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{b.description}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10">
              <img
                src="/images/placeholder-before-after-acne.webp"
                alt="Antes y después — tratamiento de acné"
                width={500}
                height={525}
                loading="lazy"
                className="mx-auto w-full max-w-[500px] rounded-2xl"
              />
            </Reveal>

            <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-nude-500">
              Los resultados pueden variar según cada paciente y no garantizamos
              resultados específicos.
            </p>
          </div>
        </section>

        {/* 6. Equipamiento / Procedimiento */}
        <section className="bg-nude-100 py-14 sm:py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
                Tecnología
              </span>
              <h2 className="section-title mt-6">Equipo y procedimientos</h2>
              <p className="section-subtitle">
                Tratamientos especializados y personalizados según el tipo de
                acné y las necesidades de tu piel, siempre con un enfoque
                médico personalizado.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <img
                src="/images/placeholder-equipo-acne.webp"
                alt="Equipo utilizado en el tratamiento de acné"
                width={400}
                height={456}
                loading="lazy"
                className="mx-auto w-full max-w-[400px] rounded-2xl"
              />
            </Reveal>
          </div>
        </section>

        {/* 7. CTA principal */}
        <section className="bg-primary-950 py-12 sm:py-16 md:py-20">
          <div className="section-container text-center">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Agenda tu valoración por acné o cicatrices
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

        {/* 8. CTA secundario */}
        <section className="bg-nude-100 py-12 sm:py-16 md:py-20">
          <div className="section-container grid items-center gap-8 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">
            <div>
              <h3 className="font-display text-2xl font-bold text-primary-950">
                ¿Listo para tratar tu acné?
              </h3>
              <p className="mt-3 text-sm text-nude-600">
                Escríbenos por WhatsApp o llámanos — consultorio en Plaza
                Mandarina Interlomas, Huixquilucan, Estado de México. Lun - Vie:
                10:00 AM - 8:00 PM · Sáb: 8:00 AM - 4:00 PM.
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
                href="tel:+525552915654"
                onClick={trackClickPhone}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-nude-300 bg-nude-50 px-6 py-3.5 text-sm font-semibold text-primary-800 transition hover:bg-nude-100"
              >
                <Phone size={18} />
                Llamar 55 5291 5654
              </a>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
