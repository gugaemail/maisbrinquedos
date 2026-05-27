"use client";

import { useState } from "react";

export type AgeRange = "0-2" | "3-5" | "6-8" | "9-12";
export type ProductType = "educativo" | "motor" | "criativo" | "classico";
export type PriceRange = "0-50" | "50-150" | "150-300" | "300+";

export interface ActiveFilters {
  ageRanges: Set<AgeRange>;
  productTypes: Set<ProductType>;
  priceRanges: Set<PriceRange>;
}

export const PRICE_RANGE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "0-50", label: "Até R$ 50" },
  { value: "50-150", label: "R$ 50–150" },
  { value: "150-300", label: "R$ 150–300" },
  { value: "300+", label: "Acima de R$ 300" },
];

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "0-2", label: "0–2 anos" },
  { value: "3-5", label: "3–5 anos" },
  { value: "6-8", label: "6–8 anos" },
  { value: "9-12", label: "9–12 anos" },
];

const TYPE_OPTIONS: { value: ProductType; label: string; emoji: string }[] = [
  { value: "educativo", label: "Educativo", emoji: "📚" },
  { value: "motor", label: "Motor", emoji: "🏃" },
  { value: "criativo", label: "Criativo", emoji: "🎨" },
  { value: "classico", label: "Clássico", emoji: "🎲" },
];

interface FilterModalProps {
  activeFilters: ActiveFilters;
  onToggleAge: (range: AgeRange) => void;
  onToggleType: (type: ProductType) => void;
  onTogglePrice: (range: PriceRange) => void;
  onClear: () => void;
  totalProducts: number;
  filteredCount: number;
}

function hasActiveFilters(f: ActiveFilters) {
  return f.ageRanges.size > 0 || f.productTypes.size > 0 || f.priceRanges.size > 0;
}

export function activeFilterCount(f: ActiveFilters) {
  return f.ageRanges.size + f.productTypes.size + f.priceRanges.size;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 999,
        border: active ? "2px solid var(--c-cherry)" : "1.5px solid var(--line)",
        background: active ? "var(--c-cherry)" : "var(--bg-elev)",
        color: active ? "#fff" : "var(--ink-2)",
        fontSize: 14,
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      margin: "0 0 12px",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--ink-3)",
    }}>
      {children}
    </p>
  );
}

export function FilterModal({
  activeFilters,
  onToggleAge,
  onToggleType,
  onTogglePrice,
  onClear,
  totalProducts,
  filteredCount,
}: FilterModalProps) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(activeFilters);
  const hasFilters = hasActiveFilters(activeFilters);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          padding: "0 16px",
          borderRadius: 999,
          border: "1.5px solid var(--line)",
          background: hasFilters ? "var(--c-cherry)" : "var(--bg-elev)",
          color: hasFilters ? "#fff" : "var(--ink)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 150ms ease",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="4" x2="14" y2="4"/>
          <line x1="4" y1="8" x2="12" y2="8"/>
          <line x1="6" y1="12" x2="10" y2="12"/>
        </svg>
        Filtros
        {count > 0 && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            color: "var(--c-cherry)",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}>
            {count}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--bg)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(.22,.61,.36,1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid var(--line-hair)",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>
            Filtros
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {hasFilters && (
              <button
                onClick={() => { onClear(); }}
                style={{ fontSize: 13, color: "var(--c-cherry)", fontWeight: 600, fontFamily: "var(--font-body)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
              >
                Limpar tudo
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-sunken)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Price */}
          <div style={{ marginBottom: 28 }}>
            <SectionLabel>Faixa de Preço</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRICE_RANGE_OPTIONS.map((opt) => (
                <Pill
                  key={opt.value}
                  active={activeFilters.priceRanges.has(opt.value)}
                  onClick={() => onTogglePrice(opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--line-hair)", marginBottom: 28 }} />

          {/* Age */}
          <div style={{ marginBottom: 28 }}>
            <SectionLabel>Faixa Etária</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AGE_OPTIONS.map((opt) => (
                <Pill
                  key={opt.value}
                  active={activeFilters.ageRanges.has(opt.value)}
                  onClick={() => onToggleAge(opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--line-hair)", marginBottom: 28 }} />

          {/* Type */}
          <div style={{ marginBottom: 28 }}>
            <SectionLabel>Tipo de Brinquedo</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TYPE_OPTIONS.map((opt) => (
                <Pill
                  key={opt.value}
                  active={activeFilters.productTypes.has(opt.value)}
                  onClick={() => onToggleType(opt.value)}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line-hair)" }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 999,
              background: "var(--ink)",
              color: "var(--bg-elev)",
              border: "none",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {hasFilters
              ? `Ver ${filteredCount} de ${totalProducts} produtos`
              : `Ver todos os ${totalProducts} produtos`}
          </button>
        </div>
      </div>
    </>
  );
}

export { FilterModal as SidebarFilter, FilterModal as HorizontalFilter };

export function AgeFilter(props: FilterModalProps) {
  return <FilterModal {...props} />;
}
