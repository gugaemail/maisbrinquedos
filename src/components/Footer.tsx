import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function Footer() {
  noStore();
  const categories = await db.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <footer className="site-footer" style={{ position: "relative", overflow: "hidden" }}>
      {/* Giant watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "22vw",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          color: "var(--inverse-fg)",
          opacity: 0.04,
          pointerEvents: "none",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        mais+brinquedos
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: 40,
            paddingTop: 64,
            paddingBottom: 40,
          }}
        >
          {/* Col 1 — Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--c-cherry)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                M
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--inverse-fg)", letterSpacing: "-0.02em" }}>
                mais<span style={{ color: "var(--c-cherry)" }}>+</span>brinquedos
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", maxWidth: 280, margin: 0 }}>
              Curadoria de brinquedos que estimulam a criatividade e geram memórias afetivas para toda a família.
            </p>
            {/* Social */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <a href="https://www.instagram.com/maisbrinquedosepresentes" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={socialBtn}>
                <InstagramIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={socialBtn}>
                <YoutubeIcon />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={socialBtn}>
                <TiktokIcon />
              </a>
            </div>
          </div>

          {/* Col 2 — Comprar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Comprar</span>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`} className="col-link">
                {cat.name}
              </Link>
            ))}
            <Link href="/produtos" className="col-link">Ver tudo</Link>
          </div>

          {/* Col 3 — Atendimento */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Atendimento</span>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="col-link">WhatsApp</a>
            <a href="mailto:contato@maisbrinquedos.com.br" className="col-link">E-mail</a>
            <Link href="/troca" className="col-link">Trocas e devoluções</Link>
            <Link href="/faq" className="col-link">Dúvidas frequentes</Link>
          </div>

          {/* Col 4 — Legal */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Legal</span>
            <Link href="/privacidade" className="col-link">Privacidade</Link>
            <Link href="/termos" className="col-link">Termos de uso</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 20,
            paddingBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
            © 2026 MAIS+ BRINQUEDOS E PRESENTES · MAISBRINQUEDOS.COM.BR
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
            VISA · MASTERCARD · ELO · PIX
          </span>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .site-footer .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .site-footer .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .site-footer .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

const socialBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.65)",
  transition: "background 140ms, color 140ms",
};

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.62a8.17 8.17 0 0 0 4.77 1.52V6.68a4.85 4.85 0 0 1-1-.01z" />
    </svg>
  );
}
