export default function BrandStory() {
  const stats = [
    { num: "12 anos",    label: "FAMÍLIA INDEPENDENTE" },
    { num: "+180 marcas", label: "NACIONAIS E IMPORTADAS" },
    { num: "4 lojas",   label: "SP, RJ, BH E POA" },
    { num: "100% seguro", label: "SITE CERTIFICADO" },
  ];

  return (
    <section className="container" style={{ paddingBottom: 80, paddingTop: 16 }}>
      <div
        style={{
          background: "var(--inverse-bg)",
          color: "var(--inverse-fg)",
          borderRadius: 28,
          padding: "clamp(48px, 6vw, 80px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--c-sun)",
            display: "block",
          }}
        >
          MANIFESTO MAIS+ · 2026
        </span>
        <h2
          className="t-h1"
          style={{ margin: "18px 0 0", maxWidth: 880 }}
        >
          A gente não vende brinquedo.{" "}
          A gente vende{" "}
          <em style={{ fontStyle: "italic", color: "var(--c-sun)" }}>tarde de domingo</em>
          , primeira pista de carrinho, descoberta de monstro debaixo da cama.
        </h2>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 32,
            marginTop: 56,
            maxWidth: 900,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                borderTop: "1.5px solid rgba(255,255,255,0.18)",
                paddingTop: 16,
              }}
            >
              <div className="t-h3" style={{ margin: 0 }}>{s.num}</div>
              <div className="t-tag" style={{ color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Decorative sparkles */}
        <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.06, pointerEvents: "none" }}>
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" aria-hidden="true">
            <path d="M12 3l1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8-5.8-1.9 5.8-1.9z"/>
            <path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
