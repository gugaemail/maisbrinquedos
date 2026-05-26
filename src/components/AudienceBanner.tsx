import Link from "next/link";

export default function AudienceBanner() {
  return (
    <section style={{ padding: "var(--gap-8) 0", background: "var(--bg)" }}>
      <div
        className="container"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        {/* Card 1 — Para os Pequenos */}
        <div
          style={{
            borderRadius: "var(--r-xl)",
            background: "var(--c-kiwi)",
            padding: "clamp(32px, 5vw, 56px)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 320,
          }}
        >
          <span className="t-eyebrow" style={{ opacity: 0.7 }}>Para os Pequenos</span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 44px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: 0,
              maxWidth: 260,
            }}
          >
            Brinquedos que encantam e ensinam
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(14,14,16,0.65)", margin: 0, maxWidth: 280 }}>
            Seleção especial para crianças de 0 a 10 anos. Segurança e diversão em cada produto.
          </p>
          <Link href="/categoria/brinquedos" className="btn btn-lg" style={{ alignSelf: "flex-start", background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }}>
            Explorar
          </Link>

          {/* Decorative circles */}
          <div aria-hidden="true" style={{ position: "absolute", right: -20, bottom: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", right: 40, bottom: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />
          <span aria-hidden="true" style={{ position: "absolute", right: 28, top: 28, fontSize: 80, opacity: 0.4, transform: "rotate(15deg)", userSelect: "none" }}>🧸</span>
        </div>

        {/* Card 2 — Para os Grandes */}
        <div
          style={{
            borderRadius: "var(--r-xl)",
            background: "var(--c-grape)",
            padding: "clamp(32px, 5vw, 56px)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 320,
          }}
        >
          <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.65)" }}>Para os Grandes</span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 44px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#fff",
              margin: 0,
              maxWidth: 260,
            }}
          >
            Colecionáveis e tech para quem cresceu
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.65)", margin: 0, maxWidth: 280 }}>
            Funko Pops, gadgets e edições limitadas para fãs de todas as idades.
          </p>
          <Link href="/categoria/colecao" className="btn btn-lg" style={{ alignSelf: "flex-start", background: "#fff", color: "var(--c-grape)", borderColor: "#fff" }}>
            Descobrir
          </Link>

          {/* Decorative circles */}
          <div aria-hidden="true" style={{ position: "absolute", right: -20, bottom: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", right: 40, bottom: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <span aria-hidden="true" style={{ position: "absolute", right: 28, top: 28, fontSize: 80, opacity: 0.35, transform: "rotate(-10deg)", userSelect: "none" }}>⭐</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .audience-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
