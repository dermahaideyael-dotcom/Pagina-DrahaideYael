import {
  Sparkle,
  Droplets,
  Scissors,
  ShieldAlert,
  SunMedium,
  Layers,
  HandMetal,
  ScanFace,
  Syringe,
  Activity,
  Zap,
  Waves,
  Wind,
  Gauge,
  Snowflake,
  FlaskConical,
  Radar,
  Radiation,
  CircleDot,
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'clinica',
    title: 'Dermatología Clínica',
    items: [
      { icon: Sparkle, title: 'Acné', description: 'Tratamiento integral del acné juvenil y adulto.' },
      { icon: Droplets, title: 'Rosácea', description: 'Control y manejo de rojeces y sensibilidad.' },
      { icon: Scissors, title: 'Alopecia', description: 'Diagnóstico y tratamiento de caída del cabello.' },
      { icon: ShieldAlert, title: 'Psoriasis', description: 'Tratamiento de condiciones autoinmunes de la piel.' },
      { icon: SunMedium, title: 'Melasma', description: 'Corrección de manchas y pigmentaciones.' },
      { icon: Layers, title: 'Dermatitis', description: 'Manejo de eccemas y dermatitis atópica.' },
      { icon: HandMetal, title: 'Enfermedades de uñas', description: 'Diagnóstico y tratamiento de onicomicosis.' },
      { icon: ScanFace, title: 'Enfermedades del pelo', description: 'Tricología y salud capilar integral.' },
    ],
  },
  {
    id: 'estetica',
    title: 'Dermatología Estética',
    items: [
      { icon: Syringe, title: 'Toxina Botulínica', description: 'Reducción de líneas de expresión con resultados naturales.' },
      { icon: Activity, title: 'Bioestimuladores', description: 'Bioestimulación de colágeno para rejuvenecimiento.' },
      { icon: Droplets, title: 'Mesoterapia Inyectable', description: 'Revitalización y nutrición profunda de la piel.' },
      { icon: Zap, title: 'Micropunción', description: 'Estimulación de colágeno y mejora de textura.' },
      { icon: FlaskConical, title: 'Peelings Químicos', description: 'Renovación celular y corrección de manchas.' },
      { icon: Sparkle, title: 'Limpieza Facial Profunda', description: 'Extracción y purificación profesional.' },
    ],
  },
  {
    id: 'corporales',
    title: 'Tratamientos Corporales',
    items: [
      { icon: Waves, title: 'Cavitación', description: 'Reducción de grasa localizada con ultrasonido.' },
      { icon: Radar, title: 'Radiofrecuencia', description: 'Reafirmación y tensado de la piel.' },
      { icon: Wind, title: 'Carboxiterapia', description: 'Mejora de circulación y reducción de celulitis.' },
      { icon: Gauge, title: 'Ultrasonido Acústico', description: 'Tratamiento corporal no invasivo.' },
    ],
  },
  {
    id: 'procedimientos',
    title: 'Procedimientos Dermatológicos',
    items: [
      { icon: Snowflake, title: 'Crioterapia', description: 'Eliminación de lesiones con nitrógeno líquido.' },
      { icon: Zap, title: 'Electrofulguración', description: 'Remoción de verrugas y lesiones benignas.' },
      { icon: Radiation, title: 'Retiro de Tatuajes en Láser de Diodo', description: 'Eliminación de tatuajes mediante tecnología láser especializada.' },
      { icon: CircleDot, title: 'Tx de Cicatrices', description: 'Tratamiento de cicatrices queloides.' },
    ],
  },
]

export default function Services() {
  return (
    <section id="servicios" className="bg-nude-50 py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            Servicios especializados
          </span>
          <h2 className="section-title mt-6">Tratamientos dermatológicos completos</h2>
          <p className="section-subtitle mx-auto">
            Un enfoque integral que combina dermatología clínica, estética,
            tratamientos corporales y procedimientos especializados.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {CATEGORIES.map((category) => (
            <div key={category.id}>
              <h3 className="text-xl font-bold text-primary-950 md:text-2xl">
                {category.title}
              </h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-nude-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                      <Icon size={22} />
                    </span>
                    <h4 className="mt-4 text-base font-bold text-primary-950">{title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
