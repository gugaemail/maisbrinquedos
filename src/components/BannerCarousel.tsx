"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
}

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function goTo(index: number) {
    setCurrent((index + banners.length) % banners.length);
  }

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setTimeout(() => goTo(current + 1), 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative overflow-hidden bg-[#0D0D1F] text-white min-h-[480px] md:min-h-[560px]">
      {/* Background image / video */}
      {banner.imageUrl && (
        banner.imageUrl.endsWith(".mp4") ? (
          <video
            key={banner.imageUrl}
            src={banner.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-55 transition-opacity duration-700"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-55 transition-opacity duration-700"
          />
        )
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D1F] via-[#0D0D1F]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1F] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col justify-center min-h-[480px] md:min-h-[560px]">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="text-lg text-white/85 font-body leading-relaxed max-w-lg">
              {banner.subtitle}
            </p>
          )}
          {banner.ctaLink && banner.ctaText && (
            <div className="pt-2">
              <Link
                href={banner.ctaLink}
                className="inline-block px-8 py-3.5 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0046CC] transition-colors"
              >
                {banner.ctaText}
              </Link>
            </div>
          )}
        </div>

        {/* Dots navigation */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Banner ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-6" : "bg-white/55 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Arrow navigation */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              aria-label="Anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/25 transition-colors backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo(current + 1)}
              aria-label="Próximo"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/25 transition-colors backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8F9FC] to-transparent pointer-events-none" />
    </section>
  );
}
