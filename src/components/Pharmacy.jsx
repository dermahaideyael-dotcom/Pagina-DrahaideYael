import { CheckCircle2, ShoppingBag } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { trackClickWhatsApp } from '@/lib/analytics'

const WHATSAPP_HREF =
  'https://wa.me/525584041696?text=' +
  encodeURIComponent('Hola, quiero consultar productos y disponibilidad de la farmacia dermatológica.') +
  '&utm_source=chatgpt&utm_medium=paid&utm_campaign=farmacia'

const CATEGORIES = [
  { name: 'Protectores solares dermatológicos', image: '/images/farmacia-protectores-solares.webp' },
  { name: 'Tratamientos para acné', image: '/images/farmacia-tratamientos-acne.webp' },
  { name: 'Cremas hidratantes especializadas', image: '/images/farmacia-cremas-hidratantes.webp' },
  { name: 'Productos antiedad y piel sensible', image: '/images/farmacia-productos-antiedad.webp' },
]

const PILLARS = [
  { title: 'Respaldo Dermatológico', description: 'Productos seleccionados y recomendados por nuestros especialistas.' },
  { title: 'Prescripción Responsable', description: 'Cada producto recetado según tu diagnóstico específico.' },
  { title: 'Cuidado Integral', description: 'Acompañamiento en tu rutina de cuidado de la piel.' },
]

export default function Pharmacy() {
  return (
    <section id="farmacia" className="py-14 sm:py-20 md:py-28 scroll-mt-24">
      <div className="section-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
            Farmacia dermatológica
          </span>
          <h2 className="section-title mt-6">Productos recomendados por especialistas</h2>
          <p className="section-subtitle mx-auto">
            Contamos con una línea de dermocosméticos seleccionados por la Dra.
            Haide para complementar tu tratamiento y cuidar tu piel en casa.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:items-center">
          <div className="grid grid-cols-2 gap-5 lg:col-span-3">
            {CATEGORIES.map((category, i) => (
              <Reveal key={category.name} delay={i * 100}>
              <div
                className="flex aspect-square flex-col overflow-hidden rounded-2xl border border-nude-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="flex-1 overflow-hidden bg-nude-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    width={480}
                    height={480}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="p-3 text-center text-sm font-semibold text-primary-950">{category.name}</p>
              </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="lg:col-span-2">
            <div className="rounded-3xl bg-primary-950 p-8 text-white md:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <ShoppingBag size={24} />
              </span>
              <h3 className="mt-6 text-2xl font-bold">Cuidado experto, todos los días</h3>

              <ul className="mt-6 space-y-3">
                {PILLARS.map((pillar) => (
                  <li key={pillar.title} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary-300" />
                    <span className="text-primary-50">
                      <span className="font-semibold">{pillar.title}:</span> {pillar.description}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackClickWhatsApp}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-950 transition hover:bg-primary-50"
              >
                Consultar productos y disponibilidad
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
