"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/app/api/products/search/route";

export default function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    setIsLoading(false);
  }, []);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Click-outside to close
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeSearch]);

  // Debounced fetch
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

  function navigateTo(id: string) {
    router.push(`/produto/${id}`);
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
    if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      navigateTo(results[activeIndex].id);
    }
  }

  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative">
      {/* Closed: lupa icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Buscar produtos"
          className="p-2 rounded-full text-[#6B7080] hover:text-[#0057FF] hover:bg-[#F0F4FF] transition-colors duration-200"
        >
          <SearchIcon />
        </button>
      )}

      {/* Open: input */}
      {isOpen && (
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[#6B7080] pointer-events-none">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar produtos..."
            className="w-48 sm:w-64 pl-9 pr-8 py-2 rounded-full border border-[#E2E6F0]
                       bg-white text-sm text-[#1A1A2E] placeholder:text-[#6B7080]
                       focus:outline-none focus:border-[#0057FF]/40 focus:ring-2
                       focus:ring-[#0057FF]/10 transition-all duration-200"
            aria-label="Buscar produtos"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={showDropdown}
          />
          <button
            onClick={closeSearch}
            aria-label="Fechar busca"
            className="absolute right-2 text-[#6B7080] hover:text-[#1A1A2E] transition-colors"
          >
            <XIcon />
          </button>
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white rounded-2xl
                     border border-[#E2E6F0] shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                     overflow-hidden z-50"
        >
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-6 text-[#6B7080] text-sm">
              <SpinnerIcon />
              Buscando...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="py-6 text-center text-sm text-[#6B7080]">
              Nenhum resultado para{" "}
              <strong className="text-[#1A1A2E]">&ldquo;{query}&rdquo;</strong>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul>
              {results.map((r, i) => (
                <li
                  key={r.id}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer
                             transition-colors duration-150 border-b border-[#E2E6F0] last:border-0
                             ${i === activeIndex ? "bg-[#F0F4FF]" : "hover:bg-[#F8F9FC]"}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => navigateTo(r.id)}
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex-shrink-0 overflow-hidden">
                    {r.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-xl">🧸</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">{r.name}</p>
                    <p className="text-xs text-[#6B7080]">{r.category}</p>
                  </div>

                  {/* Price */}
                  <span className="text-sm font-bold text-[#1A1A2E] flex-shrink-0">
                    R$ {r.price.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
