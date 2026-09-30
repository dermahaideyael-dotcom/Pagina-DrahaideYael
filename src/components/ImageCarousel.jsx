import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const AUTOPLAY_MS = 5000
const RESUME_AFTER_MS = 8000

// object-contain (no object-cover): las fotos nunca se recortan, se
// respeta su relación de aspecto real aunque queden franjas vacías
// en fotos con proporciones distintas al contenedor.
export default function ImageCarousel({ slides, aspectClassName = 'aspect-[3/2]' }) {
  const [index, setIndex] = useState(0)
  const resumeTimeoutRef = useRef(null)
  const autoplayIntervalRef = useRef(null)
  const touchStartXRef = useRef(null)

  const goTo = useCallback((next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length)
  }, [slides.length])

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    autoplayIntervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_MS)
  }, [stopAutoplay, slides.length])

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
    <div
      className="relative mx-auto w-full max-w-[400px] select-none overflow-hidden rounded-2xl bg-nude-100 shadow-sm outline-none"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`relative w-full ${aspectClassName}`}>
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
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
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary-900 shadow-sm transition hover:bg-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={handleNext}
        aria-label="Imagen siguiente"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary-900 shadow-sm transition hover:bg-white"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <span
            key={slide.src}
            role="button"
            tabIndex={-1}
            aria-label={`Ir a la imagen ${i + 1}`}
            onClick={() => handleDotClick(i)}
            className={`h-2 w-2 cursor-pointer rounded-full transition ${
              i === index ? 'w-5 bg-primary-800' : 'bg-primary-800/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
