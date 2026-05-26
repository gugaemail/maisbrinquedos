import Link from "next/link";

const audiences = [
  {
    tag: "PARA OS PEQUENOS",
    title: "Pais que querem o melhor.",
    desc: "Curadoria por idade, materiais não tóxicos certificados, sem PVC ou ftalatos. Brinquedos que crescem com a criança.",
    bg: "#C5F0DB",
    deep: "#2F9E50",
    href: "/categoria/brinquedos",
  },
  {
    tag: "PARA OS GRANDES",
    title: "Colecionadores levam a sério.",
    desc: "Action figures importados, edições limitadas Bandai e Funko, autenticidade garantida. Embalagem de loja, vinda direto do depósito.",
    bg: "#E3DBFF",
    deep: "#4E33C2",
    href: "/categoria/colecao",
  },
];

export default function AudienceBanner() {
  return (
    <section className="container" style={{ paddingBottom: 80 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: 16 }}>
        {audiences.map((a) => (
          <div
            key={a.tag}
            style={{
              background: a.bg,
              borderRadius: 24,
              padding: 40,
              position: "relative",
              overflow: "hidden",
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="t-tag" style={{ color: a.deep, opacity: 0.7 }}>{a.tag}</span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.0,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  margin: "16px 0",
                  color: a.deep,
                  maxWidth: 380,
                }}
              >
                {a.title}
              </h3>
              <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 400, lineHeight: 1.5 }}>{a.desc}</p>
            </div>
            <Link
              href={a.href}
              className="btn"
              style={{ alignSelf: "flex-start", background: a.deep, border: "none", color: "#fff", marginTop: 24 }}
            >
              Ver seleção →
            </Link>
            {/* Decorative dots */}
            <svg style={{ position: "absolute", right: -30, top: -30, opacity: 0.5, pointerEvents: "none" }} width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="140" cy="60" r="40" fill={a.deep} opacity="0.15"/>
              <circle cx="180" cy="120" r="20" fill={a.deep} opacity="0.22"/>
              <circle cx="100" cy="40" r="10" fill={a.deep} opacity="0.30"/>
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
