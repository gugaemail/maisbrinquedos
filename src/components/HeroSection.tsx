"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "clamp(48px, 8vw, 96px) 0",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="chip chip-cherry">Coleção 2026</span>
            <span className="chip">EDIÇÃO DEZEMBRO · #014</span>
          </div>

          {/* Headline */}
          <h1
            className="t-h1"
            style={{ margin: 0, fontWeight: 800, lineHeight: 0.95 }}
          >
            Brinquedos
            <br />
            que
            <br />
            <span style={{ color: "var(--c-cherry)" }}>viram</span>
            <br />
            <span className="swirl">
              memória
              <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M2 14 C40 4, 80 18, 120 10 S170 2, 198 12"
                  fill="none"
                  stroke="var(--c-sun)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-3)",
              maxWidth: 420,
              margin: 0,
            }}
          >
            Curadoria especial de brinquedos que estimulam a criatividade, geram memórias e encantam de verdade.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/produtos" className="btn btn-cherry btn-lg">
              Explorar catálogo
            </Link>
            <Link href="/produtos?ordem=novidades" className="btn btn-ghost btn-lg">
              Ver novidades
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingTop: 12,
              borderTop: "1px solid var(--line-hair)",
            }}
          >
            {[
              { num: "+12 mil", label: "PRODUTOS" },
              { num: "98%", label: "AVALIAÇÃO" },
              { num: "2 dias", label: "ENTREGA" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 2.4vw, 28px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </span>
                <span className="t-eyebrow">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: "4 / 5",
              borderRadius: "var(--r-xl)",
              background: "var(--c-sun)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "float-y 6s ease-in-out infinite",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center", padding: 32 }}>
              <div style={{ fontSize: "clamp(64px, 10vw, 120px)", lineHeight: 1, marginBottom: 16 }}>
                🧸
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(18px, 2.4vw, 26px)",
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                }}
              >
                Destaque da semana
              </span>
            </div>

            {/* Rotating sticker */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                animation: "spin-slow 14s linear infinite",
              }}
            >
              <div className="sticker" style={{ fontSize: 9, lineHeight: 1.4, padding: 10 }}>
                FRETE GRÁTIS · CURADORIA · GARANTIA
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .hero-two-col { grid-template-columns: 1fr !important; }
          .hero-right-col { display: none !important; }
        }
      `}</style>
    </section>
  );
}
