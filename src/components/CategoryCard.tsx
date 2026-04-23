"use client";

import Link from "next/link";
import { useRef } from "react";
import { animate } from "animejs";

interface Props {
  label: string;
  href: string;
  emoji: string;
}

const COLOR_MAP: Record<string, { bg: string; accent: string }> = {
  brinquedos: { bg: "#FFE14D", accent: "#0F0F0F" },
  tech:        { bg: "#3B8BFF", accent: "#FFFFFF" },
  presentes:   { bg: "#3DDC84", accent: "#0F0F0F" },
  novidades:   { bg: "#FF3D5A", accent: "#FFFFFF" },
};

function getColorKey(href: string) {
  if (href.includes("brinquedo")) return "brinquedos";
  if (href.includes("tech"))      return "tech";
  if (href.includes("presente"))  return "presentes";
  return "novidades";
}

export default function CategoryCard({ label, href, emoji }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { bg, accent } = COLOR_MAP[getColorKey(href)];

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    animate(card, { rotateX: -y * 12, rotateY: x * 12, duration: 120, ease: "outQuad" });
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    animate(card, { rotateX: 0, rotateY: 0, duration: 500, ease: "outElastic(1, .6)" });
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: "600px", backgroundColor: bg }}
      className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl hover:scale-[1.04] hover:shadow-lg transition-all duration-300"
    >
      <span className="text-4xl transition-transform duration-300 group-hover:scale-110 inline-block">
        {emoji}
      </span>
      <span className="font-display font-bold text-sm" style={{ color: accent }}>
        {label}
      </span>
    </Link>
  );
}
