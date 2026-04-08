"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

interface Action {
  href: string;
  label: string;
  primary?: boolean;
}

interface Props {
  emoji: string;
  title: string;
  description: string;
  actions: Action[];
}

export default function PedidoResult({ emoji, title, description, actions }: Props) {
  const emojiRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emojiRef.current) {
      animate(emojiRef.current, {
        scale: [0, 1.2, 1],
        opacity: [0, 1],
        duration: 700,
        ease: "outElastic(1, .6)",
      });
    }

    const textTargets = [h1Ref.current, pRef.current, actionsRef.current].filter(Boolean) as HTMLElement[];
    animate(textTargets, {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: stagger(100, { start: 300 }),
      ease: "outCubic",
    });
  }, []);

  return (
    <main className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
      <span ref={emojiRef} style={{ opacity: 0, display: "inline-block" }} className="text-7xl mb-6">
        {emoji}
      </span>
      <h1 ref={h1Ref} style={{ opacity: 0 }} className="text-3xl font-display font-extrabold text-[#1A1A2E] mb-3">
        {title}
      </h1>
      <p ref={pRef} style={{ opacity: 0 }} className="text-[#6B7080] font-body mb-8">
        {description}
      </p>
      <div ref={actionsRef} style={{ opacity: 0 }} className="flex flex-wrap gap-3 justify-center">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={
              action.primary
                ? "px-6 py-3 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0057FF]/90 transition-colors"
                : "px-6 py-3 rounded-full border border-[#E2E6F0] text-[#6B7080] font-semibold hover:border-[#0057FF]/30 transition-colors"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
