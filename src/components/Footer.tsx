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
    <footer className="site-footer">
      <div className="container" style={{ paddingTop: 72, paddingBottom: 0 }}>
        {/* Main grid — 5 cols: brand + 4 */}
        <div
          className="footer-main"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.4fr) repeat(4, 1fr)",
            gap: 48,
            paddingBottom: 40,
          }}
        >
          {/* Col 1 — Brand */}
          <div className="footer-brand">
            {/* Logo SVG */}
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="18" fill="var(--c-cherry)"/>
                <path d="M11 27 V 14 L 16 22 L 20 14 L 24 22 L 29 14 V 27" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="32" cy="9" r="3" fill="var(--c-sun)" stroke="#fff" strokeWidth="1.5"/>
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--inverse-fg)", letterSpacing: "-0.03em" }}>
                mais<span style={{ color: "var(--c-cherry)" }}>+</span>brinquedos
              </span>
            </Link>
            <p style={{ marginTop: 20, color: "rgba(255,255,255,0.7)", maxWidth: 320, lineHeight: 1.5, fontSize: 14 }}>
              A maior loja independente de brinquedos do Brasil. Curadoria, garantia, entrega segura.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
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
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Comprar</span>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`} className="col-link">{cat.name}</Link>
            ))}
            <Link href="/produtos" className="col-link">Ver tudo</Link>
          </div>

          {/* Col 3 — Atendimento */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Atendimento</span>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="col-link">WhatsApp</a>
            <a href="mailto:contato@maisbrinquedos.com.br" className="col-link">E-mail</a>
            <Link href="/troca" className="col-link">Trocas e devoluções</Link>
            <Link href="/faq" className="col-link">Dúvidas frequentes</Link>
            <Link href="/pedido" className="col-link">Rastrear pedido</Link>
          </div>

          {/* Col 4 — Mais Brinquedos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Mais Brinquedos</span>
            <Link href="/sobre" className="col-link">Sobre nós</Link>
            <Link href="/lojas" className="col-link">Lojas físicas</Link>
            <Link href="/trabalhe" className="col-link">Trabalhe conosco</Link>
          </div>

          {/* Col 5 — Legal */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="t-eyebrow" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Legal</span>
            <Link href="/privacidade" className="col-link">Privacidade</Link>
            <Link href="/termos" className="col-link">Termos de uso</Link>
            <Link href="/cookies" className="col-link">Cookies</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 32,
            paddingBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
            © 2026 MAIS BRINQUEDOS LTDA · CNPJ 12.345.678/0001-90 · TODOS OS DIREITOS RESERVADOS
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
            VISA · MASTERCARD · ELO · PIX
          </span>
        </div>
      </div>

      {/* Giant wordmark watermark — in flow, after content */}
      <div
        aria-hidden="true"
        style={{
          overflow: "hidden",
          marginTop: -20,
          paddingTop: 60,
          lineHeight: 0.85,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "min(22vw, 320px)",
            letterSpacing: "-0.04em",
            textAlign: "center",
            color: "rgba(255,255,255,0.06)",
            fontVariationSettings: "'opsz' 96, 'wdth' 100",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          mais+brinquedos
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .site-footer .footer-main { grid-template-columns: 1fr 1fr 1fr !important; }
          .site-footer .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .site-footer .footer-main { grid-template-columns: 1fr 1fr !important; }
          .site-footer .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .site-footer .footer-main { grid-template-columns: 1fr !important; gap: 32px !important; }
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
