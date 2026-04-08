"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function useScrollReveal(staggerDelay = 80) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((c) => (c.style.opacity = "0"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(children, {
              translateY: [24, 0],
              opacity: [0, 1],
              duration: 500,
              delay: stagger(staggerDelay),
              ease: "outCubic",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return ref;
}
