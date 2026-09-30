import { ExternalLink, Star } from 'lucide-react'

const GOOGLE_REVIEWS_URL = 'https://g.page/r/CewkbkKKH-VZEBM/review'
const DOCTORALIA_REVIEWS_URL =
  'https://www.doctoralia.com.mx/perfil/haide-yael-guerrero-quiroz-3?prevent-patient-app-banner=true&utm_source=google&utm_medium=gmb&utm_campaign=455785&utm_content=book_visit#profile-reviews'

const REVIEWS = [
  { name: 'Leodan Hernández', source: 'Google', url: GOOGLE_REVIEWS_URL, quote: 'La verdad muy amables y la atención también.' },
  { name: 'Montserrat Garnica', source: 'Google', url: GOOGLE_REVIEWS_URL, quote: 'Súper buena atención al detalle. Gran servicio. Súper recomendada.' },
  { name: 'Jorge Paredes', source: 'Google', url: GOOGLE_REVIEWS_URL, quote: 'La doctora muy amable, se toma su tiempo para explicarte tu tratamiento; la clínica tiene bonito diseño y espacios privados para realizar las limpiezas y procedimientos.' },
  { name: 'Israel Mendoza', source: 'Google', url: GOOGLE_REVIEWS_URL, quote: 'He llevado seguimiento con la Dra. Haide y los resultados han sido maravillosos, nunca había recibido un tratamiento tan completo y personalizado. Sin duda, continuaré cuidando mi piel y cabellera con la Dra.' },
  { name: 'Carmen Verónica Islas Limón', source: 'Doctoralia', url: DOCTORALIA_REVIEWS_URL, quote: 'Increíble servicio de la doctora, muy profesional y los resultados al instante.' },
  { name: 'Naomi', source: 'Doctoralia', url: DOCTORALIA_REVIEWS_URL, quote: 'Me encantó todo, muy buenos resultados y muy buenas atenciones, no le hace falta nada.' },
  { name: 'Isaías', source: 'Doctoralia', url: DOCTORALIA_REVIEWS_URL, quote: 'Explicación detallada y trato amable de la doctora.' },
  { name: 'Ortega Azul', source: 'Doctoralia', url: DOCTORALIA_REVIEWS_URL, quote: 'Se nota el compromiso que tiene con sus pacientes y el cuidado que pone en cada detalle. Gracias a su seguimiento y recomendaciones he visto una gran mejoría en mi piel y me he sentido mucho más segura durante todo el proceso.' },
  { name: 'Manuel López', source: 'Doctoralia', url: DOCTORALIA_REVIEWS_URL, quote: 'Excelente doctora, su tratamiento sí me ha ayudado, muy recomendable.' },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} className="text-amber-400" fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-primary-950 py-14 sm:py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-200">
            Testimonios
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
            Lo que dicen nuestros pacientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 md:text-lg">
            Reseñas reales de pacientes en Google y Doctoralia.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <a
              key={review.name}
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/10 hover:ring-white/20"
            >
              <Stars />
              <p className="mt-3 text-sm leading-relaxed text-primary-50">
                "{review.quote}"
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-primary-300">
                <span className="font-semibold text-primary-100">{review.name}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1">{review.source}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-950 transition hover:bg-primary-50"
          >
            Ver reseñas en Google
            <ExternalLink size={16} />
          </a>
          <a
            href={DOCTORALIA_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver reseñas en Doctoralia
            <ExternalLink size={16} />
          </a>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-primary-300">
          Los resultados pueden variar según cada paciente y no garantizamos
          resultados específicos.
        </p>
      </div>
    </section>
  )
}
