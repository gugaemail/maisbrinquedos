"use client";

import Link from "next/link";
import { useRef } from "react";
import { animate } from "animejs";

interface Props {
  label: string;
  href: string;
  emoji: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  brinquedos: { bg: "from-[#FFB800]/15 to-[#FF3D57]/10", text: "#FF3D57" },
  tech:        { bg: "from-[#0057FF]/15 to-[#7B3FA0]/10", text: "#0057FF" },
  presentes:   { bg: "from-[#00C48C]/15 to-[#0057FF]/10", text: "#00C48C" },
  novidades:   { bg: "from-[#7B3FA0]/15 to-[#FF3D57]/10", text: "#7B3FA0" },
};

function getColorKey(href: string) {
  if (href.includes("brinquedo")) return "brinquedos";
  if (href.includes("tech")) return "tech";
  if (href.includes("presente")) return "presentes";
  return "novidades";
}

export default function CategoryCard({ label, href, emoji }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const key = getColorKey(href);
  const colors = COLOR_MAP[key];

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    animate(card, {
      rotateX: -y * 14,
      rotateY: x * 14,
      duration: 120,
      ease: "outQuad",
    });
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    animate(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 500,
      ease: "outElastic(1, .6)",
    });
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: "600px" }}
      className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border border-[#E2E6F0] dark:border-white/10 hover:border-transparent hover:shadow-xl transition-all duration-300`}
    >
      <span className="text-4xl transition-transform duration-300 group-hover:scale-110 inline-block">
        {emoji}
      </span>
      <span
        className="font-display font-semibold text-sm text-[#1A1A2E] dark:text-white/85 transition-colors duration-200 group-hover:text-[--cat]"
        style={{ "--cat": colors.text } as React.CSSProperties}
      >
        {label}
      </span>
    </Link>
  );
}
