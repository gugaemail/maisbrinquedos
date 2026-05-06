export default function NewsletterStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="rounded-2xl bg-[#0F0F0F] px-8 py-10 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-white/40">Novidades</p>
          <h2 className="text-xl md:text-2xl font-display font-black text-white leading-tight">
            Receba as melhores ofertas no WhatsApp
          </h2>
          <p className="text-white/50 text-sm font-body max-w-sm">
            Promoções exclusivas, lançamentos e cupons direto no seu celular.
          </p>
        </div>
        <a
          href="https://wa.me/5511999999999?text=Quero%20receber%20as%20melhores%20ofertas!"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-8 py-3.5 rounded-[100px] bg-[#25D366] text-white font-display font-bold text-sm hover:bg-[#1ebe5a] transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.115 1.524 5.845L.057 24l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.003-1.371l-.359-.213-3.741.981.998-3.648-.234-.374A9.786 9.786 0 0 1 2.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z" />
          </svg>
          Entrar no grupo
        </a>
      </div>
    </section>
  );
}
