"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { FilterModal, activeFilterCount, ActiveFilters, AgeRange, ProductType, PriceRange } from "./AgeFilter";

function inPriceRange(price: number, range: PriceRange): boolean {
  if (range === "0-50")   return price <= 50;
  if (range === "50-150") return price > 50 && price <= 150;
  if (range === "150-300") return price > 150 && price <= 300;
  if (range === "300+")   return price > 300;
  return true;
}

export interface FilterableProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  category: { name: string; slug: string; emoji: string };
  imageUrl?: string | null;
  tag?: string | null;
  ageRange?: AgeRange;
  productType?: ProductType;
}

interface ProductsWithFilterProps {
  products: FilterableProduct[];
}

type SortOption = "relevancia" | "menor-preco" | "maior-preco" | "novidade" | "maior-desconto";
type ViewMode = "grid" | "list";

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1"/>
      <rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="4" x2="13" y2="4"/>
      <line x1="3" y1="8" x2="13" y2="8"/>
      <line x1="3" y1="12" x2="13" y2="12"/>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="4" x2="14" y2="4"/>
      <line x1="4" y1="8" x2="12" y2="8"/>
      <line x1="6" y1="12" x2="10" y2="12"/>
    </svg>
  );
}

function ProductGrid({ products }: { products: FilterableProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)", margin: 0, fontSize: 20 }}>
          Nenhum brinquedo encontrado
        </h3>
        <p style={{ color: "var(--ink-3)", fontSize: 14, maxWidth: 280, margin: 0 }}>
          Tente remover alguns filtros para ver mais opções.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
      {products.map((product) => {
        const price = product.price;
        const originalPrice = product.originalPrice;
        const discount =
          originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : null;

        return (
          <Link
            key={product.id}
            href={`/produto/${product.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "var(--r-md)",
              background: "var(--bg-elev)",
              border: "1px solid var(--line-hair)",
              overflow: "hidden",
              transition: "transform var(--t) var(--ease), border-color var(--t) var(--ease)",
              textDecoration: "none",
            }}
            className="product-card-link"
          >
            <div style={{ aspectRatio: "1/1", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative", overflow: "hidden" }}>
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>{product.category.emoji}</span>
              )}
              {product.tag && (
                <span style={{ position: "absolute", top: 8, left: 8, padding: "3px 10px", borderRadius: "var(--r-pill)", background: "var(--c-cherry)", color: "#fff", fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {product.tag}
                </span>
              )}
              {discount && (
                <span style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", borderRadius: "var(--r-pill)", background: "rgba(14,14,16,0.7)", color: "#fff", fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  −{discount}%
                </span>
              )}
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {product.category.name}
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--ink)", margin: 0, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                {product.name}
              </h3>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {originalPrice && (
                  <span style={{ fontSize: 12, color: "var(--ink-4)", textDecoration: "line-through" }}>
                    R$ {originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-display)" }}>
                  R$ {price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ProductList({ products }: { products: FilterableProduct[] }) {
  if (products.length === 0) return <ProductGrid products={[]} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {products.map((product) => {
        const price = product.price;
        const originalPrice = product.originalPrice;
        const discount =
          originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : null;

        return (
          <Link
            key={product.id}
            href={`/produto/${product.slug}`}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr auto",
              gap: 24,
              padding: 16,
              border: "1px solid var(--line-hair)",
              borderRadius: 16,
              alignItems: "center",
              transition: "border-color var(--t) var(--ease)",
              textDecoration: "none",
              background: "var(--bg-elev)",
            }}
            className="product-list-link"
          >
            <div style={{ aspectRatio: "1/1", borderRadius: 12, overflow: "hidden", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span>{product.category.emoji}</span>
              )}
            </div>
            <div>
              <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {product.category.name}
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--ink)", margin: "4px 0 0", letterSpacing: "-0.02em" }}>
                {product.name}
              </h3>
              {product.tag && (
                <span style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: "var(--r-pill)", background: "var(--c-cherry)", color: "#fff", fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {product.tag}
                </span>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {originalPrice && (
                <div style={{ fontSize: 13, color: "var(--ink-4)", textDecoration: "line-through" }}>
                  R$ {originalPrice.toFixed(2).replace(".", ",")}
                </div>
              )}
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                R$ {price.toFixed(2).replace(".", ",")}
              </div>
              {discount && (
                <div style={{ fontSize: 11, color: "var(--c-cherry)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  −{discount}%
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}


export function ProductsWithFilter({ products }: ProductsWithFilterProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    ageRanges: new Set(),
    productTypes: new Set(),
    priceRanges: new Set(),
  });
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [view, setView] = useState<ViewMode>("grid");

  const toggleAge = useCallback((range: AgeRange) => {
    setActiveFilters((prev) => {
      const next = new Set(prev.ageRanges);
      if (next.has(range)) next.delete(range);
      else next.add(range);
      return { ...prev, ageRanges: next };
    });
  }, []);

  const toggleType = useCallback((type: ProductType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev.productTypes);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return { ...prev, productTypes: next };
    });
  }, []);

  const togglePrice = useCallback((range: PriceRange) => {
    setActiveFilters((prev) => {
      const next = new Set(prev.priceRanges);
      if (next.has(range)) next.delete(range);
      else next.add(range);
      return { ...prev, priceRanges: next };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({ ageRanges: new Set(), productTypes: new Set(), priceRanges: new Set() });
  }, []);

  const filtered = useMemo(() => {
    const { ageRanges, productTypes, priceRanges } = activeFilters;
    const base = products.filter((p) => {
      const ageOk = ageRanges.size === 0 || (p.ageRange && ageRanges.has(p.ageRange));
      const typeOk = productTypes.size === 0 || (p.productType && productTypes.has(p.productType));
      const priceOk = priceRanges.size === 0 || Array.from(priceRanges).some((r) => inPriceRange(p.price, r));
      return ageOk && typeOk && priceOk;
    });

    if (sort === "menor-preco") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "maior-preco") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "novidade") return [...base].sort((a, b) => (a.tag === "Novidade" ? -1 : 1) - (b.tag === "Novidade" ? -1 : 1));
    if (sort === "maior-desconto") {
      return [...base].sort((a, b) => {
        const discA = a.originalPrice && a.originalPrice > a.price ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice && b.originalPrice > b.price ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      });
    }
    return base;
  }, [products, activeFilters, sort]);

  const filterProps = {
    activeFilters,
    onToggleAge: toggleAge,
    onToggleType: toggleType,
    onTogglePrice: togglePrice,
    onClear: clearFilters,
    totalProducts: products.length,
    filteredCount: filtered.length,
  };

  const filterCount = activeFilterCount(activeFilters);

  const productView = view === "grid"
    ? <ProductGrid products={filtered} />
    : <ProductList products={filtered} />;

  return (
    <>
      <style>{`
        .product-card-link:hover { transform: scale(1.04); border-color: var(--line) !important; }
        .product-list-link:hover { border-color: var(--ink-3) !important; }
        @media (max-width: 767px) { .product-card-link:hover { transform: none; } }
      `}</style>
      <div className="w-full">
        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--line-hair)", marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FilterModal {...filterProps} />
            <span style={{ fontSize: 13, color: "var(--ink-3)", fontFamily: "var(--font-body)" }}>
              {filtered.length === products.length ? (
                <>{products.length} produtos</>
              ) : (
                <><strong style={{ color: "var(--ink)" }}>{filtered.length}</strong> de {products.length}</>
              )}
            </span>
            {filterCount > 0 && (
              <button
                onClick={clearFilters}
                style={{ fontSize: 12, color: "var(--c-cherry)", fontWeight: 600, fontFamily: "var(--font-body)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Limpar filtros
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", border: "1.5px solid var(--line-soft)", borderRadius: 8, overflow: "hidden" }}>
              <button
                onClick={() => setView("grid")}
                title="Grade"
                style={{ width: 36, height: 36, border: "none", background: view === "grid" ? "var(--ink)" : "transparent", color: view === "grid" ? "var(--bg-elev)" : "var(--ink-3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background var(--t-fast)" }}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setView("list")}
                title="Lista"
                style={{ width: 36, height: 36, border: "none", background: view === "list" ? "var(--ink)" : "transparent", color: view === "list" ? "var(--bg-elev)" : "var(--ink-3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background var(--t-fast)" }}
              >
                <ListIcon />
              </button>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              style={{ height: 36, padding: "0 12px", border: "1.5px solid var(--line-soft)", borderRadius: 8, background: "var(--bg-elev)", color: "var(--ink)", fontSize: 13, fontFamily: "var(--font-body)", cursor: "pointer" }}
            >
              <option value="relevancia">Relevância</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="novidade">Novidades</option>
              <option value="maior-desconto">Maior desconto</option>
            </select>
          </div>
        </div>
        {productView}
      </div>
    </>
  );
}
