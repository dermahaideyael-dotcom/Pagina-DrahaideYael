import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { trackClickTreatmentCard } from '@/lib/analytics'

const TREATMENTS = [
  {
    id: 'acne',
    href: '/acne',
    title: 'Acné',
    description: 'Diagnóstico dermatológico para acné y cicatrices, sin productos genéricos.',
    image: '/images/gallery-acne-1.webp',
  },
  {
    id: 'caida-cabello',
    href: '/caida-cabello',
    title: 'Caída de Cabello',
    description: 'Diagnóstico tricológico para frenar la caída a tiempo.',
    image: '/images/caida-cabello-senal-1-640.webp',
  },
  {
    id: 'melasma',
    href: '/melasma',
    title: 'Manchas y Melasma',
    description: 'Identifica el tipo y la causa de tus manchas antes de tratarlas.',
    image: '/images/melasma-beneficios.webp',
  },
  {
    id: 'rejuvenecimiento',
    href: '/rejuvenecimiento',
    title: 'Rejuvenecimiento',
    description: 'Firmeza y luminosidad con un enfoque médico y resultados naturales.',
    image: '/images/gallery-rejuvenecimiento-4.webp',
  },
]

export default function TreatmentHighlights() {
  return (
    <section className="bg-white py-14 sm:py-20 md:py-28">
      <div className="section-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            ¿Qué buscas tratar?
          </span>
          <h2 className="section-title mt-6">Elige tu tratamiento</h2>
          <p className="section-subtitle mx-auto">
            Explora cada especialidad y encuentra el diagnóstico indicado para ti.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {TREATMENTS.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
            <a
              href={t.href}
              onClick={() => trackClickTreatmentCard(t.id)}
              className="group block h-full overflow-hidden rounded-3xl border border-nude-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[3/2] w-full overflow-hidden bg-nude-100">
                <img
                  src={t.image}
                  alt={t.title}
                  width={640}
                  height={427}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-950">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{t.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition group-hover:gap-3">
                  Ver más
                  <ArrowRight size={16} />
                </span>
              </div>
            </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
