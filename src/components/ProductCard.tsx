"use client";

import Link from "next/link";
import { useState } from "react";
import Stars from "@/components/Stars";
import { showToast } from "@/components/Toast";

interface Props {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl?: string | null;
  tag?: string | null;
  rating?: number;
  reviewCount?: number;
  index?: number;
}

const CATEGORY_BG: Record<string, string> = {
  "Tech":           "var(--c-sky-soft)",
  "Tech & Celular": "var(--c-sky-soft)",
  "Brinquedos":     "var(--c-cream)",
  "Presentes":      "var(--c-mint)",
  "Novidades":      "var(--c-rose)",
  "Pelúcia":        "var(--c-rose)",
  "Educativo":      "var(--c-mint)",
  "Baby":           "var(--c-cream)",
  "Colecionáveis":  "var(--c-sky-soft)",
  "Ao Ar Livre":    "var(--c-mint)",
};

function getBg(category: string) {
  return CATEGORY_BG[category] ?? "var(--c-cream)";
}

function getEmoji(category: string) {
  const map: Record<string, string> = {
    "Tech": "🎮", "Tech & Celular": "📱",
    "Brinquedos": "🧸", "Presentes": "🎁",
    "Novidades": "✨", "Pelúcia": "🐻",
    "Educativo": "🎨", "Baby": "🍼",
    "Colecionáveis": "⭐", "Ao Ar Livre": "🚴",
  };
  return map[category] ?? "🎁";
}

function formatBRL(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

export default function ProductCard({ id, slug, name, price, originalPrice, category, imageUrl, tag, rating, reviewCount }: Props) {
  const [fav, setFav] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = JSON.parse(localStorage.getItem("mb_favs") ?? "[]") as string[];
      return saved.includes(id);
    } catch { return false; }
  });

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    try {
      const saved = JSON.parse(localStorage.getItem("mb_favs") ?? "[]") as string[];
      const updated = next ? [...saved.filter(i => i !== id), id] : saved.filter(i => i !== id);
      localStorage.setItem("mb_favs", JSON.stringify(updated));
    } catch { /* noop */ }
  }
  const bg = getBg(category);
  const emoji = getEmoji(category);
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const tagBadge = tag === "mais-vendido" ? { text: "Top", cls: "chip-cherry" }
    : tag === "Novidade" || tag === "novidade" ? { text: "Novo", cls: "chip-solid" }
    : tag === "edição-limitada" ? { text: "Ed. limitada", cls: "chip-solid" }
    : tag === "oferta" || tag === "promoção" ? { text: "Promo", cls: "chip-sun" }
    : tag ? { text: tag, cls: "chip-solid" }
    : null;

  return (
    <Link href={`/produto/${slug}`} className="product-card" style={{ textDecoration: "none" }}>
      {/* Media */}
      <div className="pc-media">
        <div className="pc-media-inner" style={{ backgroundColor: bg }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(40px, 6vw, 64px)",
            }}>
              {emoji}
            </div>
          )}
        </div>

        {/* Badges top-left */}
        <div className="pc-badges">
          {discount && (
            <span className="chip chip-cherry" style={{ height: 24, fontSize: 10 }}>
              -{discount}%
            </span>
          )}
          {tagBadge && (
            <span className={`chip ${tagBadge.cls}`} style={{ height: 24, fontSize: 10 }}>
              {tagBadge.text}
            </span>
          )}
        </div>

        {/* Favorite top-right */}
        <button
          className={`pc-fav${fav ? " is-fav" : ""}`}
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={toggleFav}
        >
          <HeartIcon filled={fav} />
        </button>

        {/* Quick actions — slide up on hover */}
        <div className="pc-quick">
          <button
            className="btn btn-cherry btn-sm"
            style={{ flex: 1 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); showToast(`${name} adicionado`); }}
            aria-label="Adicionar ao carrinho"
          >
            <PlusIcon /> Adicionar
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink)", borderColor: "transparent" }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Ver produto"
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span className="t-tag" style={{ color: "var(--ink-3)" }}>{category}</span>
          {rating != null && <Stars value={rating} count={reviewCount} showValue={false} size={11} />}
        </div>
        <h3 style={{
          margin: 0,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: 15,
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
        }}>
          {name}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <span className="t-price" style={{ fontSize: 20 }}>{formatBRL(price)}</span>
          {originalPrice && originalPrice > price && (
            <span style={{ fontSize: 13, color: "var(--ink-4)", textDecoration: "line-through" }}>
              {formatBRL(originalPrice)}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: "var(--c-kiwi-deep)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <TruckIcon /> Frete grátis
        </span>
      </div>
    </Link>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
