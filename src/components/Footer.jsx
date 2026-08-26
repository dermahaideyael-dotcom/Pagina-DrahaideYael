import { useLocation } from 'react-router-dom'
import { Instagram, Music2 } from 'lucide-react'
import logo from '@/assets/logo.png'
import { trackClickPhone } from '@/lib/analytics'

const LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Dra. Haide', href: '#dra-haide' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Farmacia', href: '#farmacia' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]

const SERVICES = [
  'Dermatología Clínica',
  'Dermatología Estética',
  'Tratamientos Corporales',
  'Procedimientos Dermatológicos',
]

export default function Footer() {
  const { pathname } = useLocation()
  const withHomePrefix = (hash) => (pathname === '/' ? hash : `/${hash}`)

  return (
    <footer className="bg-primary-950 pt-16 text-primary-100">
      <div className="section-container grid gap-10 pb-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Dra. Haide Yael" className="h-10 w-10 rounded-full object-cover" />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-white">Dra. Haide Yael</span>
              <span className="text-sm text-primary-300">| Dermatología</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-200">
            Dermatología Clínica, Estética y Tricología con atención médica
            personalizada, ética y sustentada en la evidencia científica.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary-600"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary-600"
            >
              <Music2 size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Navegación
          </h4>
          <ul className="mt-4 space-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={withHomePrefix(link.href)} className="text-sm text-primary-200 transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Servicios
          </h4>
          <ul className="mt-4 space-y-3">
            {SERVICES.map((service) => (
              <li key={service} className="text-sm text-primary-200">
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-200">
            <li>Plaza Mandarina Interlomas, Edo. de México</li>
            <li>
              <a href="tel:+525584041696" onClick={trackClickPhone} className="hover:text-white">
                55 8404 1696
              </a>
            </li>
            <li>derma.haideyael@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="section-container flex flex-col items-center justify-between gap-3 text-center text-xs text-primary-300 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Dra. Haide Yael Guerrero - Dermatología</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Aviso de Privacidad</a>
            <a href="#" className="hover:text-white">Ética Médica</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
