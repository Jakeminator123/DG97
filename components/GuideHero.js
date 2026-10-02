export default function GuideHero({ title, children, label = 'DG97 Kontorsguiden' }) {
  return (
    <section className="bg-primary-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-200 mb-5">{label}</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl mb-6">{title}</h1>
        <div className="text-lg text-blue-100 leading-relaxed max-w-3xl">{children}</div>
      </div>
    </section>
  );
}
