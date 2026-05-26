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
        className="container hero-two-col"
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
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 4 }}>
            {[
              { num: "+12 mil", label: "PRODUTOS NO CATÁLOGO" },
              { num: "98%", label: "AVALIAÇÃO POSITIVA" },
              { num: "2 dias", label: "ENTREGA EM SP/RJ" },
            ].map((s) => (
              <div key={s.label}>
                <div className="t-h3" style={{ margin: 0 }}>{s.num}</div>
                <div className="t-tag t-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="hero-right-col" style={{ position: "relative" }}>
          {/* Category swatches grid — 2×2 intencional */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 12,
              aspectRatio: "4 / 5",
              animation: "float-y 6s ease-in-out infinite",
              position: "relative",
            }}
          >
            {[
              { bg: "var(--c-cream)", icon: <ToyIcon />, label: "Brinquedos", accent: "var(--c-sun-deep)" },
              { bg: "var(--c-sky-soft)", icon: <TechIcon />, label: "Tech", accent: "var(--c-sky)" },
              { bg: "var(--c-mint)", icon: <EduIcon />, label: "Educativo", accent: "var(--c-kiwi-deep)" },
              { bg: "var(--c-rose)", icon: <GiftIcon />, label: "Presentes", accent: "var(--c-bubble-deep)" },
            ].map((cat, i) => (
              <div
                key={cat.label}
                style={{
                  background: cat.bg,
                  borderRadius: i === 0 ? "var(--r-xl) var(--r-md) var(--r-md) var(--r-md)"
                    : i === 1 ? "var(--r-md) var(--r-xl) var(--r-md) var(--r-md)"
                    : i === 2 ? "var(--r-md) var(--r-md) var(--r-xl) var(--r-md)"
                    : "var(--r-md) var(--r-md) var(--r-md) var(--r-xl)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  padding: "clamp(16px, 2vw, 24px)",
                  gap: 8,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div style={{ color: cat.accent, opacity: 0.9 }}>{cat.icon}</div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(15px, 1.4vw, 18px)",
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  {cat.label}
                </span>
              </div>
            ))}

            {/* Rotating sticker — posicionado sobre o grid */}
            <div style={{ position: "absolute", top: -16, right: -16, animation: "spin-slow 14s linear infinite", zIndex: 2 }}>
              <svg width="110" height="110" viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <path id="sticker-circle-hero" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"/>
                </defs>
                <circle cx="60" cy="60" r="56" fill="var(--c-cherry)"/>
                <text fill="#fff" fontFamily="var(--font-mono, monospace)" fontSize="9.5" letterSpacing="0.16em">
                  <textPath href="#sticker-circle-hero">FRETE GRÁTIS · CURADORIA · GARANTIA · FRETE GRÁTIS · CURADORIA · </textPath>
                </text>
                <circle cx="60" cy="60" r="20" fill="#fff"/>
                <text x="60" y="65" fill="var(--c-cherry)" fontSize="14" fontFamily="var(--font-display, sans-serif)" fontWeight="800" textAnchor="middle">+199</text>
              </svg>
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

function ToyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a5 5 0 0 1 5 5v1h1a3 3 0 0 1 0 6h-1v1a5 5 0 0 1-10 0v-1H6a3 3 0 0 1 0-6h1V7a5 5 0 0 1 5-5z"/>
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TechIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
      <path d="M7 8l3 3-3 3M13 14h4"/>
    </svg>
  );
}

function EduIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}
