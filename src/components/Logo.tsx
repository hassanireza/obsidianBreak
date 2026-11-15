export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="14" height="28" fill="#f6eacc" />
      <rect x="16" y="2" width="14" height="28" fill="#52290e" />
      <rect x="6" y="10" width="6" height="6" fill="#52290e" />
      <rect x="20" y="18" width="6" height="6" fill="#f6eacc" />
      <circle cx="9" cy="22" r="2.6" fill="#1b0f07" />
      <circle cx="23" cy="9" r="2.6" fill="#e3b95f" />
    </svg>
  );
}
