interface Props {
  value?: number;
  size?: number;
  showValue?: boolean;
  count?: number | null;
}

export default function Stars({ value = 5, size = 13, showValue = true, count = null }: Props) {
  const filled = Math.round(value);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-2)" }}>
      <span style={{ display: "inline-flex", color: "var(--c-sun-deep)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} size={size} filled={i < filled} />
        ))}
      </span>
      {showValue && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
          {value.toFixed(1)}{count != null ? ` · ${count}` : ""}
        </span>
      )}
    </span>
  );
}

function StarIcon({ size, filled }: { size: number; filled: boolean }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}
