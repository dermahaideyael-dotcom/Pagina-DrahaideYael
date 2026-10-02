import { CalendarCheck, ClipboardList, MessageCircle, Stethoscope } from 'lucide-react'
import Reveal from '@/components/Reveal'

const STEPS = [
  {
    icon: MessageCircle,
    title: 'Valoración',
    description: 'Platicamos sobre tu historia clínica, tus síntomas y lo que te preocupa.',
  },
  {
    icon: Stethoscope,
    title: 'Diagnóstico',
    description: 'La Dra. Haide examina tu piel o cuero cabelludo para identificar la causa.',
  },
  {
    icon: ClipboardList,
    title: 'Plan personalizado',
    description: 'Te explicamos las opciones indicadas para tu caso y resolvemos tus dudas.',
  },
  {
    icon: CalendarCheck,
    title: 'Seguimiento',
    description: 'Damos seguimiento a tu evolución y ajustamos el plan cuando hace falta.',
  },
]

export default function ConsultationSteps({ bgClassName = 'bg-white' }) {
  return (
    <section className={`${bgClassName} py-14 sm:py-20 md:py-28`}>
      <div className="section-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            Tu primera consulta
          </span>
          <h2 className="section-title mt-6">¿Cómo es tu primera visita?</h2>
          <p className="section-subtitle mx-auto">Así es el proceso, paso a paso.</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <Reveal
              key={title}
              delay={i * 100}
              className="rounded-2xl border border-nude-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={22} />
                </span>
                <span className="font-display text-3xl font-bold text-primary-200">{i + 1}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-primary-950">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-nude-600">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
