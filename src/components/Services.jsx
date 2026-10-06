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
import Reveal from '@/components/Reveal'

const CATEGORIES = [
  {
    id: 'clinica',
    title: 'Dermatología Clínica',
    // 8 items → 4 columnas da 4+4, sin espacio vacío.
    cols: 4,
    items: [
      { icon: Sparkle, title: 'Acné', description: 'Tratamiento integral del acné juvenil y adulto.', image: '/images/gallery-acne-1.webp' },
      { icon: Droplets, title: 'Rosácea', description: 'Control y manejo de rojeces y sensibilidad.', image: '/images/servicio-rosacea.webp' },
      { icon: Scissors, title: 'Alopecia', description: 'Diagnóstico y tratamiento de caída del cabello.', image: '/images/caida-cabello-senal-1-640.webp' },
      { icon: ShieldAlert, title: 'Psoriasis', description: 'Tratamiento de condiciones autoinmunes de la piel.', image: '/images/servicio-psoriasis.webp' },
      { icon: SunMedium, title: 'Melasma', description: 'Corrección de manchas y pigmentaciones.', image: '/images/melasma-beneficios.webp' },
      { icon: Layers, title: 'Dermatitis', description: 'Manejo de eccemas y dermatitis atópica.', image: '/images/servicio-dermatitis.webp' },
      { icon: HandMetal, title: 'Enfermedades de uñas', description: 'Diagnóstico y tratamiento de onicomicosis.', image: '/images/servicio-enfermedades_unas_onicomicosis.webp' },
      { icon: ScanFace, title: 'Enfermedades del pelo', description: 'Tricología y salud capilar integral.', image: '/images/servicio-enfermedades_pelo_tricologia.webp' },
    ],
  },
  {
    id: 'estetica',
    title: 'Dermatología Estética',
    // 6 items → 3 columnas da 3+3, sin espacio vacío (4 columnas dejaba 4+2).
    cols: 3,
    items: [
      { icon: Syringe, title: 'Toxina Botulínica', description: 'Reducción de líneas de expresión con resultados naturales.', image: '/images/gallery-rejuvenecimiento-4.webp' },
      { icon: Activity, title: 'Bioestimuladores', description: 'Bioestimulación de colágeno para rejuvenecimiento.', image: '/images/gallery-rejuvenecimiento-2.webp' },
      { icon: Droplets, title: 'Mesoterapia Inyectable', description: 'Revitalización y nutrición profunda de la piel.', image: '/images/servicio-mesoterapia_inyectable.webp' },
      { icon: Zap, title: 'Micropunción', description: 'Estimulación de colágeno y mejora de textura.', image: '/images/servicio-micropuncion.webp' },
      { icon: FlaskConical, title: 'Peelings Químicos', description: 'Renovación celular y corrección de manchas.', image: '/images/servicio-peeling_quimico.webp' },
      { icon: Sparkle, title: 'Limpieza Facial Profunda', description: 'Extracción y purificación profesional.', image: '/images/servicio-limpieza_facial_profunda.webp' },
    ],
  },
  {
    id: 'corporales',
    title: 'Tratamientos Corporales',
    // 4 items → 4 columnas da una sola fila completa, sin espacio vacío.
    cols: 4,
    items: [
      { icon: Waves, title: 'Cavitación', description: 'Reducción de grasa localizada con ultrasonido.', image: '/images/servicio-cavitacion.webp' },
      { icon: Radar, title: 'Radiofrecuencia', description: 'Reafirmación y tensado de la piel.', image: '/images/servicio-radiofrecuencia_corporal.webp' },
      { icon: Wind, title: 'Carboxiterapia', description: 'Mejora de circulación y reducción de celulitis.', image: '/images/servicio-carboxiterapia.webp' },
      { icon: Gauge, title: 'Ultrasonido Acústico', description: 'Tratamiento corporal no invasivo.', image: '/images/servicio-ultrasonido_acustico.webp' },
    ],
  },
  {
    id: 'procedimientos',
    title: 'Procedimientos Dermatológicos',
    // 5 items → 3 columnas da 3+2, solo 1 hueco (4 columnas dejaba 4+1, 3 huecos).
    cols: 3,
    items: [
      { icon: Snowflake, title: 'Crioterapia', description: 'Eliminación de lesiones con nitrógeno líquido.', image: '/images/servicio-crioterapia.webp' },
      { icon: Zap, title: 'Electrofulguración', description: 'Remoción de verrugas y lesiones benignas.', image: '/images/servicio-electrofulguracion.webp' },
      { icon: Radiation, title: 'Retiro de Tatuajes', description: 'Eliminación de tatuajes mediante tecnología láser especializada.', image: '/images/servicio-retiro_tatuajes.webp' },
      { icon: Radiation, title: 'Láser de Diodo', description: 'Procedimientos dermatológicos especializados.', image: '/images/servicio-laser_diodo.webp' },
      { icon: CircleDot, title: 'Tratamiento de Cicatrices', description: 'Tratamiento de cicatrices queloides.', image: '/images/servicio-tratamiento_cicatrices_queloides.webp' },
    ],
  },
]

// Tailwind necesita ver las clases completas en el código fuente para
// generarlas — no se puede interpolar el número de columnas directamente.
const GRID_COLS_CLASS = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

export default function Services() {
  return (
    <section id="servicios" className="bg-nude-50 py-14 sm:py-20 md:py-28 scroll-mt-24">
      <div className="section-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            Servicios especializados
          </span>
          <h2 className="section-title mt-6">Conoce nuestros servicios</h2>
          <p className="section-subtitle mx-auto">
            Un enfoque integral que combina dermatología clínica, estética,
            tratamientos corporales y procedimientos especializados.
          </p>
        </Reveal>

        <div className="mt-16 space-y-16">
          {CATEGORIES.map((category) => (
            <div key={category.id}>
              <Reveal as="h3" className="text-xl font-bold text-primary-950 md:text-2xl">
                {category.title}
              </Reveal>
              <div className={`mt-6 grid gap-5 sm:grid-cols-2 ${GRID_COLS_CLASS[category.cols]}`}>
                {category.items.map(({ icon: Icon, title, description, image }, i) => (
                  <Reveal key={title} delay={(i % 4) * 100}>
                  <div
                    className="group h-full overflow-hidden rounded-2xl border border-nude-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {image && (
                      <div className="aspect-[3/2] w-full overflow-hidden bg-nude-100">
                        <img
                          src={image}
                          alt={title}
                          width={480}
                          height={320}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                        <Icon size={22} />
                      </span>
                      <h4 className="mt-4 text-base font-bold text-primary-950">{title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{description}</p>
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
