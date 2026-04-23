import { HTMLAttributes } from "react";

type BadgeVariant = "new" | "promo" | "available" | "age" | "gift";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  new:       "bg-[#3B8BFF] text-white",
  promo:     "bg-[#FFE14D] text-[#0F0F0F]",
  available: "bg-[#3DDC84] text-[#0F0F0F]",
  age:       "bg-[#0F0F0F] text-white",
  gift:      "bg-[#FF3D5A] text-white",
};

const variantLabels: Record<BadgeVariant, string> = {
  new:       "Novo",
  promo:     "Promoção",
  available: "Disponível",
  age:       "Idade",
  gift:      "Presente",
};

function Badge({ variant = "new", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-[100px] px-3 py-0.5",
        "font-body font-bold text-xs tracking-wide",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}

export { Badge };
export type { BadgeVariant };
