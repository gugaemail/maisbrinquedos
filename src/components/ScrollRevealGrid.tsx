"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ReactNode } from "react";

interface Props {
  className?: string;
  staggerDelay?: number;
  children: ReactNode;
}

export default function ScrollRevealGrid({ className, staggerDelay, children }: Props) {
  const ref = useScrollReveal(staggerDelay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
