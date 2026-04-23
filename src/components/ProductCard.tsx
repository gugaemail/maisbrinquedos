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

const CATEGORY_BG: Record<string, string> = {
  "Tech & Celular": "#3B8BFF",
  "Brinquedos":     "#FFE14D",
  "Presentes":      "#3DDC84",
  "Novidades":      "#FF3D5A",
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Tech & Celular": "📱",
  "Brinquedos":     "🧸",
  "Presentes":      "🎁",
  "Novidades":      "✨",
};

const TAG_STYLES: Record<string, string> = {
  "Mais vendido": "bg-[#3B8BFF] text-white",
  "Novidade":     "bg-[#3DDC84] text-[#0F0F0F]",
  "Oferta":       "bg-[#FF3D5A] text-white",
};

export default function ProductCard({ id, name, price, category, imageUrl, tag }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const bg    = CATEGORY_BG[category]    ?? "#FFE14D";
  const emoji = CATEGORY_EMOJI[category] ?? "✨";

  function handleMouseEnter() {
    if (!cardRef.current) return;
    animate(cardRef.current, { translateY: -4, duration: 250, ease: "outCubic" });
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    animate(cardRef.current, { translateY: 0, duration: 350, ease: "outElastic(1, .5)" });
  }

  return (
    <Link
      ref={cardRef}
      href={`/produto/${id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col rounded-2xl bg-white border border-black/8 overflow-hidden hover:border-[#FF3D5A]/30 hover:shadow-[0_8px_32px_rgba(255,61,90,0.10)] transition-[border-color,box-shadow] duration-300"
    >
      {/* Image area */}
      <div
        className="aspect-square flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
        )}
        {tag && (
          <span className={`absolute top-2 left-2 px-3 py-0.5 rounded-[100px] text-xs font-body font-bold z-20 ${TAG_STYLES[tag] ?? "bg-[#FF3D5A] text-white"}`}>
            {tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs text-[#6B7080] font-body">{category}</span>
        <h3 className="text-sm font-display font-bold text-[#0F0F0F] leading-tight group-hover:text-[#FF3D5A] transition-colors duration-200">
          {name}
        </h3>
        <p className="text-base font-display font-black text-[#FF3D5A] mt-1">
          R$ {price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </Link>
  );
}
