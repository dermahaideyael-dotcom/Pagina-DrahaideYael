import { CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react'

const CATEGORIES = [
  { name: 'Protectores solares dermatológicos' },
  { name: 'Tratamientos para acné' },
  { name: 'Cremas hidratantes especializadas' },
  { name: 'Productos antiedad y piel sensible' },
]

const BRANDS = ['SVR', 'HD Cosmetics', 'Tizo', 'Eucerin', 'La Roche-Posay', 'ISDIN', 'Parabotíca', 'Lazartigue']

const PILLARS = [
  { title: 'Respaldo Dermatológico', description: 'Productos seleccionados y recomendados por nuestros especialistas.' },
  { title: 'Prescripción Responsable', description: 'Cada producto recetado según tu diagnóstico específico.' },
  { title: 'Cuidado Integral', description: 'Acompañamiento en tu rutina de cuidado de la piel.' },
]

export default function Pharmacy() {
  return (
    <section id="farmacia" className="py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700">
            Farmacia dermatológica
          </span>
          <h2 className="section-title mt-6">Productos recomendados por especialistas</h2>
          <p className="section-subtitle mx-auto">
            Contamos con una línea de dermocosméticos seleccionados por la Dra.
            Haide para complementar tu tratamiento y cuidar tu piel en casa.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:items-center">
          <div className="grid grid-cols-2 gap-5 lg:col-span-3">
            {CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-nude-200 bg-white p-4 text-center shadow-sm transition hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Sparkles size={22} />
                </span>
                <p className="text-sm font-semibold text-primary-950">{category.name}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
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
                href="#contacto"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-950 transition hover:bg-primary-50"
              >
                Consultar productos
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-nude-500">
            Marcas disponibles
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {BRANDS.map((brand) => (
              <span key={brand} className="text-base font-bold text-nude-700">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
