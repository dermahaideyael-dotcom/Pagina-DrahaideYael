export default function VideoIntro() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
            Conócenos
          </span>
          <h2 className="section-title mt-6">Un vistazo a la clínica</h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl shadow-primary-900/10">
          <video
            controls
            preload="none"
            poster="/videos/haide-yael-intro-poster.webp"
            className="aspect-video w-full rounded-[1.5rem] object-cover"
          >
            <source src="/videos/haide-yael-intro.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
