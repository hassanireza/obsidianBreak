interface LogoProps {
  compact?: boolean;
  size?: number;
}

export default function Logo({ compact = false, size = 30 }: LogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
      <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 2L27 15L15 28L3 15L15 2Z" stroke="var(--color-bone)" strokeWidth="0.9" />
        <path d="M9 11H12M14 11H17M19 11H21" stroke="var(--color-bone-dim)" strokeWidth="1.1" strokeLinecap="round" />
        <rect x="9" y="20" width="12" height="1.8" rx="0.9" fill="var(--color-bone)" />
        <circle cx="15" cy="15.5" r="1.7" fill="var(--color-bone)" />
      </svg>
      {!compact && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            letterSpacing: "0.03em",
            lineHeight: 1,
          }}
        >
          Obsidian Break
        </span>
      )}
    </span>
  );
}
