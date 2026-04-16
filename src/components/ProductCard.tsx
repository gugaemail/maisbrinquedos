"use client";

import Link from "next/link";
import { useRef } from "react";
import { animate } from "animejs";

interface Props {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  tag?: string | null;
  index?: number;
}

const CATEGORY_STYLES: Record<string, { gradient: string; emoji: string }> = {
  "Tech & Celular": { gradient: "from-[#0057FF]/20 via-[#7B3FA0]/15 to-[#0057FF]/5", emoji: "📱" },
  "Brinquedos":     { gradient: "from-[#FFB800]/20 via-[#FF3D57]/15 to-[#FFB800]/5", emoji: "🧸" },
  "Presentes":      { gradient: "from-[#00C48C]/20 via-[#0057FF]/15 to-[#00C48C]/5", emoji: "🎁" },
  "Novidades":      { gradient: "from-[#7B3FA0]/20 via-[#FF3D57]/15 to-[#7B3FA0]/5", emoji: "✨" },
};

const TAG_COLORS: Record<string, string> = {
  "Mais vendido": "bg-[#0057FF] text-white",
  "Novidade":     "bg-[#00C48C] text-white",
  "Oferta":       "bg-[#FF3D57] text-white",
};

export default function ProductCard({ id, name, price, category, imageUrl, tag }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES["Novidades"];

  function handleMouseEnter() {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      translateY: -4,
      duration: 250,
      ease: "outCubic",
    });
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      translateY: 0,
      duration: 350,
      ease: "outElastic(1, .5)",
    });
  }

  return (
    <Link
      ref={cardRef}
      href={`/produto/${id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/8 overflow-hidden hover:border-[#0057FF]/20 dark:hover:border-[#0057FF]/30 hover:shadow-[0_8px_32px_rgba(0,87,255,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,87,255,0.2)] transition-[border-color,box-shadow] duration-300"
    >
      {/* Image area */}
      <div className={`aspect-square bg-gradient-to-br ${style.gradient} flex items-center justify-center relative overflow-hidden`}>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover relative z-10"
          />
        ) : (
          <span className="text-6xl transition-transform duration-300 group-hover:scale-110 relative z-10">
            {style.emoji}
          </span>
        )}
        {tag && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold z-20 ${TAG_COLORS[tag] ?? "bg-[#0057FF] text-white"}`}>
            {tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs text-[#6B7080] dark:text-white/60 font-body">{category}</span>
        <h3 className="text-sm font-display font-semibold text-[#1A1A2E] dark:text-white/85 leading-tight group-hover:text-[#0057FF] transition-colors duration-200">
          {name}
        </h3>
        <p className="text-base font-bold text-[#1A1A2E] dark:text-white mt-1">
          R$ {price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </Link>
  );
}
