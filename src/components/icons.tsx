interface IconProps {
  size?: number;
}

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconPlay({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M7 4.5L19 12L7 19.5V4.5Z" />
    </svg>
  );
}

export function IconPause({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M8 5V19M16 5V19" />
    </svg>
  );
}

export function IconRestart({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 12a8 8 0 1 1 2.5 5.8M4 12V6M4 12H10" />
    </svg>
  );
}

export function IconBack({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M15 5L8 12L15 19" />
    </svg>
  );
}

export function IconSoundOn({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 9.5V14.5H7.5L12.5 18.5V5.5L7.5 9.5H4Z" />
      <path d="M16.5 9C17.5 10 18 11 18 12C18 13 17.5 14 16.5 15" />
      <path d="M19 6.5C20.7 8 21.5 10 21.5 12C21.5 14 20.7 16 19 17.5" />
    </svg>
  );
}

export function IconSoundOff({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 9.5V14.5H7.5L12.5 18.5V5.5L7.5 9.5H4Z" />
      <path d="M16.5 10L20.5 14M20.5 10L16.5 14" />
    </svg>
  );
}

export function IconAiOff({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export function IconAiGuide({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconAiAuto({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3L14.2 9.4L20.8 12L14.2 14.6L12 21L9.8 14.6L3.2 12L9.8 9.4L12 3Z" />
    </svg>
  );
}

export function IconStar({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L14.6 9.3L21.4 9.9L16.2 14.3L17.8 21L12 17.3L6.2 21L7.8 14.3L2.6 9.9L9.4 9.3L12 3Z" />
    </svg>
  );
}

export function IconHeart({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 20.5C12 20.5 3.5 15.2 3.5 9.3C3.5 6.4 5.8 4.2 8.6 4.2C10.1 4.2 11.3 4.9 12 6C12.7 4.9 13.9 4.2 15.4 4.2C18.2 4.2 20.5 6.4 20.5 9.3C20.5 15.2 12 20.5 12 20.5Z" />
    </svg>
  );
}

export function IconShield({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3L19 6V11C19 15.4 16 19.1 12 20.5C8 19.1 5 15.4 5 11V6L12 3Z" />
    </svg>
  );
}

export function IconWiden({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2 12H22M2 12L6 8M2 12L6 16M22 12L18 8M22 12L18 16" />
    </svg>
  );
}

export function IconSlow({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8V12L14.5 14" />
    </svg>
  );
}

export function IconMultiball({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <circle cx="12" cy="17" r="3" />
    </svg>
  );
}

export function IconLaser({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3V15M8 21H16" />
    </svg>
  );
}

export function IconLock({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10.5" />
    </svg>
  );
}

export function IconClose({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M5 5L19 19M19 5L5 19" />
    </svg>
  );
}
