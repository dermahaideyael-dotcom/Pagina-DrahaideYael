import { useRef, useState } from 'react'
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react'
import { getAttribution, flattenAttribution } from '@/hooks/useAttribution'
import { trackClickPhone, trackFormStart, trackGenerateLead } from '@/lib/analytics'

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Dirección',
    detail: 'Plaza Mandarina Interlomas, Calle Parque de Cádiz 1, Col. Parques de la Herradura, Primer piso, Estado de México',
    href: null,
  },
  {
    icon: Phone,
    title: 'Teléfono / WhatsApp',
    detail: '55 8404 1696',
    href: 'tel:+525584041696',
  },
  {
    icon: Mail,
    title: 'Correo',
    detail: 'derma.haideyael@gmail.com',
    href: null,
  },
  {
    icon: Clock,
    title: 'Horario',
    detail: 'Lun - Vie: 10:00 AM - 8:00 PM · Sáb: 8:00 AM - 3:00 PM · Dom: Cerrado',
    href: null,
  },
]

const EMPTY_FORM = { name: '', phone: '', email: '', message: '', website: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const hasStartedRef = useRef(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // form_start: una sola vez por sesión de interacción, y no para el honeypot
    if (!hasStartedRef.current && name !== 'website') {
      hasStartedRef.current = true
      trackFormStart()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: si el campo trampa viene lleno, es un bot — ignorar en silencio
    if (form.website) return

    setStatus('submitting')

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
      website: form.website,
      ...flattenAttribution(getAttribution()),
      current_page: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
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
        trackGenerateLead()
        setForm(EMPTY_FORM)
        hasStartedRef.current = false
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className="py-20 md:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            Contacto
          </span>
          <h2 className="section-title mt-6">Agenda tu consulta hoy mismo</h2>
          <p className="section-subtitle mx-auto">
            Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo
            para agendar tu cita.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, title, detail, href }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary-950">{title}</p>
                    {href ? (
                      <a
                        href={href}
                        onClick={trackClickPhone}
                        className="text-sm text-nude-600 transition hover:text-primary-700"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p className="text-sm text-nude-600">{detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
              <iframe
                title="Ubicación de la clínica"
                className="h-full w-full border-0"
                loading="lazy"
                src="https://www.google.com/maps?q=Plaza%20Mandarina%20Interlomas%2C%20Estado%20de%20Mexico&output=embed"
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-nude-200 bg-white p-8 shadow-lg lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="text-sm font-medium text-nude-700">
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="mt-2 w-full rounded-xl border border-nude-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="phone" className="text-sm font-medium text-nude-700">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(55) 0000-0000"
                  className="mt-2 w-full rounded-xl border border-nude-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="text-sm font-medium text-nude-700">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  className="mt-2 w-full rounded-xl border border-nude-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-sm font-medium text-nude-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos más sobre lo que necesitas"
                  className="mt-2 w-full resize-none rounded-xl border border-nude-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
              {status === 'submitting' ? 'Enviando…' : 'Enviar mensaje'}
              <Send size={16} />
            </button>

            {status === 'success' && (
              <p className="mt-4 text-sm font-medium text-primary-600">
                ¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.
              </p>
            )}

            {status === 'error' && (
              <p className="mt-4 text-sm font-medium text-red-600">
                Hubo un problema al enviar tu mensaje. Intenta de nuevo o
                escríbenos directo al 55 8404 1696.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
