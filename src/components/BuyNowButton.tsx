"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    emoji: string;
    imageUrl?: string;
  };
}

export default function BuyNowButton({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleBuyNow() {
    addItem(product);
    router.push("/checkout");
  }

  return (
    <button
      onClick={handleBuyNow}
      className="flex-1 flex items-center justify-center px-6 py-4 rounded-full bg-[#FF3D5A] text-white font-display font-bold text-base hover:bg-[#e62e4a] transition-colors"
    >
      Comprar agora
    </button>
  );
}
