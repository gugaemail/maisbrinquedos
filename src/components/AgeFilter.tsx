"use client";

export type AgeRange = "0-2" | "3-5" | "6-8" | "9-12";
export type ProductType = "educativo" | "motor" | "criativo" | "classico";

export interface ActiveFilters {
  ageRanges: Set<AgeRange>;
  productTypes: Set<ProductType>;
}

interface AgeFilterProps {
  activeFilters: ActiveFilters;
  onToggleAge: (range: AgeRange) => void;
  onToggleType: (type: ProductType) => void;
  onClear: () => void;
  totalProducts: number;
  filteredCount: number;
}

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

function Chip({
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
      className={[
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-semibold font-body whitespace-nowrap transition-all duration-200 cursor-pointer",
        active
          ? "bg-[#0057FF] text-white border-[#0057FF] shadow-sm"
          : "bg-white dark:bg-white/5 text-[#6B7080] dark:text-white/70 border-[#E2E6F0] dark:border-white/15 hover:border-[#0057FF]/40 hover:text-[#0057FF]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function hasActiveFilters(f: ActiveFilters) {
  return f.ageRanges.size > 0 || f.productTypes.size > 0;
}

/** Sidebar version (desktop md+) */
function SidebarFilter({
  activeFilters,
  onToggleAge,
  onToggleType,
  onClear,
  totalProducts,
  filteredCount,
}: AgeFilterProps) {
  return (
    <aside className="w-56 shrink-0 sticky top-24 self-start hidden md:block">
      <div className="rounded-2xl border border-[#E2E6F0] dark:border-white/10 bg-white dark:bg-white/5 p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-[#1A1A2E] dark:text-white text-sm">Filtros</span>
          {hasActiveFilters(activeFilters) && (
            <button
              onClick={onClear}
              className="text-xs text-[#0057FF] font-semibold hover:underline font-body cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Age range section */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#6B7080] dark:text-white/50 uppercase tracking-wider font-body">
            Faixa Etária
          </p>
          <div className="flex flex-col gap-2">
            {AGE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                active={activeFilters.ageRanges.has(opt.value)}
                onClick={() => onToggleAge(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#E2E6F0] dark:bg-white/10" />

        {/* Type section */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#6B7080] dark:text-white/50 uppercase tracking-wider font-body">
            Tipo de Brinquedo
          </p>
          <div className="flex flex-col gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                active={activeFilters.productTypes.has(opt.value)}
                onClick={() => onToggleType(opt.value)}
              >
                <span>{opt.emoji}</span>
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Result count */}
        {hasActiveFilters(activeFilters) && (
          <>
            <div className="h-px bg-[#E2E6F0] dark:bg-white/10" />
            <p className="text-xs text-[#6B7080] dark:text-white/60 font-body text-center">
              <span className="font-bold text-[#1A1A2E] dark:text-white">{filteredCount}</span> de {totalProducts} produtos
            </p>
          </>
        )}
      </div>
    </aside>
  );
}

/** Horizontal scroll bar version (mobile) */
function HorizontalFilter({
  activeFilters,
  onToggleAge,
  onToggleType,
  onClear,
}: AgeFilterProps) {
  return (
    <div className="md:hidden flex flex-col gap-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {hasActiveFilters(activeFilters) && (
          <button
            onClick={onClear}
            className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#FF3D57]/40 text-[#FF3D57] text-sm font-semibold font-body whitespace-nowrap transition-all duration-200 cursor-pointer hover:bg-[#FF3D57]/5 shrink-0"
          >
            ✕ Limpar
          </button>
        )}
        {AGE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={activeFilters.ageRanges.has(opt.value)}
            onClick={() => onToggleAge(opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
        <div className="w-px h-5 bg-[#E2E6F0] shrink-0 self-center" />
        {TYPE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={activeFilters.productTypes.has(opt.value)}
            onClick={() => onToggleType(opt.value)}
          >
            <span>{opt.emoji}</span>
            {opt.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function AgeFilter(props: AgeFilterProps) {
  return (
    <>
      <SidebarFilter {...props} />
      <HorizontalFilter {...props} />
    </>
  );
}
