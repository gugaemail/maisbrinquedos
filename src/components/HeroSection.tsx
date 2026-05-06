"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, stagger, createTimeline } from "animejs";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const PRODUCT_CARDS = [
  { emoji: "🧸", label: "Brinquedos", bg: "#FFE14D", text: "#0F0F0F" },
  { emoji: "📱", label: "Tech",        bg: "#3B8BFF", text: "#FFFFFF" },
  { emoji: "🎁", label: "Presentes",  bg: "#3DDC84", text: "#0F0F0F" },
  { emoji: "✨", label: "Novidades",  bg: "#FF3D5A", text: "#FFFFFF" },
];

export default function HeroSection() {
  const badgeRef   = useRef<HTMLSpanElement>(null);
  const h1Ref      = useRef<HTMLHeadingElement>(null);
  const pRef       = useRef<HTMLParagraphElement>(null);
  const btnsRef    = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = createTimeline({ defaults: { ease: "outCubic" } });

    tl.add(
      [badgeRef.current, h1Ref.current, pRef.current, btnsRef.current, statsRef.current].filter(Boolean) as HTMLElement[],
      { translateY: [40, 0], opacity: [0, 1], duration: 700, delay: stagger(120) }
    );

    if (gridRef.current) {
      tl.add(
        gridRef.current.querySelectorAll(".card-item"),
        { translateY: [30, 0], opacity: [0, 1], scale: [0.85, 1], duration: 550, delay: stagger(90), ease: "outBack(1.2)" },
        300
      );
    }
  }, []);

  return (
    <section className="bg-[#0F0F0F] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Left: copy */}
        <div className="flex-1 space-y-6">
          <span ref={badgeRef} style={{ opacity: 0 }}>
            <Badge variant="new" className="!bg-white/10 !text-white border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84] mr-1.5 inline-block animate-pulse" />
              Novidades toda semana
            </Badge>
          </span>

          <h1
            ref={h1Ref}
            style={{ opacity: 0 }}
            className="text-4xl md:text-6xl font-display font-black leading-tight"
          >
            Brinquedos,{" "}
            <span className="text-[#3B8BFF]">tech</span>{" "}
            e{" "}
            <span className="text-[#FFE14D]">presentes</span>
            <br />
            para todos
          </h1>

          <p ref={pRef} style={{ opacity: 0 }} className="text-lg text-white/70 max-w-lg font-body leading-relaxed">
            Variedade, novidades e tecnologia em um só lugar. Do brinquedo clássico ao gadget mais moderno.
          </p>

          <div ref={btnsRef} style={{ opacity: 0 }} className="flex flex-wrap gap-3 pt-2">
            <Link href="/produtos">
              <Button variant="primary">Ver todos os produtos</Button>
            </Link>
            <Link href="/categoria/novidades">
              <Button variant="accent">Ver novidades</Button>
            </Link>
          </div>

          <div ref={statsRef} style={{ opacity: 0 }} className="flex gap-8 pt-4 border-t border-white/10">
            {[
              { value: "500+",  label: "Produtos" },
              { value: "4.9★", label: "Avaliação" },
              { value: "2 dias", label: "Entrega" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-display font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/60 font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: category cards */}
        <div className="flex-1 flex justify-center items-center">
          <div ref={gridRef} className="grid grid-cols-2 gap-4 w-72 md:w-80 lg:w-96 xl:w-[420px]">
            {PRODUCT_CARDS.map((card) => (
              <div
                key={card.label}
                style={{ opacity: 0, backgroundColor: card.bg }}
                className="card-item aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-default select-none hover:scale-[1.04] transition-transform duration-300"
              >
                <span className="text-5xl">{card.emoji}</span>
                <span className="text-xs font-display font-bold" style={{ color: card.text }}>{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to off-white */}
      <div className="h-8 bg-gradient-to-b from-[#0F0F0F] to-[#FAFAF7]" />
    </section>
  );
}
