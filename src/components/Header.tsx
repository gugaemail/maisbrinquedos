"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";
import SearchBar from "@/components/SearchBar";
import PromoMarquee from "@/components/PromoMarquee";

interface CategoryProp { name: string; slug: string }

export default function Header({ categories = [] }: { categories?: CategoryProp[] }) {
  const nav = categories.map((c) => ({ label: c.name, href: `/categoria/${c.slug}` }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevTotalRef = useRef(totalItems);

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
    <div>
      <PromoMarquee />
      <header
        className={`site-header${scrolled ? " scrolled" : ""}`}
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

          {/* Cart */}
          <button
            onClick={openDrawer}
            aria-label="Abrir carrinho"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 44,
              padding: "0 16px",
              background: "var(--ink)",
              color: "var(--bg-elev)",
              border: "1.5px solid var(--ink)",
              borderRadius: "var(--r-pill)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              transition: "transform var(--t-fast) var(--ease)",
              flexShrink: 0,
            }}
          >
            <CartIcon />
            <span className="desktop-only" style={{ display: "inline-flex" }}>Sacola</span>
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
                  background: "var(--c-cherry)",
                  color: "#fff",
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

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav
            style={{
              borderTop: "1px solid var(--line-hair)",
              background: "var(--bg)",
              padding: "16px var(--pad-x) 20px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "10px 0",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "var(--ink)",
                  borderBottom: "1px solid var(--line-hair)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/produtos"
              className="btn btn-cherry"
              style={{ marginTop: 12, justifyContent: "center" }}
              onClick={() => setMenuOpen(false)}
            >
              Ver loja
            </Link>
          </nav>
        )}
      </header>
    </div>
  );
}

function LogoMark() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--c-cherry)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        M
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>
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
