"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  textPosition: string; // left | center | bottom-bar
  overlay: string;      // dark | light
  tag: string | null;
}

const SLIDE_DURATION = 7000;

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const goRel = useCallback((d: number) => {
    setIdx((p) => (p + d + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setTimeout(() => goRel(1), SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [paused, idx, banners.length, goRel]);

  if (banners.length === 0) return null;

  const slide = banners[idx];

  return (
    <section
      className="container"
      style={{ paddingTop: 28, paddingBottom: 64 }}
    >
      <div
        style={{ position: "relative" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) goRel(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {/* Slide */}
        <div key={slide.id} style={{ animation: "hero-fade 520ms var(--ease-out, cubic-bezier(.16,1,.3,1)) both" }}>
          <HeroSlide slide={slide} />
        </div>

        {/* Chrome: arrows + named pills + pause */}
        {banners.length > 1 && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {/* Prev */}
            <ChromeBtn onClick={() => goRel(-1)} aria-label="Anterior">
              <ChevronLeft />
            </ChromeBtn>

            {/* Next */}
            <ChromeBtn onClick={() => goRel(1)} aria-label="Próximo">
              <ChevronRight />
            </ChromeBtn>

            {/* Named pills */}
            <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setIdx(i)}
                  style={{
                    flex: "1 1 auto",
                    minWidth: 100,
                    height: 44,
                    padding: "0 16px",
                    border: "1.5px solid",
                    borderColor: i === idx ? "var(--ink, #0E0E10)" : "rgba(14,14,16,0.12)",
                    background: i === idx ? "var(--ink, #0E0E10)" : "transparent",
                    color: i === idx ? "var(--bg-elev, #fff)" : "var(--ink-2, #2A2A2D)",
                    borderRadius: 999,
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 240ms var(--ease, cubic-bezier(.22,.61,.36,1))",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                    <span style={{ opacity: 0.5 }}>0{i + 1}</span>
                    <span>·</span>
                    <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.tag ?? b.title}
                    </span>
                  </span>
                  {i === idx && !paused && (
                    <span
                      key={`progress-${slide.id}`}
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        height: 3,
                        background: "var(--c-sun, #FFCB2D)",
                        animation: `hero-progress ${SLIDE_DURATION}ms linear`,
                      }}
                    />
                  )}
                  {i === idx && (
                    <span style={{
                      width: 6, height: 6, borderRadius: 999,
                      background: paused ? "var(--ink-4, #8B8B90)" : "var(--c-sun, #FFCB2D)",
                      position: "relative", zIndex: 1, flexShrink: 0,
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Pause/play */}
            <ChromeBtn
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Reproduzir" : "Pausar"}
              style={{ background: paused ? "var(--c-sun, #FFCB2D)" : undefined }}
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </ChromeBtn>
          </div>
        )}
      </div>

      <style>{`
        @keyframes hero-fade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-progress {
          from { width: 0; }
          to   { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes hero-fade    { from {} to {} }
          @keyframes hero-progress { from {} to {} }
        }
        @media (max-width: 720px) {
          .hero-left-grid { grid-template-columns: 1fr !important; }
          .hero-left-media { aspect-ratio: 4/3 !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Slide layout variants ── */

function HeroSlide({ slide }: { slide: Banner }) {
  const isLight = slide.overlay === "light";
  const txtColor = isLight ? "#fff" : "var(--ink, #0E0E10)";
  const subColor = isLight ? "rgba(255,255,255,0.85)" : "var(--ink-2, #2A2A2D)";
  const ctaBg   = isLight ? "#fff" : "var(--ink, #0E0E10)";
  const ctaFg   = isLight ? "var(--ink, #0E0E10)" : "#fff";

  const tagLabel = (slide.tag ?? "DESTAQUE").toUpperCase();

  if (slide.textPosition === "bottom-bar") {
    return (
      <div style={{
        position: "relative", aspectRatio: "21/9", minHeight: 480,
        borderRadius: 28, overflow: "hidden",
      }}>
        <MediaBlock slide={slide} />
        <div style={{
          position: "absolute", inset: 0,
          background: isLight
            ? "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 100%)",
        }} />
        <div style={{
          position: "absolute",
          left: "clamp(24px, 4vw, 56px)", right: "clamp(24px, 4vw, 56px)", bottom: "clamp(24px, 4vw, 48px)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap",
        }}>
          <div style={{ maxWidth: 720 }}>
            <SlideTag isLight={isLight} label={tagLabel} />
            <h2 style={{
              margin: "16px 0 0", fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 72px)", lineHeight: 0.98, letterSpacing: "-0.03em",
              color: txtColor,
            }}>{slide.title}</h2>
            {slide.subtitle && (
              <p style={{ fontSize: 17, marginTop: 12, color: subColor, maxWidth: 560 }}>{slide.subtitle}</p>
            )}
          </div>
          {slide.ctaLink && slide.ctaText && (
            <Link href={slide.ctaLink} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              height: 52, padding: "0 28px", background: ctaBg, color: ctaFg,
              borderRadius: "var(--r-pill, 999px)", fontWeight: 600, fontSize: 15,
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              {slide.ctaText} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (slide.textPosition === "center") {
    return (
      <div style={{
        position: "relative", aspectRatio: "21/9", minHeight: 480, borderRadius: 28, overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
      }}>
        <MediaBlock slide={slide} />
        <div style={{
          position: "absolute", inset: 0,
          background: isLight
            ? "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35))"
            : "linear-gradient(0deg, rgba(255,255,255,0.55), rgba(255,255,255,0.55))",
        }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 880 }}>
          <SlideTag isLight={isLight} label={tagLabel} />
          <h2 style={{
            marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 72px)", lineHeight: 1, letterSpacing: "-0.03em",
            color: txtColor,
          }}>{slide.title}</h2>
          {slide.subtitle && (
            <p style={{ fontSize: 18, marginTop: 16, color: subColor, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              {slide.subtitle}
            </p>
          )}
          {slide.ctaLink && slide.ctaText && (
            <Link href={slide.ctaLink} style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28,
              height: 52, padding: "0 28px", background: ctaBg, color: ctaFg,
              borderRadius: "var(--r-pill, 999px)", fontWeight: 600, fontSize: 15, textDecoration: "none",
            }}>
              {slide.ctaText} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  /* left (default) — split layout */
  return (
    <div
      className="hero-left-grid"
      style={{
        position: "relative", borderRadius: 28, overflow: "hidden",
        background: "var(--bg-sunken, #F3F2EC)", minHeight: 520,
        padding: "clamp(32px, 5vw, 64px)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "center",
      }}
    >
      <div>
        <SlideTag isLight={false} label={tagLabel} solid />
        <h2 style={{
          marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em",
          color: "var(--ink, #0E0E10)", maxWidth: 560,
        }}>{slide.title}</h2>
        {slide.subtitle && (
          <p style={{ fontSize: 17, marginTop: 18, maxWidth: 460, color: "var(--ink-2, #2A2A2D)", lineHeight: 1.5 }}>
            {slide.subtitle}
          </p>
        )}
        {slide.ctaLink && slide.ctaText && (
          <Link href={slide.ctaLink} style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28,
            height: 52, padding: "0 28px", background: "var(--ink, #0E0E10)", color: "#fff",
            borderRadius: "var(--r-pill, 999px)", fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}>
            {slide.ctaText} →
          </Link>
        )}
      </div>
      <div className="hero-left-media" style={{ position: "relative", aspectRatio: "1/1", borderRadius: 20, overflow: "hidden" }}>
        <MediaBlock slide={slide} fill />
      </div>
    </div>
  );
}

/* ── Media: image or video ── */

function MediaBlock({ slide, fill }: { slide: Banner; fill?: boolean }) {
  const style: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

  if (slide.videoUrl) {
    return (
      <video
        src={slide.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        style={style}
      />
    );
  }

  if (slide.imageUrl) {
    return (
      <Image
        src={slide.imageUrl}
        alt={slide.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
        priority
      />
    );
  }

  /* Placeholder decorative blocks when no media */
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      {[
        { x: 0,   y: 60,  w: 120, h: 180 },
        { x: 0,   y: 260, w: 120, h: 100 },
        { x: 136, y: 0,   w: 120, h: 100 },
        { x: 136, y: 116, w: 120, h: 160 },
        { x: 136, y: 292, w: 120, h: 88  },
        { x: 272, y: 40,  w: 120, h: 140 },
        { x: 272, y: 196, w: 120, h: 120 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={20}
          fill="var(--c-cherry, #FF3B2F)" opacity={0.10 + (i % 3) * 0.07} />
      ))}
    </svg>
  );
}

/* ── Tag chip ── */

function SlideTag({ label, isLight, solid }: { label: string; isLight: boolean; solid?: boolean }) {
  return (
    <span style={{
      display: "inline-flex",
      padding: "4px 12px",
      borderRadius: 999,
      fontFamily: "var(--font-mono, monospace)",
      fontSize: 11,
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      background: solid
        ? "var(--ink, #0E0E10)"
        : isLight ? "rgba(255,255,255,0.92)" : "var(--ink, #0E0E10)",
      color: solid
        ? "#fff"
        : isLight ? "var(--ink, #0E0E10)" : "#fff",
      border: "none",
    }}>
      {label}
    </span>
  );
}

/* ── Chrome button ── */

function ChromeBtn({
  children, onClick, "aria-label": ariaLabel, style: extraStyle,
}: {
  children: React.ReactNode;
  onClick: () => void;
  "aria-label"?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 44, height: 44, borderRadius: "50%",
        border: "1.5px solid var(--line, #1A1A1C)",
        background: "var(--bg-elev, #fff)",
        color: "var(--ink, #0E0E10)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "all 200ms var(--ease, cubic-bezier(.22,.61,.36,1))",
        flexShrink: 0,
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

/* ── Inline SVG icons ── */

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  );
}
