"use client";

import { useState, useCallback } from "react";

export interface CEPAddress {
  zip: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

type CEPStatus = "idle" | "loading" | "found" | "not_found" | "error";

export function useCEP() {
  const [status, setStatus] = useState<CEPStatus>("idle");
  const [address, setAddress] = useState<CEPAddress | null>(null);

  const fetchCEP = useCallback(async (rawCep: string) => {
    const cep = rawCep.replace(/\D/g, "");
    if (cep.length !== 8) return null;

    setStatus("loading");
    setAddress(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) throw new Error("Falha na requisição");

      const data: ViaCEPResponse = await res.json();

      if (data.erro) {
        setStatus("not_found");
        return null;
      }

      const parsed: CEPAddress = {
        zip: data.cep,
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      };

      setAddress(parsed);
      setStatus("found");
      return parsed;
    } catch {
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setAddress(null);
  }, []);

  return { fetchCEP, address, status, reset };
}
