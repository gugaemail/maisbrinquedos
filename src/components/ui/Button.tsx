import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "accent" | "dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#FF3D5A] text-white hover:bg-[#e62e4a]",
  accent:  "bg-[#FFE14D] text-[#0F0F0F] hover:bg-[#f5d63a]",
  dark:    "bg-[#0F0F0F] text-white hover:bg-[#2a2a2a]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2",
          "rounded-[100px] px-6 py-3",
          "font-display font-bold text-sm tracking-wide",
          "transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          variantClasses[variant],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonVariant };
