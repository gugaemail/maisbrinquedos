"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface ToastData {
  id: number;
  message: string;
}

let listeners: Array<(toast: ToastData) => void> = [];
let counter = 0;

export function showToast(message: string) {
  const toast: ToastData = { id: ++counter, message };
  listeners.forEach((l) => l(toast));
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handler = (toast: ToastData) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2400);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter((l) => l !== handler); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 500, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 20px",
            background: "var(--ink)",
            color: "var(--inverse-fg)",
            borderRadius: "var(--r-pill)",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(14,14,16,0.28)",
            animation: "toast-in 280ms var(--ease-out) both",
            whiteSpace: "nowrap",
          }}
        >
          <CheckIcon />
          {t.message}
          <Link
            href="/carrinho"
            style={{ color: "var(--c-sun)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: 4 }}
          >
            VER SACOLA
          </Link>
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-kiwi)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
