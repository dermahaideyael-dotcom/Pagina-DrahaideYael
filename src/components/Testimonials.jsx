import { Quote, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'María G.',
    treatment: 'Consulta Dermatológica',
    quote:
      'Excelente atención desde el primer momento. La Dra. Haide fue muy profesional y me explicó todo con claridad. Su trato cercano me hizo sentir muy cómoda y en confianza.',
  },
  {
    name: 'Carlos R.',
    treatment: 'Tratamiento de Alopecia',
    quote:
      'Después de años buscando una solución para mi caída de cabello, la Dra. Haide me dio un diagnóstico claro y un tratamiento efectivo.',
  },
  {
    name: 'Ana M.',
    treatment: 'Toxina Botulínica y Sculptra',
    quote:
      'Buscaba un resultado natural y eso fue exactamente lo que obtuve. La doctora escuchó mis preocupaciones y me recomendó el tratamiento ideal para mis necesidades.',
  },
  {
    name: 'Laura S.',
    treatment: 'Tratamiento de Acné',
    quote:
      'La Dra. Haide no solo trató mi acné, sino que me enseñó a cuidar mi piel de manera integral. El ambiente del consultorio es muy agradable y profesional.',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-primary-950 py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-200">
            Testimonios
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
            Lo que dicen nuestros pacientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 md:text-lg">
            La confianza de quienes han vivido su transformación con nosotros es
            nuestro mayor orgullo.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl bg-white/5 p-7 backdrop-blur-sm ring-1 ring-white/10"
            >
              <Quote className="text-primary-400" size={28} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-primary-50">
                “{t.quote}”
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-primary-300">{t.treatment}</p>
                </div>
                <div className="ml-auto flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-primary-300">
          Los resultados pueden variar según cada paciente y no garantizamos
          resultados específicos.
        </p>
      </div>
    </section>
  )
}
