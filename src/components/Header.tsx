"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";
import SearchBar from "@/components/SearchBar";
import PromoMarquee from "@/components/PromoMarquee";

interface CategoryProp { name: string; slug: string }

export default function Header({ categories = [] }: { categories?: CategoryProp[] }) {
  const nav = categories.map((c) => ({ label: c.name, href: `/categoria/${c.slug}` }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { totalItems, openDrawer } = useCart();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevTotalRef = useRef(totalItems);

  useLayoutEffect(() => {
    const saved = localStorage.getItem("mb_theme") as "light" | "dark" | null;
    const initial = saved ?? "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mb_theme", next);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalItems > 0 && totalItems !== prevTotalRef.current && badgeRef.current) {
      animate(badgeRef.current, {
        scale: [1.6, 1],
        duration: 400,
        ease: "outElastic(1, .5)",
      });
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <PromoMarquee />
      <header
        className={`site-header${scrolled ? " scrolled" : ""}`}
        style={{ position: "static" }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            gap: 16,
          }}
        >
          {/* Mobile menu button */}
          <button
            className="mobile-nav btn btn-icon btn-ghost"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{ flexShrink: 0 }}
          >
            <MenuIcon open={menuOpen} />
          </button>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <LogoMark />
          </Link>

          {/* Nav desktop */}
          <nav className="desktop-nav" style={{ gap: 28, alignItems: "center" }}>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div style={{ flex: 1 }} className="desktop-nav" />

          {/* Search */}
          <div className="desktop-nav">
            <SearchBar />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            className="btn btn-icon btn-ghost desktop-nav"
            style={{ flexShrink: 0, border: "1.5px solid var(--line-soft)" }}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Account */}
          <button
            aria-label="Minha conta"
            className="btn btn-icon btn-ghost desktop-nav"
            style={{ flexShrink: 0, border: "1.5px solid var(--line-soft)" }}
          >
            <AccountIcon />
          </button>

          {/* Cart */}
          <button
            onClick={openDrawer}
            aria-label="Abrir carrinho"
            className="btn btn-cherry"
            style={{ flexShrink: 0, height: 44, padding: "0 16px", gap: 6 }}
          >
            <CartIcon />
            <span className="desktop-only">Sacola</span>
            {totalItems > 0 && (
              <span
                ref={badgeRef}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 20,
                  height: 20,
                  borderRadius: 999,
                  background: "#fff",
                  color: "var(--c-cherry)",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "0 4px",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile drawer — lateral esquerdo */}
        {/* Scrim */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(14,14,16,0.42)",
            backdropFilter: "blur(2px)",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            transition: "opacity 280ms",
          }}
        />
        {/* Drawer */}
        <nav
          aria-label="Menu de navegação"
          style={{
            position: "fixed",
            top: 0, left: 0, bottom: 0,
            width: "min(320px, 85vw)",
            background: "var(--bg)",
            zIndex: 301,
            display: "flex",
            flexDirection: "column",
            transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 320ms cubic-bezier(.22,.61,.36,1)",
            boxShadow: "8px 0 40px rgba(14,14,16,0.12)",
          }}
        >
          {/* Drawer header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px", borderBottom: "1px solid var(--line-hair)" }}>
            <LogoMark />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-sunken)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)" }}
            >
              <CloseIcon />
            </button>
          </div>
          {/* Nav links */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "14px 20px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "var(--ink)",
                  borderBottom: "1px solid var(--line-hair)",
                  letterSpacing: "-0.02em",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div style={{ padding: 20, borderTop: "1px solid var(--line-hair)" }}>
            <Link
              href="/produtos"
              className="btn btn-cherry"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setMenuOpen(false)}
            >
              Ver loja
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}

function LogoMark() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="var(--c-cherry)"/>
        <path d="M11 27 V 14 L 16 22 L 20 14 L 24 22 L 29 14 V 27" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="9" r="3" fill="var(--c-sun)" stroke="#fff" strokeWidth="1.5"/>
      </svg>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "-0.03em", fontVariationSettings: "'opsz' 32" }}>
        mais<span style={{ color: "var(--c-cherry)" }}>+</span>brinquedos
      </span>
    </span>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
