import {
  ArrowRight,
  MessageCircle,
  Phone,
  Search,
  Sun,
  Layers,
  ClipboardList,
  Stethoscope,
  CalendarCheck,
  MapPin,
  Clock,
  FlaskConical,
  Zap,
  Droplets,
  ShieldCheck,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { trackClickPhone, trackClickWhatsApp } from '@/lib/analytics'

const WHATSAPP_HREF =
  'https://wa.me/525584041696?text=' +
  encodeURIComponent('Hola, quiero agendar una valoración por manchas / melasma.') +
  '&utm_source=chatgpt&utm_medium=paid&utm_campaign=melasma'

const CAUSES = [
  {
    icon: Sun,
    title: '¿Qué es el melasma?',
    description:
      'Manchas de tono marrón o grisáceo que suelen aparecer en frente, mejillas, nariz y labio superior, por un aumento localizado de la pigmentación de la piel.',
  },
  {
    icon: Layers,
    title: '¿Por qué aparece?',
    description:
      'Combina factores hormonales, exposición solar y predisposición genética — por eso puede aparecer o intensificarse en embarazo, con anticonceptivos o tras tomar el sol sin protección adecuada.',
  },
  {
    icon: Search,
    title: '¿Por qué es difícil tratarlo solo?',
    description:
      'Cremas genéricas y remedios caseros no distinguen el tipo de melasma ni su profundidad — sin un diagnóstico dermatológico, es común invertir tiempo y dinero en productos que no atacan la causa real.',
  },
]

const TREATMENTS = [
  {
    icon: FlaskConical,
    title: 'Tratamiento tópico médico',
    description: 'Fórmulas despigmentantes prescritas según el tipo y profundidad de tus manchas.',
  },
  {
    icon: Droplets,
    title: 'Peelings químicos',
    description: 'Renovación celular controlada para ayudar a uniformar el tono de la piel.',
  },
  {
    icon: Zap,
    title: 'Microagujas',
    description: 'Estimulación de la piel que puede combinarse con activos despigmentantes.',
  },
  {
    icon: ShieldCheck,
    title: 'Protección solar médica',
    description: 'Pieza clave de cualquier plan: sin protección adecuada, el melasma tiende a reaparecer.',
  },
]

const EXPECTATIONS = [
  {
    icon: ClipboardList,
    step: '1',
    title: 'Valoración y diagnóstico',
    description:
      'La Dra. Haide evalúa tu piel, identifica el tipo de melasma y sus posibles causas antes de proponer cualquier tratamiento.',
  },
  {
    icon: Stethoscope,
    step: '2',
    title: 'Plan personalizado',
    description:
      'Se diseña un plan según tu piel y tu caso particular — no existe un tratamiento único que funcione igual para todas las personas.',
  },
  {
    icon: CalendarCheck,
    step: '3',
    title: 'Seguimiento y ajustes',
    description:
      'El melasma suele requerir varias sesiones y ajustes en el tiempo. Los resultados pueden variar según cada paciente.',
  },
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
                    srcSet={`/doctora-480.webp 480w, /doctora-800.webp 800w`}
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
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Entendiendo el melasma
              </span>
              <h2 className="section-title mt-6">No todas las manchas son iguales</h2>
              <p className="section-subtitle mx-auto">
                Antes de tratar el melasma es necesario entender qué lo provoca —
                por eso un diagnóstico dermatológico hace la diferencia.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {CAUSES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-nude-200 bg-nude-50 p-7 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-primary-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-nude-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Autoridad */}
        <section className="py-20 md:py-28">
          <div className="section-container grid items-center gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="rounded-[2rem] bg-white p-3 shadow-xl shadow-primary-900/10">
                <div className="aspect-square w-full overflow-hidden rounded-[1.5rem]">
                  <img
                    src="/doctora-800.webp"
                    alt="Dra. Haide Yael"
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Dra. Haide Yael
              </span>
              <h2 className="section-title mt-6">
                Especialista en Dermatología Clínica y Tricología
              </h2>
              <p className="section-subtitle">
                Con experiencia en diagnóstico, tratamiento y prevención de
                enfermedades de la piel, la Dra. Haide aborda el melasma con un
                enfoque médico riguroso — priorizando siempre tu seguridad y
                bienestar por encima de promesas irreales.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-nude-700">
                <li>• Atención médica personalizada, no protocolos genéricos</li>
                <li>• Tratamientos sustentados en evidencia científica</li>
                <li>• Consultorio en Plaza Mandarina Interlomas, Estado de México</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Tratamiento */}
        <section className="bg-nude-100 py-20 md:py-28">
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
                Opciones de tratamiento
              </span>
              <h2 className="section-title mt-6">Un plan dermatológico, no una fórmula única</h2>
              <p className="section-subtitle mx-auto">
                Estas son algunas de las herramientas disponibles en consulta. La
                combinación adecuada depende de tu diagnóstico — no prometemos un
                resultado específico para ningún caso.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TREATMENTS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-nude-200 bg-white p-6 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-primary-950">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Expectativas */}
        <section className="py-20 md:py-28">
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Qué esperar
              </span>
              <h2 className="section-title mt-6">Un proceso realista, paso a paso</h2>
              <p className="section-subtitle mx-auto">
                El melasma es una condición que se maneja, no se "cura" de la
                noche a la mañana — así se ve el proceso en consulta.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {EXPECTATIONS.map(({ icon: Icon, step, title, description }) => (
                <div
                  key={step}
                  className="relative rounded-2xl border border-nude-200 bg-white p-7 shadow-sm"
                >
                  <span className="font-display text-4xl font-bold text-nude-200">{step}</span>
                  <span className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-primary-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-nude-600">{description}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-nude-500">
              Los resultados pueden variar según cada paciente y no garantizamos
              resultados específicos.
            </p>
          </div>
        </section>

        {/* 6. Ubicación */}
        <section className="bg-white py-20 md:py-28">
          <div className="section-container grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                Ubicación
              </span>
              <h2 className="section-title mt-6">Consultorio en Interlomas, Huixquilucan</h2>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin size={22} />
                  </span>
                  <p className="text-sm text-nude-700">
                    Plaza Mandarina Interlomas, Calle Parque de Cádiz 1, Col.
                    Parques de la Herradura, Primer piso, Huixquilucan, Estado de
                    México
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Clock size={22} />
                  </span>
                  <p className="text-sm text-nude-700">
                    Lun - Vie: 10:00 AM - 8:00 PM · Sáb: 8:00 AM - 3:00 PM · Dom: Cerrado
                  </p>
                </div>
              </div>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
              <iframe
                title="Ubicación de la clínica en Interlomas"
                className="h-full w-full border-0"
                loading="lazy"
                src="https://www.google.com/maps?q=Plaza%20Mandarina%20Interlomas%2C%20Estado%20de%20Mexico&output=embed"
              />
            </div>
          </div>
        </section>

        {/* 7. CTA final */}
        <section className="bg-primary-950 py-20 md:py-24">
          <div className="section-container text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Agenda tu valoración por manchas o melasma
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-primary-100 md:text-lg">
              El primer paso es una evaluación con la Dra. Haide para entender tu
              caso y definir el plan adecuado para ti.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              <a
                href="tel:+525584041696"
                onClick={trackClickPhone}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
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
