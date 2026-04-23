type LogoSize = "sm" | "md" | "lg";
type LogoTheme = "light" | "dark";

interface LogoProps {
  size?: LogoSize;
  theme?: LogoTheme;
  className?: string;
}

const sizeCss: Record<LogoSize, { wrapper: string; sup: string }> = {
  sm: { wrapper: "text-xl",  sup: "text-[0.55em]" },
  md: { wrapper: "text-3xl", sup: "text-[0.55em]" },
  lg: { wrapper: "text-5xl", sup: "text-[0.55em]" },
};

function Logo({ size = "md", theme = "light", className = "" }: LogoProps) {
  const maisColor  = theme === "dark" ? "text-white"        : "text-[#FF3D5A]";
  const plusColor  = theme === "dark" ? "text-[#FFE14D]"    : "text-[#0F0F0F]";
  const { wrapper, sup } = sizeCss[size];

  return (
    <span
      className={[
        "font-display font-black leading-none tracking-tight select-none",
        wrapper,
        maisColor,
        className,
      ].join(" ")}
    >
      MAIS
      <sup className={[plusColor, sup, "align-super font-black"].join(" ")}>+</sup>
    </span>
  );
}

export { Logo };
export type { LogoSize, LogoTheme };
