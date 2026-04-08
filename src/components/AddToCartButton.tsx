"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";

interface Props {
  product: {
    id: number;
    name: string;
    price: number;
    emoji: string;
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd() {
    if (added) return;

    if (btnRef.current) {
      animate(btnRef.current, {
        scale: [1, 0.93, 1.05, 1],
        duration: 400,
        ease: "outCubic",
        onComplete: () => {
          addItem(product);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
      });
    } else {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <button
      ref={btnRef}
      onClick={handleAdd}
      className={`flex-1 px-6 py-4 rounded-full font-display font-bold text-base transition-colors ${
        added
          ? "bg-[#00C48C] text-white"
          : "bg-[#0057FF] text-white hover:bg-[#0057FF]/90"
      }`}
    >
      {added ? "✓ Adicionado!" : "Adicionar ao carrinho"}
    </button>
  );
}
