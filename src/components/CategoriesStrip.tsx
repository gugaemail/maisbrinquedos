"use client";

import Link from "next/link";

interface CategoryCard {
  name: string;
  slug: string;
  count?: number;
  color: string;
  emoji: string;
  shape: "circle" | "square" | "triangle";
}

const DEFAULT_CATEGORIES: CategoryCard[] = [
  { name: "Brinquedos",    slug: "brinquedos",    color: "var(--c-sun)",    emoji: "🧸", shape: "circle" },
  { name: "Presentes",     slug: "presentes",     color: "var(--c-kiwi)",   emoji: "🎁", shape: "square" },
  { name: "Tech",          slug: "tech",          color: "var(--c-sky)",    emoji: "🎮", shape: "circle" },
  { name: "Pelúcia",       slug: "pelucia",       color: "var(--c-bubble)", emoji: "🐻", shape: "triangle" },
  { name: "Educativo",     slug: "educativo",     color: "var(--c-grape)",  emoji: "🎨", shape: "circle" },
  { name: "Baby",          slug: "baby",          color: "var(--c-rose)",   emoji: "🍼", shape: "square" },
  { name: "Colecionáveis", slug: "colecao",       color: "var(--c-cherry)", emoji: "⭐", shape: "triangle" },
  { name: "Ao Ar Livre",   slug: "ar-livre",      color: "var(--c-cream)",  emoji: "🚴", shape: "circle" },
];

interface Props {
  categories?: { name: string; slug: string; _count?: { products: number } }[];
}

export default function CategoriesStrip({ categories }: Props) {
  const cards = categories && categories.length > 0
    ? categories.map((c, i) => ({
        ...DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length],
        name: c.name,
        slug: c.slug,
        count: c._count?.products,
      }))
    : DEFAULT_CATEGORIES;

  return (
    <section style={{ padding: "var(--gap-9) 0", background: "var(--bg)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <span className="t-eyebrow" style={{ display: "block", marginBottom: 6 }}>Categorias</span>
            <h2 className="t-h2" style={{ margin: 0 }}>Explore por categoria</h2>
          </div>
          <Link
            href="/produtos"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Ver tudo →
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {cards.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              style={{
                position: "relative",
                borderRadius: "var(--r-lg)",
                background: cat.color,
                overflow: "hidden",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                transition: "transform var(--t) var(--ease), box-shadow var(--t) var(--ease)",
                minHeight: 140,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {cat.count !== undefined && (
                <span className="t-tag" style={{ fontSize: 10, opacity: 0.65 }}>{cat.count} ITENS</span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                {cat.name}
              </span>
              <span style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                Explorar →
              </span>

              {/* Decorative emoji */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: 8,
                  fontSize: 52,
                  opacity: 0.35,
                  lineHeight: 1,
                  transform: "rotate(12deg)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {cat.emoji}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>
    </section>
  );
}
