"use client";

import Link from "next/link";

interface CategoryCard {
  name: string;
  slug: string;
  count?: number;
  color: string;
  deep: string;
  emoji: string;
  shape: "circle" | "square" | "triangle";
}

const DEFAULT_CATEGORIES: CategoryCard[] = [
  { name: "Brinquedos",    slug: "brinquedos",    color: "#FFE4D6", deep: "#C74A1A", emoji: "🧸", shape: "circle" },
  { name: "Presentes",     slug: "presentes",     color: "#D6F0DC", deep: "#1F7A3F", emoji: "🎁", shape: "square" },
  { name: "Tech",          slug: "tech",          color: "#D6E4FF", deep: "#1A3FA6", emoji: "🎮", shape: "circle" },
  { name: "Pelúcia",       slug: "pelucia",       color: "#FFD6E8", deep: "#A62B5A", emoji: "🐻", shape: "triangle" },
  { name: "Educativo",     slug: "educativo",     color: "#D8F4E0", deep: "#1F7A3F", emoji: "🎨", shape: "circle" },
  { name: "Baby",          slug: "baby",          color: "#FFE4CC", deep: "#A64A1A", emoji: "🍼", shape: "square" },
  { name: "Colecionáveis", slug: "colecao",       color: "#E8D6FF", deep: "#4E28A6", emoji: "⭐", shape: "triangle" },
  { name: "Ao Ar Livre",   slug: "ar-livre",      color: "#FFF3CC", deep: "#7A5A00", emoji: "🚴", shape: "circle" },
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <h2 className="t-h2" style={{ margin: 0 }}>Por categoria</h2>
          <Link
            href="/produtos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            VER TODAS ↗
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {cards.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              style={{
                position: "relative",
                borderRadius: 18,
                background: cat.color,
                overflow: "hidden",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 160,
                transition: "all 240ms var(--ease)",
                border: `1.5px solid ${cat.color}`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Top row: count + arrow */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {cat.count !== undefined && (
                  <span className="t-tag" style={{ fontSize: 10, color: cat.deep, opacity: 0.65 }}>
                    {String(cat.count).padStart(3, "0")} ITENS
                  </span>
                )}
                <span style={{ fontSize: 14, lineHeight: 1, marginLeft: "auto", color: cat.deep }}>↗</span>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Category name */}
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: cat.deep,
                  lineHeight: 1.05,
                }}
              >
                {cat.name}
              </h3>

              {/* Decorative dots */}
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                style={{ position: "absolute", right: -30, bottom: -30, width: 130, height: 130, opacity: 0.7, pointerEvents: "none" }}
              >
                <circle cx="160" cy="160" r="40" fill="var(--ink)" opacity="0.07"/>
                <circle cx="190" cy="120" r="14" fill="var(--ink)" opacity="0.08"/>
                <rect x="140" y="100" width="20" height="20" rx="3" fill="var(--ink)" opacity="0.05" transform="rotate(20 150 110)"/>
              </svg>
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
