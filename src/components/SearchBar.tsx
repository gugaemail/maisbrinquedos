"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchResult } from "@/app/api/products/search/route";

const SUGGESTIONS = ["LEGO", "Boneca", "Hot Wheels", "Pelúcia", "Funko", "Educativo"];

export default function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeSearch]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`);
        const data: SearchResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function navigateTo(slug: string) {
    router.push(`/produto/${slug}`);
    closeSearch();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") { closeSearch(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateTo(results[activeIndex].slug);
      } else if (query.trim()) {
        router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
        closeSearch();
      }
    }
  }

  const showResults = query.trim().length >= 2;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Buscar produtos"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          padding: "0 14px",
          background: "var(--bg-sunken)",
          border: "1.5px solid var(--line)",
          borderRadius: "var(--r-pill)",
          color: "var(--ink-3)",
          fontSize: 13,
          fontFamily: "var(--font-body)",
          cursor: "pointer",
          transition: "border-color 140ms",
          minWidth: 180,
        }}
      >
        <SearchIcon />
        <span style={{ flex: 1, textAlign: "left" }}>Buscar brinquedos, marcas…</span>
        <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 10, opacity: 0.5, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 4, padding: "1px 5px" }}>⌘K</kbd>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSearch}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "12vh",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          {/* Modal card */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 640,
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
              overflow: "hidden",
            }}
          >
            {/* Search input row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "20px 24px",
                borderBottom: "1.5px solid var(--line)",
              }}
            >
              <span style={{ color: "var(--ink-3)", flexShrink: 0 }}>
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="O que você procura?"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 18,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink)",
                  fontWeight: 500,
                }}
                role="combobox"
                aria-label="Buscar produtos"
                aria-autocomplete="list"
                aria-expanded={showResults}
                aria-haspopup="listbox"
                aria-controls="search-listbox"
              />
              <button
                onClick={closeSearch}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "var(--ink-3)",
                  background: "var(--bg-sunken)",
                  border: "1.5px solid var(--line)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                ESC
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 24px 28px" }}>
              {!showResults && (
                <>
                  <span className="t-eyebrow" style={{ color: "var(--ink-3)", display: "block", marginBottom: 14 }}>
                    Sugestões populares
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SUGGESTIONS.map((s) => (
                      <Link
                        key={s}
                        href={`/busca?q=${encodeURIComponent(s)}`}
                        onClick={closeSearch}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 14px",
                          borderRadius: 999,
                          border: "1.5px solid var(--line)",
                          background: "var(--bg-sunken)",
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: "var(--ink-2)",
                          fontWeight: 500,
                          transition: "border-color 120ms, background 120ms",
                          textDecoration: "none",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        {s}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {showResults && isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink-3)", fontSize: 14, padding: "8px 0" }}>
                  <SpinnerIcon />
                  Buscando…
                </div>
              )}

              {showResults && !isLoading && results.length === 0 && (
                <p style={{ fontSize: 14, color: "var(--ink-3)", margin: 0 }}>
                  Nenhum resultado para <strong style={{ color: "var(--ink)" }}>&ldquo;{query}&rdquo;</strong>
                </p>
              )}

              {showResults && !isLoading && results.length > 0 && (
                <>
                  <ul id="search-listbox" style={{ listStyle: "none", margin: 0, padding: 0 }} role="listbox">
                    {results.map((r, i) => (
                      <li
                        key={r.id}
                        role="option"
                        aria-selected={i === activeIndex}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 12,
                          cursor: "pointer",
                          background: i === activeIndex ? "var(--bg-sunken)" : "transparent",
                          transition: "background 100ms",
                        }}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => navigateTo(r.slug)}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-sunken)", flexShrink: 0, overflow: "hidden" }}>
                          {r.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.imageUrl} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧸</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</p>
                          <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>{r.category}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", flexShrink: 0 }}>
                          R$ {r.price.toFixed(2).replace(".", ",")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ borderTop: "1.5px solid var(--line)", marginTop: 8, paddingTop: 12 }}>
                    <Link
                      href={`/busca?q=${encodeURIComponent(query.trim())}`}
                      onClick={closeSearch}
                      style={{ fontSize: 13, color: "var(--c-sky)", fontWeight: 600 }}
                    >
                      Ver todos os resultados para &ldquo;{query}&rdquo; →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
    </svg>
  );
}
