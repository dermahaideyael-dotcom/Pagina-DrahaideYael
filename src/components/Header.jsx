import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, Phone, Instagram, Music2 } from 'lucide-react'
import logo from '@/assets/logo.webp'
import { trackClickPhone } from '@/lib/analytics'
import { INSTAGRAM_URL, TIKTOK_URL } from '@/lib/social'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Dra. Haide', href: '#dra-haide' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Farmacia', href: '#farmacia' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // Los anclas (#servicios, etc.) solo existen en el home — desde otra ruta
  // (ej. /melasma) hay que anteponer "/" para volver ahí antes de saltar.
  const withHomePrefix = (hash) => (pathname === '/' ? hash : `/${hash}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-nude-50/95 backdrop-blur-md shadow-sm' : 'bg-nude-50/70 backdrop-blur-sm'
      }`}
    >
      <div className="section-container flex h-18 items-center justify-between py-4">
        <a href={withHomePrefix('#inicio')} className="flex items-center gap-3">
          <img
            src={logo}
            alt="Dra. Haide Yael"
            width={80}
            height={80}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
          />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-primary-900 sm:text-2xl">
              Dra. Haide Yael
            </span>
            <span className="hidden text-sm text-nude-600 sm:inline">| Dermatología</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={withHomePrefix(link.href)}
              className="text-sm font-medium text-nude-700 transition hover:text-primary-800"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="hidden items-center gap-1.5 border-r border-nude-300 pr-3 lg:flex">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
              title="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full text-nude-600 transition duration-300 hover:bg-nude-100 hover:text-primary-800"
            >
              <Instagram size={18} />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en TikTok"
              title="TikTok"
              className="flex h-8 w-8 items-center justify-center rounded-full text-nude-600 transition duration-300 hover:bg-nude-100 hover:text-primary-800"
            >
              <Music2 size={18} />
            </a>
          </div>
          <a
            href="tel:+525584041696"
            onClick={trackClickPhone}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-nude-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-nude-100"
          >
            <Phone size={15} />
            55 8404 1696
          </a>
          <a href={withHomePrefix('#contacto')} className="whitespace-nowrap btn-primary !px-5 !py-2.5">
            Agendar Cita
          </a>
        </div>

        <button
          className="flex items-center justify-center rounded-md p-2 text-primary-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-nude-200 bg-nude-50 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={withHomePrefix(link.href)}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-nude-700 hover:text-primary-800"
              >
                {link.label}
              </a>
            ))}
            <a
              href={withHomePrefix('#contacto')}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Agendar cita
            </a>

            <div className="mt-2 flex items-center gap-5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                title="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-nude-100 text-nude-700 transition duration-300 hover:bg-nude-200"
              >
                <Instagram size={18} />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en TikTok"
                title="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-nude-100 text-nude-700 transition duration-300 hover:bg-nude-200"
              >
                <Music2 size={18} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
