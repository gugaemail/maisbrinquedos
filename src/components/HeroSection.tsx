"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, stagger, createTimeline } from "animejs";

const PRODUCT_CARDS = [
  { emoji: "🧸", label: "Brinquedos", color: "from-[#FFB800]/30 to-[#FF3D57]/20" },
  { emoji: "📱", label: "Tech", color: "from-[#0057FF]/30 to-[#7B3FA0]/20" },
  { emoji: "🎁", label: "Presentes", color: "from-[#00C48C]/30 to-[#0057FF]/20" },
  { emoji: "✨", label: "Novidades", color: "from-[#7B3FA0]/30 to-[#FF3D57]/20" },
];

export default function HeroSection() {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animations
    const tl = createTimeline({ defaults: { ease: "outCubic" } });

    tl.add([badgeRef.current, h1Ref.current, pRef.current, btnsRef.current, statsRef.current].filter(Boolean) as HTMLElement[], {
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 700,
      delay: stagger(120),
    });

    if (emojiGridRef.current) {
      tl.add(
        emojiGridRef.current.querySelectorAll(".card-item"),
        {
          translateY: [30, 0],
          translateX: [10, 0],
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 600,
          delay: stagger(100),
          ease: "outBack(1.2)",
        },
        300
      );
    }

    // Blob aurora loop animations
    if (blob1Ref.current) {
      animate(blob1Ref.current, {
        translateX: [0, 40, -20, 0],
        translateY: [0, -30, 20, 0],
        scale: [1, 1.15, 0.95, 1],
        duration: 8000,
        loop: true,
        ease: "inOutSine",
      });
    }
    if (blob2Ref.current) {
      animate(blob2Ref.current, {
        translateX: [0, -50, 30, 0],
        translateY: [0, 40, -20, 0],
        scale: [1, 0.9, 1.1, 1],
        duration: 10000,
        loop: true,
        ease: "inOutSine",
      });
    }
    if (blob3Ref.current) {
      animate(blob3Ref.current, {
        translateX: [0, 30, -40, 0],
        translateY: [0, -20, 30, 0],
        scale: [1, 1.2, 0.9, 1],
        duration: 12000,
        loop: true,
        ease: "inOutSine",
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0D0D1F] text-white min-h-[600px]">
      {/* Aurora blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={blob1Ref}
          className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#0057FF] opacity-[0.18] blur-[100px]"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-[-100px] right-[-60px] w-[450px] h-[450px] rounded-full bg-[#7B3FA0] opacity-[0.20] blur-[90px]"
        />
        <div
          ref={blob3Ref}
          className="absolute top-[40%] left-[40%] w-[350px] h-[350px] rounded-full bg-[#00C48C] opacity-[0.12] blur-[80px]"
        />
      </div>

      {/* Noise/grain overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Left: copy */}
        <div className="flex-1 space-y-6">
          <span
            ref={badgeRef}
            style={{ opacity: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C] animate-pulse" />
            Novidades toda semana
          </span>

          <h1
            ref={h1Ref}
            style={{ opacity: 0 }}
            className="text-4xl md:text-6xl font-display font-extrabold leading-tight"
          >
            Brinquedos,{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #00C48C 0%, #0057FF 100%)",
              }}
            >
              tech
            </span>{" "}
            e{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #FFB800 0%, #FF3D57 100%)",
              }}
            >
              presentes
            </span>
            <br />
            para todos
          </h1>

          <p
            ref={pRef}
            style={{ opacity: 0 }}
            className="text-lg text-white/80 max-w-lg font-body leading-relaxed"
          >
            Variedade, novidades e tecnologia em um só lugar. Do brinquedo clássico ao gadget mais moderno.
          </p>

          <div ref={btnsRef} style={{ opacity: 0 }} className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/produtos"
              className="group relative px-7 py-3.5 rounded-full bg-[#0057FF] text-white font-semibold overflow-hidden transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="relative z-10">Ver todos os produtos</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#0057FF] to-[#7B3FA0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/categoria/novidades"
              className="px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
            >
              Ver novidades
            </Link>
          </div>

          {/* Stats row */}
          <div ref={statsRef} style={{ opacity: 0 }} className="flex gap-8 pt-4 border-t border-white/10">
            {[
              { value: "500+", label: "Produtos" },
              { value: "4.9★", label: "Avaliação" },
              { value: "2 dias", label: "Entrega" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70 font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: product cards grid */}
        <div className="flex-1 flex justify-center items-center">
          <div ref={emojiGridRef} className="grid grid-cols-2 gap-4 w-72 md:w-80">
            {PRODUCT_CARDS.map((card, i) => (
              <div
                key={i}
                style={{ opacity: 0 }}
                className={`card-item aspect-square rounded-3xl bg-gradient-to-br ${card.color} border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-2 cursor-default select-none hover:scale-[1.05] hover:border-white/25 transition-transform duration-300`}
              >
                <span className="text-5xl">{card.emoji}</span>
                <span className="text-xs font-semibold text-white/85 font-body">{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8F9FC] dark:from-[#0A0A0F] to-transparent pointer-events-none" />
    </section>
  );
}
