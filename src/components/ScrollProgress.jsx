import { useEffect, useState } from 'react'

// Barra fija arriba de todo (por encima del header) que marca cuánto
// llevas recorrido de la página. Puramente decorativa - oculta de
// lectores de pantalla.
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[60] h-0.5 w-full bg-transparent"
    >
      <div
        className="h-full bg-primary-600 motion-reduce:transition-none"
        style={{ width: `${progress}%`, transition: 'width 120ms linear' }}
      />
    </div>
  )
}
