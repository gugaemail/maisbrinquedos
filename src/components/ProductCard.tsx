"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl?: string | null;
  tag?: string | null;
  index?: number;
}

const CATEGORY_BG: Record<string, string> = {
  "Tech & Celular": "var(--c-sky-soft)",
  "Brinquedos":     "var(--c-cream)",
  "Presentes":      "var(--c-mint)",
  "Novidades":      "var(--c-rose)",
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Tech & Celular": "📱",
  "Brinquedos":     "🧸",
  "Presentes":      "🎁",
  "Novidades":      "✨",
};

export default function ProductCard({ id, slug, name, price, originalPrice, category, imageUrl, tag }: Props) {
  const [fav, setFav] = useState(false);
  const bg    = CATEGORY_BG[category]    ?? "var(--c-cream)";
  const emoji = CATEGORY_EMOJI[category] ?? "✨";
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  function formatBRL(v: number) {
    return "R$ " + v.toFixed(2).replace(".", ",");
  }

  return (
    <div className="product-card">
      {/* Media */}
      <div className="pc-media">
        <div className="pc-media-inner" style={{ backgroundColor: bg }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(40px, 6vw, 64px)" }}>
              {emoji}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="pc-badges">
          {discount && <span className="chip chip-cherry">-{discount}%</span>}
          {tag && <span className="chip chip-sun">{tag}</span>}
        </div>

        {/* Favorite */}
        <button
          className={`pc-fav${fav ? " is-fav" : ""}`}
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={(e) => { e.preventDefault(); setFav((v) => !v); }}
        >
          <HeartIcon filled={fav} />
        </button>

        {/* Quick actions */}
        <div className="pc-quick">
          <Link
            href={`/produto/${slug}`}
            className="btn btn-cherry btn-sm"
            style={{ flex: 1, justifyContent: "center" }}
          >
            + Adicionar
          </Link>
          <Link
            href={`/produto/${slug}`}
            className="btn btn-ghost btn-sm"
            style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)" }}
          >
            Olhar
          </Link>
        </div>
      </div>

      {/* Info */}
      <Link href={`/produto/${slug}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="t-eyebrow">{category}</span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <span className="t-price" style={{ fontSize: 17, color: "var(--ink)" }}>
            {formatBRL(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-4)", textDecoration: "line-through" }}>
              {formatBRL(originalPrice)}
            </span>
          )}
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-kiwi-deep)", letterSpacing: "0.04em" }}>
          Frete grátis
        </span>
      </Link>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
