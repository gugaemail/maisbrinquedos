"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (e.target.value) {
        params.set("q", e.target.value);
      } else {
        params.delete("q");
      }
      router.replace(`/admin/produtos?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0F0F0F]/30 dark:text-white/30 pointer-events-none"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        placeholder="Buscar produto..."
        className="pl-9 pr-4 py-2.5 rounded-full bg-black/6 dark:bg-white/6 border border-black/10 dark:border-white/10 text-sm text-[#0F0F0F] dark:text-white placeholder:text-[#0F0F0F]/30 dark:placeholder:text-white/30 focus:outline-none focus:border-[#3B8BFF]/60 focus:bg-black/8 dark:focus:bg-white/8 transition-all duration-200 w-72"
      />
    </div>
  );
}
