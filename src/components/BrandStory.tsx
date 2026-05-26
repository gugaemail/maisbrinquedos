export default function BrandStory() {
  const stats = [
    { num: "+12 mil", label: "PRODUTOS" },
    { num: "98%",     label: "AVALIAÇÃO" },
    { num: "2 dias",  label: "ENTREGA" },
    { num: "+5 anos", label: "NO MERCADO" },
  ];

  return (
    <section
      style={{
        background: "var(--inverse-bg)",
        color: "var(--inverse-fg)",
        padding: "clamp(64px, 10vw, 120px) 0",
      }}
    >
      <div className="container">
        {/* Headline */}
        <div style={{ marginBottom: 64 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              display: "block",
              marginBottom: 20,
            }}
          >
            Nossa história
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5.6vw, 80px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: "var(--inverse-fg)",
              margin: 0,
              maxWidth: 800,
            }}
          >
            Nascemos de uma{" "}
            <em style={{ fontStyle: "italic", color: "var(--c-sun)" }}>tarde de domingo</em>{" "}
            brincando com quem a gente ama.
          </h2>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 24,
                paddingBottom: 24,
                paddingRight: i < 3 ? 32 : 0,
                paddingLeft: i > 0 ? 32 : 0,
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(32px, 3.5vw, 52px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "var(--inverse-fg)",
                  marginBottom: 8,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .brand-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
