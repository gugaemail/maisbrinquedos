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
    <div style={{ display: "flex", gap: 2 }} aria-label={`${stars} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={i < stars ? "#FFB800" : "var(--line-soft)"}
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
    <div
      style={{
        borderRadius: "var(--r-md)",
        background: "var(--bg-elev)",
        border: "1px solid var(--line-hair)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <StarRow stars={review.stars} />
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--ink-3)",
          margin: 0,
          flex: 1,
        }}
      >
        &ldquo;{review.text}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 4 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {review.customerName}
        </p>
        {review.verified && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: "var(--r-pill)",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              background: "color-mix(in srgb, var(--c-kiwi) 12%, transparent)",
              color: "var(--c-kiwi-deep)",
              border: "1px solid color-mix(in srgb, var(--c-kiwi) 24%, transparent)",
            }}
          >
            ✓ Compra verificada
          </span>
        )}
      </div>
    </div>
  );
}

function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div
      style={{
        borderRadius: "var(--r-md)",
        background: "var(--bg-sunken)",
        border: "1px solid var(--line-hair)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "28px 16px",
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--line-hair)" : undefined,
            }}
          >
            {m.icon && (
              <span style={{ fontSize: 20, marginBottom: 4 }} aria-hidden="true">
                {m.icon}
              </span>
            )}
            <p
              className="t-h3"
              style={{ margin: 0, color: "var(--c-sky)", lineHeight: 1 }}
            >
              {m.value}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--ink-3)",
                margin: 0,
              }}
            >
              {m.label}
            </p>
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
    <section
      style={{
        padding: "clamp(48px, 6vw, 80px) 0",
        background: "var(--bg)",
      }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {/* Section heading */}
        <div style={{ textAlign: "center" }}>
          <h2 className="t-h2" style={{ margin: 0 }}>{title}</h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--ink-3)",
              margin: "8px 0 0",
            }}
          >
            Avaliações reais de clientes que já compraram
          </p>
        </div>

        {/* Reviews grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
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
