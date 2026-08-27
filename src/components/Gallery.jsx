import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  { name: 'cara', alt: 'Cuidado de piel — Dra. Haide Yael' },
  { name: 'brazos', alt: 'Atención personalizada — Dra. Haide Yael' },
  { name: 'crema', alt: 'Producto profesional — Dra. Haide Yael' },
]

const AUTOPLAY_MS = 5000
const RESUME_AFTER_MS = 8000

export default function Gallery() {
  const [index, setIndex] = useState(0)
  const resumeTimeoutRef = useRef(null)
  const autoplayIntervalRef = useRef(null)
  const touchStartXRef = useRef(null)
  const containerRef = useRef(null)

  const goTo = useCallback((next) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length)
  }, [])

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    autoplayIntervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
  }, [stopAutoplay])

  // Pausa el autoplay al interactuar y lo reanuda después de RESUME_AFTER_MS
  const pauseAndScheduleResume = useCallback(() => {
    stopAutoplay()
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(startAutoplay, RESUME_AFTER_MS)
  }, [stopAutoplay, startAutoplay])

  useEffect(() => {
    startAutoplay()
    return () => {
      stopAutoplay()
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }
  }, [startAutoplay, stopAutoplay])

  const handlePrev = () => {
    goTo(index - 1)
    pauseAndScheduleResume()
  }

  const handleNext = () => {
    goTo(index + 1)
    pauseAndScheduleResume()
  }

  const handleDotClick = (i) => {
    goTo(i)
    pauseAndScheduleResume()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    touchStartXRef.current = null

    const SWIPE_THRESHOLD = 40
    if (deltaX > SWIPE_THRESHOLD) {
      handlePrev()
    } else if (deltaX < -SWIPE_THRESHOLD) {
      handleNext()
    }
  }

  return (
    <section className="section-container" style={{ marginTop: 60, marginBottom: 40 }}>
      <div
        ref={containerRef}
        className="image-gallery relative mx-auto w-full max-w-sm select-none overflow-hidden rounded-xl shadow-lg outline-none sm:max-w-md"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Galería de imágenes"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Las imágenes son gráficos tipo post de Instagram (~4:5) — el
            contenedor respeta esa proporción para no recortar el contenido
            en una franja panorámica. */}
        <div className="gallery-container relative aspect-[4/5] w-full">
          {SLIDES.map((slide, i) => (
            <img
              key={slide.name}
              src={`/images/${slide.name}-1024.webp`}
              srcSet={`/images/${slide.name}-640.webp 640w, /images/${slide.name}-1024.webp 1024w`}
              sizes="100vw"
              alt={slide.alt}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={i !== index}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrev}
          aria-label="Imagen anterior"
          className="gallery-prev absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary-900 shadow-sm transition hover:bg-white"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Imagen siguiente"
          className="gallery-next absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary-900 shadow-sm transition hover:bg-white"
        >
          <ChevronRight size={20} />
        </button>

        <div className="gallery-dots absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((slide, i) => (
            <span
              key={slide.name}
              role="button"
              tabIndex={-1}
              aria-label={`Ir a la imagen ${i + 1}`}
              onClick={() => handleDotClick(i)}
              className={`dot h-2 w-2 cursor-pointer rounded-full transition ${
                i === index ? 'active w-5 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
