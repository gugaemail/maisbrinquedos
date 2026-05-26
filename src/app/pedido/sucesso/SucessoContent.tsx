"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function SucessoContent() {
  const circleRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      animate(circleRef.current, {
        scale: [0, 1.1, 1],
        opacity: [0, 1],
        duration: 700,
        ease: "outElastic(1, .6)",
      });
    }

    const targets = [h1Ref.current, pRef.current, actionsRef.current].filter(Boolean) as HTMLElement[];
    animate(targets, {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: stagger(100, { start: 400 }),
      ease: "outCubic",
    });
  }, []);

  return (
    <main className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center relative overflow-hidden">
      {/* decorative float-y blob */}
      <div
        ref={floatRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "var(--c-mint)",
          opacity: 0.35,
          animation: "float-y 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* pulse-ring circle */}
      <div
        ref={circleRef}
        style={{
          opacity: 0,
          position: "relative",
          width: 120,
          height: 120,
          marginBottom: 32,
          borderRadius: "50%",
          background: "var(--c-kiwi)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          animation: "pulse-ring 2s ease-out infinite",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 56, height: 56 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="t-eyebrow" style={{ color: "var(--c-kiwi-deep)", marginBottom: 8 }}>
        PEDIDO CONFIRMADO
      </p>

      <h1
        ref={h1Ref}
        style={{ opacity: 0 }}
        className="text-3xl font-display font-extrabold text-[#0F0F0F] dark:text-white mb-3"
      >
        Pronto! A diversão está a caminho.
      </h1>

      <p
        ref={pRef}
        style={{ opacity: 0 }}
        className="text-[#6B7080] font-body mb-8"
      >
        Enviamos a confirmação por e-mail. Você pode acompanhar a entrega pelo número do pedido.
      </p>

      <div
        ref={actionsRef}
        style={{ opacity: 0 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-[#3B8BFF] text-white font-semibold hover:bg-[#2a6fd6] transition-colors"
        >
          Voltar à loja
        </Link>
        <Link
          href="/produtos"
          className="px-6 py-3 rounded-full border border-[#E2E6F0] text-[#6B7080] font-semibold hover:border-[#3B8BFF]/30 transition-colors"
        >
          Comprar mais
        </Link>
      </div>
    </main>
  );
}
