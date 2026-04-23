"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";
import SearchBar from "@/components/SearchBar";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { label: "Brinquedos", href: "/categoria/brinquedos" },
  { label: "Tech & Celular", href: "/categoria/tech" },
  { label: "Presentes", href: "/categoria/presentes" },
  { label: "Novidades", href: "/categoria/novidades" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevTotalRef = useRef(totalItems);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAFAF7]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-black/8 h-14"
          : "bg-[#FAFAF7]/90 backdrop-blur-md border-b border-black/6 h-16"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Logo size="md" theme="light" />
          <span className="font-body text-xs text-[#6B7080] ml-1 hidden sm:inline">brinquedos e presentes</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium font-body text-[#6B7080] hover:text-[#0F0F0F] transition-colors duration-200 group"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#FF3D5A] rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <SearchBar />
          <button
            onClick={openDrawer}
            className="relative p-2 text-[#6B7080] hover:text-[#0F0F0F] transition-colors hover:bg-black/5 rounded-xl"
            aria-label="Abrir carrinho"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                ref={badgeRef}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#FF3D5A] text-white text-[10px] font-bold flex items-center justify-center"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center px-5 py-2 rounded-[100px] bg-[#FF3D5A] text-white text-sm font-display font-bold hover:bg-[#e62e4a] transition-colors duration-200"
          >
            Ver loja
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#6B7080] hover:text-[#0F0F0F] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className={`md:hidden border-t border-black/6 bg-[#FAFAF7] px-4 flex flex-col gap-4 shadow-lg overflow-hidden transition-[max-height,padding,opacity] duration-300 ease-in-out ${
          menuOpen ? "max-h-80 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium font-body text-[#0F0F0F] hover:text-[#FF3D5A] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/produtos"
          className="inline-flex justify-center items-center px-5 py-2 rounded-[100px] bg-[#FF3D5A] text-white text-sm font-display font-bold"
          onClick={() => setMenuOpen(false)}
        >
          Ver loja
        </Link>
      </nav>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
