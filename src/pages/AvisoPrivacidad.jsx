import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-nude-50 text-primary-900">
      <Header />
      <main className="py-16 md:py-24">
        <div className="section-container max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-primary-950 md:text-4xl">
            Aviso de Privacidad
          </h1>
          <p className="mt-3 text-sm text-nude-500">
            Última actualización: agosto 2026
          </p>

          <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-nude-700 md:text-base">
            <section>
              <h2 className="text-lg font-bold text-primary-950">1. Responsable del tratamiento de datos</h2>
              <p className="mt-2">
                La Dra. Haide Yael Guerrero, con consultorio en Plaza Mandarina
                Interlomas, Calle Parque de Cádiz 1, Col. Parques de la Herradura,
                Primer piso, Estado de México, es responsable del tratamiento de
                los datos personales que nos proporcionas, de conformidad con la
                Ley Federal de Protección de Datos Personales en Posesión de los
                Particulares.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">2. Datos personales que recabamos</h2>
              <p className="mt-2">
                Recabamos datos de identificación y contacto (nombre, teléfono,
                correo electrónico) cuando agendas una cita, llenas el
                formulario de contacto o dejas un comentario sobre tu
                experiencia. En consulta, también podemos recabar datos
                relacionados con tu salud, considerados datos personales
                sensibles conforme a la ley, exclusivamente con fines de
                diagnóstico, tratamiento y seguimiento médico.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">3. Finalidades del tratamiento</h2>
              <p className="mt-2">Tus datos personales se utilizan para:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Agendar y confirmar tu cita o valoración.</li>
                <li>Brindarte atención médica, diagnóstico y seguimiento de tratamiento.</li>
                <li>Responder tus dudas o solicitudes de contacto.</li>
                <li>Enviarte información relacionada con tu tratamiento cuando lo solicites.</li>
              </ul>
              <p className="mt-2">
                No utilizamos tus datos de salud con fines mercadotécnicos ni los
                compartimos con terceros ajenos a la prestación del servicio
                médico, salvo que la ley lo requiera.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">4. Transferencia de datos</h2>
              <p className="mt-2">
                Los datos que envías a través del formulario de contacto y de
                comentarios se procesan mediante un proveedor de automatización
                (Google Apps Script / Google Sheets) únicamente para gestionar
                tu solicitud y notificar al consultorio. No se venden ni se
                comparten con fines publicitarios.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">5. Derechos ARCO</h2>
              <p className="mt-2">
                Tienes derecho a acceder, rectificar y cancelar tus datos
                personales, así como a oponerte al tratamiento de los mismos o
                revocar el consentimiento que hayas otorgado. Para ejercer
                cualquiera de estos derechos, escríbenos a{' '}
                <a href="mailto:derma.haideyael@gmail.com" className="font-medium text-primary-700 underline">
                  derma.haideyael@gmail.com
                </a>{' '}
                indicando tu nombre y la solicitud correspondiente.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">6. Cambios al aviso de privacidad</h2>
              <p className="mt-2">
                Este aviso de privacidad puede sufrir modificaciones. Cualquier
                cambio será publicado en esta misma página.
              </p>
            </section>
          </div>

          <hr className="my-14 border-nude-200" />

          <h1 id="etica-medica" className="scroll-mt-24 font-display text-3xl font-bold text-primary-950 md:text-4xl">
            Ética Médica
          </h1>

          <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-nude-700 md:text-base">
            <section>
              <h2 className="text-lg font-bold text-primary-950">1. Compromiso ético</h2>
              <p className="mt-2">
                La atención brindada por la Dra. Haide Yael se rige por los
                principios del Código de Ética del Médico y la Ley General de
                Salud vigentes en México: beneficencia, no maleficencia,
                autonomía del paciente y justicia.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">2. Confidencialidad</h2>
              <p className="mt-2">
                Toda la información compartida durante la consulta se maneja
                bajo estricto secreto profesional. Solo se divulga con tu
                consentimiento expreso o cuando la ley lo exija.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">3. Consentimiento informado</h2>
              <p className="mt-2">
                Antes de cualquier procedimiento diagnóstico o terapéutico, se
                te explicarán en un lenguaje claro los beneficios, riesgos y
                alternativas disponibles, para que tomes una decisión informada
                y voluntaria.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">4. Publicidad de resultados</h2>
              <p className="mt-2">
                Las imágenes, testimonios y descripciones de tratamientos
                publicados en este sitio tienen fines informativos. Los
                resultados pueden variar según cada paciente y no se garantizan
                resultados específicos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-primary-950">5. Trato digno</h2>
              <p className="mt-2">
                Nos comprometemos a brindar una atención respetuosa, sin
                discriminación de ningún tipo, priorizando siempre tu seguridad,
                salud y bienestar.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
