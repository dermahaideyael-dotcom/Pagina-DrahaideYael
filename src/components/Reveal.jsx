import { forwardRef, useEffect, useRef, useState } from 'react'

// Variantes de entrada - todas las clases quedan escritas literal aquí para
// que Tailwind (JIT basado en texto, no en evaluación de JS) las detecte y
// las genere, aunque se elijan dinámicamente por `variant` en runtime.
const VARIANTS = {
  up: { hidden: 'translate-y-6 opacity-0', visible: 'translate-y-0 opacity-100' },
  fade: { hidden: 'opacity-0', visible: 'opacity-100' },
  zoom: { hidden: 'scale-95 opacity-0', visible: 'scale-100 opacity-100' },
  left: { hidden: '-translate-x-8 opacity-0', visible: 'translate-x-0 opacity-100' },
  right: { hidden: 'translate-x-8 opacity-0', visible: 'translate-x-0 opacity-100' },
}

const Reveal = forwardRef(function Reveal(
  { children, className = '', delay = 0, variant = 'up', as: Tag = 'div', ...rest },
  forwardedRef
) {
  const innerRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const { hidden, visible: visibleClasses } = VARIANTS[variant] || VARIANTS.up

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const setRefs = (node) => {
    innerRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  return (
    <Tag
      ref={setRefs}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? visibleClasses : hidden
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default Reveal
