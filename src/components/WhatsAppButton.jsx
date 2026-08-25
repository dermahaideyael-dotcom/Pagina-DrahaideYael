const PHONE_NUMBER = '525584041696'
const DEFAULT_MESSAGE = 'Hola, me gustaría agendar una cita con la Dra. Haide Yael.'

export default function WhatsAppButton() {
  const href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition hover:scale-110 animate-pulse hover:animate-none"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.706 4.607 1.92 6.472L4 29l7.72-1.885A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm0 21.75a9.7 9.7 0 0 1-4.95-1.354l-.355-.21-4.585 1.12 1.156-4.47-.232-.366A9.7 9.7 0 0 1 6.25 15c0-5.385 4.366-9.75 9.751-9.75S25.75 9.615 25.75 15 21.386 24.75 16.001 24.75zm5.36-7.302c-.294-.147-1.74-.858-2.01-.956-.27-.098-.467-.147-.663.147-.196.294-.76.955-.932 1.152-.171.196-.343.22-.637.073-.294-.147-1.242-.457-2.366-1.457-.874-.78-1.464-1.744-1.636-2.038-.171-.294-.018-.453.129-.6.132-.132.294-.343.44-.514.148-.172.196-.294.294-.49.098-.196.049-.368-.024-.514-.073-.147-.663-1.596-.909-2.186-.24-.575-.483-.497-.663-.507l-.564-.01c-.196 0-.514.073-.784.368-.27.294-1.03 1.007-1.03 2.456s1.055 2.848 1.202 3.044c.147.196 2.075 3.169 5.028 4.442.703.303 1.251.484 1.679.62.706.225 1.348.193 1.856.117.566-.085 1.74-.712 1.986-1.4.245-.688.245-1.278.171-1.4-.073-.123-.269-.196-.563-.343z" />
      </svg>
    </a>
  )
}
