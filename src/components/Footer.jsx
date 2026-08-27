import { useLocation } from 'react-router-dom'
import { Instagram, Music2 } from 'lucide-react'
import logo from '@/assets/logo.webp'
import { trackClickPhone } from '@/lib/analytics'
import { INSTAGRAM_URL, TIKTOK_URL } from '@/lib/social'

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
            <img
              src={logo}
              alt="Dra. Haide Yael"
              width={80}
              height={80}
              loading="lazy"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-white">Dra. Haide Yael</span>
              <span className="text-sm text-primary-300">| Dermatología</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-200">
            Dermatología Clínica, Estética y Tricología con atención médica
            personalizada, ética y sustentada en la evidencia científica.
          </p>
          <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white">
            Síguenos
          </h4>
          <div className="mt-4 flex gap-5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
              title="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:bg-primary-600 hover:opacity-90"
            >
              <Instagram size={24} />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en TikTok"
              title="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:bg-primary-600 hover:opacity-90"
            >
              <Music2 size={24} />
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
