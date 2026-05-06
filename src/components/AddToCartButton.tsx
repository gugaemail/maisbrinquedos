"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";
import { useMetaPixel } from "@/hooks/useMetaPixel";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    emoji: string;
    imageUrl?: string;
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const { trackAddToCart } = useMetaPixel();
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd() {
    if (added) return;

    trackAddToCart({ id: product.id, name: product.name, price: product.price });

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
      className={`flex-1 px-6 py-4 rounded-full border-2 font-display font-bold text-base transition-colors ${
        added
          ? "bg-[#3DDC84] border-[#3DDC84] text-[#0F0F0F]"
          : "bg-transparent border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#0F0F0F]"
      }`}
    >
      {added ? "✓ Adicionado!" : "Adicionar ao carrinho"}
    </button>
  );
}
