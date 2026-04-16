"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { AgeFilter, ActiveFilters, AgeRange, ProductType } from "./AgeFilter";

export interface FilterableProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  category: { name: string; slug: string; emoji: string };
  imageUrl?: string | null;
  tag?: string | null;
  /** Optional: '0-2' | '3-5' | '6-8' | '9-12' */
  ageRange?: AgeRange;
  /** Optional: 'educativo' | 'motor' | 'criativo' | 'classico' */
  productType?: ProductType;
}

interface ProductsWithFilterProps {
  products: FilterableProduct[];
}

function ProductGrid({ products }: { products: FilterableProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-5xl">🔍</span>
        <p className="font-display font-bold text-[#1A1A2E] dark:text-white text-lg">
          Nenhum produto encontrado
        </p>
        <p className="text-[#6B7080] dark:text-white/60 text-sm font-body max-w-xs">
          Tente remover alguns filtros para ver mais opções.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            href={`/produto/${product.id}`}
            className="group flex flex-col rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/10 overflow-hidden hover:shadow-lg hover:border-[#0057FF]/20 transition-all duration-200"
          >
            <div className="aspect-square bg-[#F0F4FF] dark:bg-white/5 flex items-center justify-center text-5xl relative overflow-hidden">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{product.category.emoji}</span>
              )}
              {product.tag && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0057FF] text-white text-xs font-semibold font-body">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-1">
              <span className="text-xs text-[#6B7080] dark:text-white/60 font-body">
                {product.category.name}
              </span>
              <h3 className="text-sm font-display font-semibold text-[#1A1A2E] dark:text-white leading-tight group-hover:text-[#0057FF] transition-colors duration-200">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-base font-bold text-[#1A1A2E] dark:text-white">
                  R$ {price.toFixed(2).replace(".", ",")}
                </p>
                {discount && (
                  <span className="text-xs font-semibold text-[#00C48C]">
                    {discount}% OFF
                  </span>
                )}
              </div>
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
  });

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

  const clearFilters = useCallback(() => {
    setActiveFilters({ ageRanges: new Set(), productTypes: new Set() });
  }, []);

  const filtered = useMemo(() => {
    const { ageRanges, productTypes } = activeFilters;
    return products.filter((p) => {
      const ageOk = ageRanges.size === 0 || (p.ageRange && ageRanges.has(p.ageRange));
      const typeOk =
        productTypes.size === 0 ||
        (p.productType && productTypes.has(p.productType));
      return ageOk && typeOk;
    });
  }, [products, activeFilters]);

  const filterProps = {
    activeFilters,
    onToggleAge: toggleAge,
    onToggleType: toggleType,
    onClear: clearFilters,
    totalProducts: products.length,
    filteredCount: filtered.length,
  };

  return (
    <div>
      {/* Responsive layout: column on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
        {/* AgeFilter renders HorizontalFilter on mobile, SidebarFilter on desktop */}
        <AgeFilter {...filterProps} />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#6B7080] dark:text-white/60 font-body">
              {filtered.length === products.length ? (
                <span>{products.length} produtos</span>
              ) : (
                <span>
                  <span className="font-semibold text-[#1A1A2E] dark:text-white">{filtered.length}</span>{" "}
                  de {products.length} produtos
                </span>
              )}
            </p>
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
