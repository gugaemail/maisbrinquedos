"use client";

import { useState, useEffect, useRef } from "react";
import type { ShippingOption } from "@/app/api/shipping/calculate/route";

interface CartItem {
  id: string;
  quantity: number;
}

interface UseShippingResult {
  options: ShippingOption[];
  loading: boolean;
  error: string | null;
}

export function useShipping(cep: string, items: CartItem[]): UseShippingResult {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const normalizedCep = cep.replace(/\D/g, "");

  useEffect(() => {
    if (normalizedCep.length !== 8 || items.length === 0) {
      setOptions([]);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetch("/api/shipping/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep: normalizedCep, items }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setOptions([]);
        } else {
          setOptions(data.options ?? []);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Erro ao calcular frete. Tente novamente.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedCep, JSON.stringify(items)]);

  return { options, loading, error };
}
