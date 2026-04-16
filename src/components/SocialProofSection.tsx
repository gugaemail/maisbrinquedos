"use client";

export interface Review {
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
  customerName: string;
  verified?: boolean;
}

export interface Metric {
  value: string;
  label: string;
  icon?: string;
}

export interface SocialProofSectionProps {
  reviews?: Review[];
  metrics?: Metric[];
  title?: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    stars: 5,
    text: "Chegou super rápido e meu filho amou! A qualidade do brinquedo é excelente, muito melhor do que esperava pelo preço.",
    customerName: "Mariana S.",
    verified: true,
  },
  {
    stars: 5,
    text: "Comprei de presente para minha sobrinha e foi um sucesso absoluto. Embalagem cuidadosa e produto de primeira.",
    customerName: "Rafael M.",
    verified: true,
  },
  {
    stars: 5,
    text: "Atendimento ótimo, entrega no prazo. O brinquedo educativo superou as expectativas — a criança já aprendeu muito brincando.",
    customerName: "Fernanda L.",
    verified: true,
  },
  {
    stars: 4,
    text: "Produto bem diferente do que encontro em outras lojas. Veio certinho, bem embalado. Com certeza vou comprar mais!",
    customerName: "Carlos A.",
    verified: true,
  },
];

const DEFAULT_METRICS: Metric[] = [
  { value: "4.9", label: "Avaliação média", icon: "⭐" },
  { value: "12k+", label: "Pedidos entregues", icon: "📦" },
  { value: "98%", label: "Satisfação", icon: "💚" },
];

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${stars} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={i < stars ? "#FFB800" : "#E2E6F0"}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/8 p-6 flex flex-col gap-3">
      <StarRow stars={review.stars} />
      <p className="text-[#6B7080] dark:text-white/45 text-sm font-body leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-2 mt-auto pt-1">
        <p className="text-sm font-semibold text-[#1A1A2E] dark:text-white/85 font-body">
          {review.customerName}
        </p>
        {review.verified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-body bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/20">
            ✓ Compra verificada
          </span>
        )}
      </div>
    </div>
  );
}

function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="rounded-2xl bg-[#F0F4FF] dark:bg-[#0057FF]/8 border border-[#E2E6F0] dark:border-[#0057FF]/15 overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-[#E2E6F0] dark:divide-white/8">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col items-center justify-center gap-1 py-6 px-4 text-center">
            {m.icon && <span className="text-xl mb-1" aria-hidden="true">{m.icon}</span>}
            <p className="text-2xl md:text-3xl font-display font-extrabold text-[#0057FF] leading-none">
              {m.value}
            </p>
            <p className="text-xs text-[#6B7080] dark:text-white/40 font-body mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialProofSection({
  reviews = DEFAULT_REVIEWS,
  metrics = DEFAULT_METRICS,
  title = "O que nossos clientes dizem",
}: SocialProofSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col gap-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#1A1A2E] dark:text-white">
            {title}
          </h2>
          <p className="text-[#6B7080] dark:text-white/35 text-sm font-body mt-2">
            Avaliações reais de clientes que já compraram
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>

        {/* Metrics strip */}
        <MetricStrip metrics={metrics} />
      </div>
    </section>
  );
}
