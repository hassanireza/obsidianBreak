import type { ReactNode } from "react";
import {
  IconAiAuto,
  IconAiGuide,
  IconAiOff,
  IconLaser,
  IconMultiball,
  IconPause,
  IconShield,
  IconSlow,
  IconSoundOff,
  IconSoundOn,
  IconWiden,
} from "../components/icons";
import type { AssistLevel, PowerUpKind } from "../engine/types";
import "./hud.css";

const POWERUP_ICON: Record<PowerUpKind, ReactNode> = {
  widen: <IconWiden />,
  slow: <IconSlow />,
  multiball: <IconMultiball />,
  shield: <IconShield />,
  laser: <IconLaser />,
};

const ASSIST_ICON: Record<AssistLevel, ReactNode> = {
  off: <IconAiOff />,
  guide: <IconAiGuide />,
  auto: <IconAiAuto />,
};

const ASSIST_LABEL: Record<AssistLevel, string> = {
  off: "Assist off",
  guide: "Guide",
  auto: "Autoplay",
};

interface HUDProps {
  levelName: string;
  levelNumber: number;
  score: number;
  lives: number;
  progress: { broken: number; total: number };
  combo: number;
  activePowerUps: PowerUpKind[];
  toast: string | null;
  assist: AssistLevel;
  audioOn: boolean;
  onPause: () => void;
  onCycleAssist: () => void;
  onToggleAudio: () => void;
}

export default function HUD({
  levelName,
  levelNumber,
  score,
  lives,
  progress,
  combo,
  activePowerUps,
  toast,
  assist,
  audioOn,
  onPause,
  onCycleAssist,
  onToggleAudio,
}: HUDProps) {
  const pct = progress.total > 0 ? Math.round((progress.broken / progress.total) * 100) : 0;

  return (
    <div className="hud">
      <div className="hud__top">
        <div className="hud__level">
          <span className="label-caps">Chamber {String(levelNumber).padStart(2, "0")}</span>
          <span className="hud__level-name">{levelName}</span>
        </div>

        <div className="hud__controls">
          <button className="hud__btn" onClick={onToggleAudio} aria-label="Toggle sound">
            {audioOn ? <IconSoundOn /> : <IconSoundOff />}
          </button>
          <button className="hud__btn" onClick={onCycleAssist} aria-label={ASSIST_LABEL[assist]}>
            {ASSIST_ICON[assist]}
          </button>
          <button className="hud__btn" onClick={onPause} aria-label="Pause">
            <IconPause />
          </button>
        </div>
      </div>

      <div className="hud__progress">
        <div className="hud__progress-bar">
          <div className="hud__progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="hud__bottom">
        <div className="hud__stat">
          <span className="label-caps">Score</span>
          <span className="hud__stat-value">{score.toLocaleString()}</span>
        </div>

        <div className="hud__powerups">
          {activePowerUps.map((kind) => (
            <span key={kind} className="hud__powerup" title={kind}>
              {POWERUP_ICON[kind]}
            </span>
          ))}
        </div>

        <div className="hud__stat hud__stat--right">
          <span className="label-caps">Lives</span>
          <span className="hud__lives">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`hud__life ${i < lives ? "hud__life--on" : ""}`} />
            ))}
          </span>
        </div>
      </div>

      {combo >= 3 && <div className="hud__combo">{combo}x combo</div>}
      {toast && <div className="hud__toast">{toast}</div>}
    </div>
  );
}
