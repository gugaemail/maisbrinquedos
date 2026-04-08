"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function HeroSection() {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [
      badgeRef.current,
      h1Ref.current,
      pRef.current,
      btnsRef.current,
    ].filter(Boolean) as HTMLElement[];

    animate(targets, {
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: stagger(110),
      ease: "outCubic",
    });

    if (emojiGridRef.current) {
      animate(emojiGridRef.current.querySelectorAll("div"), {
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 500,
        delay: stagger(90, { start: 350 }),
        ease: "outBack",
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#1A1A2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span
            ref={badgeRef}
            style={{ opacity: 0 }}
            className="inline-block px-3 py-1 rounded-full bg-[#0057FF]/20 text-[#0057FF] text-xs font-semibold uppercase tracking-wider"
          >
            Novidades toda semana
          </span>
          <h1
            ref={h1Ref}
            style={{ opacity: 0 }}
            className="text-4xl md:text-6xl font-display font-extrabold leading-tight"
          >
            Brinquedos,{" "}
            <span className="text-[#00C48C]">tech</span> e{" "}
            <span className="text-[#FFB800]">presentes</span>{" "}
            para todos
          </h1>
          <p
            ref={pRef}
            style={{ opacity: 0 }}
            className="text-lg text-white/70 max-w-lg font-body"
          >
            Variedade, novidades e tecnologia em um só lugar. Do brinquedo clássico ao gadget mais moderno.
          </p>
          <div ref={btnsRef} style={{ opacity: 0 }} className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/produtos"
              className="px-6 py-3 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0057FF]/90 transition-colors"
            >
              Ver todos os produtos
            </Link>
            <Link
              href="/categoria/novidades"
              className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Ver novidades
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0057FF]/30 to-[#00C48C]/20 blur-3xl" />
            <div ref={emojiGridRef} className="relative grid grid-cols-2 gap-4 p-4">
              {["🧸", "📱", "🎁", "✨"].map((emoji, i) => (
                <div
                  key={i}
                  style={{ opacity: 0 }}
                  className="aspect-square rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-5xl"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
