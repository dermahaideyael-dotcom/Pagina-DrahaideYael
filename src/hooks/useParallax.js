import { useEffect, useRef } from 'react'

// Desplaza el elemento una fracción (`speed`) de lo que se mueve el scroll,
// dando una sensación sutil de profundidad. Sin dependencias - un solo
// listener de scroll (passive) + rAF para no bloquear el hilo principal.
export function useParallax(speed = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = null
    const update = () => {
      const rect = el.getBoundingClientRect()
      const offset = (rect.top - window.innerHeight / 2) * speed
      el.style.transform = `translate3d(0, ${offset}px, 0)`
      rafId = null
    }
    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [speed])

  return ref
}
