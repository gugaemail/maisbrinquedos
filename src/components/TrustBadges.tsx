const PILLARS = [
  {
    icon: "🚀",
    title: "Entrega Rápida",
    desc: "Estimativa de 2 dias úteis para todo o Brasil. Rastreamento em tempo real.",
  },
  {
    icon: "🛡️",
    title: "Compra Segura",
    desc: "Pagamento via Mercado Pago com criptografia SSL. Seus dados protegidos.",
  },
  {
    icon: "🎁",
    title: "Curadoria Semanal",
    desc: "Novidades toda semana. Produtos selecionados com qualidade garantida.",
  },
  {
    icon: "💚",
    title: "Satisfação Garantida",
    desc: "98% de aprovação. Suporte via WhatsApp para qualquer dúvida.",
  },
];

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#0F0F0F] dark:text-white">
          Por que escolher a Mais Brinquedos?
        </h2>
        <p className="text-[#6B7080] dark:text-white/60 text-sm font-body mt-2">
          Confiança e qualidade em cada pedido
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/8 p-6 flex flex-col gap-3 text-center"
          >
            <span className="text-3xl" aria-hidden="true">{p.icon}</span>
            <h3 className="text-sm font-display font-bold text-[#0F0F0F] dark:text-white">{p.title}</h3>
            <p className="text-xs text-[#6B7080] dark:text-white/60 font-body leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Trust logos strip */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {[
          { label: "Mercado Pago", icon: "💳" },
          { label: "SSL Seguro", icon: "🔒" },
          { label: "PIX 5% OFF", icon: "⚡" },
          { label: "12x sem juros", icon: "📅" },
          { label: "Satisfação garantida", icon: "✅" },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F2] dark:bg-white/5 border border-[#E2E6F0] dark:border-white/10 text-xs font-semibold text-[#6B7080] dark:text-white/60"
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
