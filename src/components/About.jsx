import { ShieldCheck, HeartHandshake, ScrollText, Stethoscope } from 'lucide-react'
import clinica1 from '@/assets/clinica-1.webp'
import clinica2 from '@/assets/clinica-2.webp'
import clinica3 from '@/assets/clinica-3.webp'

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Seguridad del Paciente',
    description: 'Protocolos rigurosos y tratamientos basados en evidencia científica.',
  },
  {
    icon: HeartHandshake,
    title: 'Trato Cercano y Humano',
    description: 'Acompañamiento integral en tu proceso de cuidado de la piel.',
  },
  {
    icon: ScrollText,
    title: 'Atención Ética',
    description: 'Compromiso con la honestidad y transparencia en cada consulta.',
  },
  {
    icon: Stethoscope,
    title: 'Experiencia Médica',
    description: 'Diagnóstico, tratamiento y prevención de enfermedades de la piel.',
  },
]

export default function About() {
  return (
    <section id="dra-haide" className="py-20 md:py-28">
      <div className="section-container grid items-center gap-14 md:grid-cols-2">
        <div className="relative order-2 md:order-1">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={clinica1}
              alt="Consultorio de la Dra. Haide Yael"
              width={800}
              height={600}
              loading="lazy"
              className="col-span-2 h-56 w-full rounded-2xl object-cover shadow-lg"
            />
            <img
              src={clinica2}
              alt="Sala de tratamientos de la clínica"
              width={800}
              height={600}
              loading="lazy"
              className="h-40 w-full rounded-2xl object-cover shadow-lg"
            />
            <img
              src={clinica3}
              alt="Oficina de la Dra. Haide Yael"
              width={800}
              height={600}
              loading="lazy"
              className="h-40 w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            Dra. Haide Yael
          </span>

          <h2 className="section-title mt-6">
            Especialista en Dermatología y Tricología
          </h2>

          <p className="section-subtitle">
            Con experiencia en diagnóstico, tratamiento y prevención de las
            enfermedades de la piel, el cabello y las uñas, así como en
            procedimientos estéticos dermatológicos, la Dra. Haide te acompaña
            con un enfoque médico riguroso y profundamente humano.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-sm font-bold text-primary-950">{title}</p>
                  <p className="text-sm text-nude-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
