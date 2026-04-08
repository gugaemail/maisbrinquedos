"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";

const nav = [
  { label: "Brinquedos", href: "/categoria/brinquedos" },
  { label: "Tech & Celular", href: "/categoria/tech" },
  { label: "Presentes", href: "/categoria/presentes" },
  { label: "Novidades", href: "/categoria/novidades" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevTotalRef = useRef(totalItems);

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
    <header className="sticky top-0 z-50 bg-[#F8F9FC]/90 backdrop-blur-md border-b border-[#E2E6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-[#1A1A2E]">
          <PlusIcon />
          <span>
            Mais<span className="text-[#0057FF]"> Brinquedos</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#6B7080] hover:text-[#1A1A2E] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/carrinho"
            className="relative p-2 text-[#6B7080] hover:text-[#1A1A2E] transition-colors"
            aria-label="Carrinho"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                ref={badgeRef}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0057FF] text-white text-[10px] font-bold flex items-center justify-center"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-[#0057FF] text-white text-sm font-semibold hover:bg-[#0057FF]/90 transition-colors"
          >
            Ver loja
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#6B7080] hover:text-[#1A1A2E] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[#E2E6F0] bg-[#F8F9FC] px-4 py-4 flex flex-col gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#1A1A2E]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/produtos"
            className="inline-flex justify-center items-center px-4 py-2 rounded-full bg-[#0057FF] text-white text-sm font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Ver loja
          </Link>
        </nav>
      )}
    </header>
  );
}

function PlusIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="11" y="2" width="6" height="24" rx="3" fill="#0057FF" />
      <rect x="2" y="11" width="24" height="6" rx="3" fill="#FF3D57" />
      <rect x="11" y="11" width="6" height="6" rx="1" fill="#FFB800" />
    </svg>
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
