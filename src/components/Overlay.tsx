import type { ReactNode } from "react";
import "./overlay.css";

interface OverlayProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  actions: ReactNode;
}

export default function Overlay({ title, subtitle, children, actions }: OverlayProps) {
  return (
    <div className="overlay">
      <div className="overlay__panel reveal is-visible">
        <p className="label-caps overlay__eyebrow">Obsidian Break</p>
        <h2 className="overlay__title">{title}</h2>
        {subtitle && <p className="overlay__subtitle">{subtitle}</p>}
        {children}
        <div className="overlay__actions">{actions}</div>
      </div>
    </div>
  );
}
