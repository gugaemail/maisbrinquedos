"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function useMetaPixel() {
  function track(event: string, params?: Record<string, unknown>) {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", event, params);
    }
  }

  return {
    trackViewContent: (product: { id: string; name: string; price: number; category: string }) => {
      track("ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        content_type: "product",
        value: product.price,
        currency: "BRL",
      });
    },
    trackAddToCart: (product: { id: string; name: string; price: number }) => {
      track("AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: "BRL",
      });
    },
    trackInitiateCheckout: (value: number, numItems: number) => {
      track("InitiateCheckout", { value, currency: "BRL", num_items: numItems });
    },
    trackPurchase: (value: number, orderId: string) => {
      track("Purchase", { value, currency: "BRL", order_id: orderId });
    },
    trackPageView: () => {
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    },
  };
}
