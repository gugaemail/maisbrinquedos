"use client";

import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
}

const VISIBLE = 4;
const GAP = 16;

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = categories.length;
  const canPrev = index > 0;
  const canNext = index + VISIBLE < total;

  // Measure container width to compute exact card width
  useEffect(() => {
    if (!wrapperRef.current) return;
    const measure = () => {
      const w = wrapperRef.current!.offsetWidth;
      setCardWidth((w - (VISIBLE - 1) * GAP) / VISIBLE);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  function goTo(i: number) {
    if (!trackRef.current || cardWidth === 0) return;
    trackRef.current.scrollTo({ left: i * (cardWidth + GAP), behavior: "smooth" });
    setIndex(i);
  }

  if (total <= VISIBLE) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} label={cat.name} href={`/categoria/${cat.slug}`} emoji={cat.emoji} />
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Prev arrow */}
      <button
        onClick={() => goTo(index - 1)}
        disabled={!canPrev}
        aria-label="Anterior"
        className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/10 border border-black/15 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors ${
          canPrev ? "cursor-pointer" : "opacity-25 cursor-not-allowed"
        }`}
      >
        <ChevronLeft />
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex" style={{ gap: GAP }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{ flex: `0 0 ${cardWidth > 0 ? cardWidth : "calc(25% - 12px)"}px` }}
            >
              <CategoryCard label={cat.name} href={`/categoria/${cat.slug}`} emoji={cat.emoji} />
            </div>
          ))}
        </div>
      </div>

      {/* Next arrow */}
      <button
        onClick={() => goTo(index + 1)}
        disabled={!canNext}
        aria-label="Próximo"
        className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/10 border border-black/15 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors ${
          canNext ? "cursor-pointer" : "opacity-25 cursor-not-allowed"
        }`}
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {Array.from({ length: total - VISIBLE + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir para posição ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "w-5 h-2 bg-[#FF3D5A]" : "w-2 h-2 bg-[#E2E6F0] hover:bg-[#6B7080]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
