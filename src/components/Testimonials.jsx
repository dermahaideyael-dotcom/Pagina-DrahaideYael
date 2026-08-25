import { useState } from 'react'
import { Send, Star } from 'lucide-react'
import { trackFormStart, trackSubmitReview } from '@/lib/analytics'

const EMPTY_FORM = { name: '', treatment: '', rating: 5, comment: '', website: '' }

export default function Testimonials() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [hasStarted, setHasStarted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (!hasStarted && name !== 'website') {
      setHasStarted(true)
      trackFormStart()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: si el campo trampa viene lleno, es un bot — ignorar en silencio
    if (form.website) return

    setStatus('submitting')

    const payload = {
      type: 'review',
      name: form.name,
      treatment: form.treatment,
      rating: form.rating,
      comment: form.comment,
      website: form.website,
    }

    try {
      const res = await fetch(import.meta.env.VITE_CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.ok) {
        setStatus('success')
        trackSubmitReview()
        setForm(EMPTY_FORM)
        setHasStarted(false)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="testimonios" className="bg-primary-950 py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-200">
            Testimonios
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-white md:text-4xl">
            Comparte tu experiencia
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 md:text-lg">
            Si ya fuiste paciente de la Dra. Haide, cuéntanos cómo te fue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-14 max-w-2xl rounded-3xl bg-white/5 p-8 backdrop-blur-sm ring-1 ring-white/10"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="t-name" className="text-sm font-medium text-primary-100">
                Tu nombre
              </label>
              <input
                id="t-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-primary-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30"
              />
            </div>

            <div>
              <label htmlFor="t-treatment" className="text-sm font-medium text-primary-100">
                Tratamiento recibido
              </label>
              <input
                id="t-treatment"
                name="treatment"
                type="text"
                value={form.treatment}
                onChange={handleChange}
                placeholder="Ej. Consulta dermatológica"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-primary-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30"
              />
            </div>

            <div className="sm:col-span-2">
              <span className="text-sm font-medium text-primary-100">Calificación</span>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                    aria-label={`Calificar con ${value} estrellas`}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      className={value <= form.rating ? 'text-amber-400' : 'text-primary-300/40'}
                      fill={value <= form.rating ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="t-comment" className="text-sm font-medium text-primary-100">
                Tu comentario
              </label>
              <textarea
                id="t-comment"
                name="comment"
                rows={4}
                required
                value={form.comment}
                onChange={handleChange}
                placeholder="Cuéntanos cómo fue tu experiencia"
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-primary-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30"
              />
            </div>
          </div>

          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === 'submitting' ? 'Enviando…' : 'Enviar comentario'}
            <Send size={16} />
          </button>

          {status === 'success' && (
            <p className="mt-4 text-sm font-medium text-primary-300">
              ¡Gracias por tu comentario!
            </p>
          )}

          {status === 'error' && (
            <p className="mt-4 text-sm font-medium text-red-300">
              Hubo un problema al enviar tu comentario. Intenta de nuevo más
              tarde.
            </p>
          )}
        </form>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-primary-300">
          Los resultados pueden variar según cada paciente y no garantizamos
          resultados específicos.
        </p>
      </div>
    </section>
  )
}
