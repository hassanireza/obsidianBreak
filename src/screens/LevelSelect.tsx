import { IconBack, IconLock, IconStar } from "../components/icons";
import type { LevelDefinition } from "../engine/types";
import "./levelSelect.css";

interface LevelMeta extends LevelDefinition {
  unlocked: boolean;
}

interface LevelSelectProps {
  levels: LevelMeta[];
  onSelect: (index: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ levels, onSelect, onBack }: LevelSelectProps) {
  return (
    <div className="levels">
      <header className="levels__header">
        <button className="btn btn--ghost btn--icon" onClick={onBack} aria-label="Back">
          <IconBack />
        </button>
        <p className="label-caps">Choose a chamber</p>
        <span className="levels__spacer" />
      </header>

      <div className="levels__grid">
        {levels.map((level, i) => (
          <button
            key={level.id}
            className={`levels__card ${level.unlocked ? "" : "levels__card--locked"}`}
            onClick={() => level.unlocked && onSelect(i)}
            disabled={!level.unlocked}
            style={{
              background: `linear-gradient(135deg, ${level.accentFrom} 0%, #0a0a0c 75%)`,
            }}
          >
            <span className="levels__card-number">{String(level.id).padStart(2, "0")}</span>
            <span className="levels__card-name">{level.name}</span>
            {level.unlocked ? (
              <span className="levels__card-icon" style={{ color: level.accentTo }}>
                <IconStar />
              </span>
            ) : (
              <span className="levels__card-icon levels__card-icon--lock">
                <IconLock />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
