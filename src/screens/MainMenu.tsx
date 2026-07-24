import Logo from "../components/Logo";
import { IconPlay } from "../components/icons";
import "./mainMenu.css";

interface MainMenuProps {
  onPlay: () => void;
  onLevels: () => void;
  continueLabel: string | null;
}

export default function MainMenu({ onPlay, onLevels, continueLabel }: MainMenuProps) {
  return (
    <div className="menu">
      <div className="menu__grain-frame" />
      <div className="menu__content reveal is-visible">
        <div className="menu__mark">
          <Logo size={44} compact />
        </div>
        <p className="label-caps menu__eyebrow">Obsidian Game Center</p>
        <h1 className="menu__title">Obsidian Break</h1>
        <p className="menu__tagline">A brick-breaking ritual of glass, gravity and quiet light.</p>

        <div className="menu__actions">
          <button className="btn btn--primary menu__cta" onClick={onPlay}>
            <IconPlay /> {continueLabel ?? "Begin"}
          </button>
          <button className="btn btn--ghost menu__cta" onClick={onLevels}>
            Choose a chamber
          </button>
        </div>

        <p className="menu__hint">Drag to move. Tap to launch. Ten chambers await.</p>
      </div>
    </div>
  );
}
