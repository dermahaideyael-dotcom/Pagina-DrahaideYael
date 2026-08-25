import { ArrowRight, MessageCircle } from 'lucide-react'
import doctoraPhoto from '@/assets/doctora.jpeg'

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-nude-50 pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-nude-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />

      <div className="section-container relative grid items-center gap-12 md:grid-cols-2">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-nude-200 px-4 py-1.5 text-sm font-medium text-primary-800">
            Dermatología Clínica, Estética y Tricología
          </span>

          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-primary-900 md:text-6xl">
            Dra. Haide Yael
          </h1>

          <p className="mt-4 text-xl font-medium text-accent-600">
            Médico especialista en Dermatología y Tricología
          </p>

          <p className="section-subtitle mt-5 text-nude-700">
            Atención médica personalizada, ética y sustentada en la evidencia
            científica, priorizando siempre tu seguridad, salud y bienestar.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="#contacto" className="btn-primary">
              Agendar tu Cita
              <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/525584041696"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] bg-white p-3 shadow-xl shadow-primary-900/10">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
              <img
                src={doctoraPhoto}
                alt="Dra. Haide Yael, especialista en Dermatología y Tricología"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
