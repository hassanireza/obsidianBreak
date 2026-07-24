import { useEffect, useRef, useState } from "react";
import HUD from "../components/HUD";
import Overlay from "../components/Overlay";
import { IconBack, IconPlay, IconRestart } from "../components/icons";
import { useGameEngine } from "../hooks/useGameEngine";
import type { AssistLevel } from "../engine/types";
import { LEVELS } from "../engine/levels/levelData";
import "./gameScreen.css";

interface GameScreenProps {
  levelIndex: number;
  onExit: () => void;
}

const ASSIST_CYCLE: AssistLevel[] = ["guide", "auto", "off"];

export default function GameScreen({ levelIndex, onExit }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { engine, state, startLevel, restart, next, togglePause, setAssist, setAudioEnabled } =
    useGameEngine(canvasRef);
  const [assist, setAssistLocal] = useState<AssistLevel>("guide");
  const [audioOn, setAudioOn] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    if (!engine.current || started.current) return;
    started.current = true;
    startLevel(levelIndex);
    setAssist(assist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.current]);

  const cycleAssist = () => {
    const idx = ASSIST_CYCLE.indexOf(assist);
    const nextAssist = ASSIST_CYCLE[(idx + 1) % ASSIST_CYCLE.length];
    setAssistLocal(nextAssist);
    setAssist(nextAssist);
  };

  const toggleAudio = () => {
    setAudioOn((prev) => {
      setAudioEnabled(!prev);
      return !prev;
    });
  };

  const level = LEVELS[state.levelIndex] ?? LEVELS[levelIndex];
  const isLast = state.levelIndex >= LEVELS.length - 1;

  return (
    <div className="game-screen">
      <div className="game-screen__canvas-wrap">
        <canvas ref={canvasRef} className="game-screen__canvas" />
      </div>

      <HUD
        levelName={level?.name ?? ""}
        levelNumber={(level?.id ?? 1)}
        score={state.score}
        lives={state.lives}
        progress={state.levelProgress}
        combo={state.combo}
        activePowerUps={state.activePowerUps}
        toast={state.toast}
        assist={assist}
        audioOn={audioOn}
        onPause={togglePause}
        onCycleAssist={cycleAssist}
        onToggleAudio={toggleAudio}
      />

      {state.status === "paused" && (
        <Overlay
          title="Paused"
          actions={
            <>
              <button className="btn btn--primary" onClick={togglePause}>
                <IconPlay /> Resume
              </button>
              <button className="btn btn--ghost" onClick={restart}>
                <IconRestart /> Restart chamber
              </button>
              <button className="btn btn--ghost" onClick={onExit}>
                <IconBack /> Leave chamber
              </button>
            </>
          }
        />
      )}

      {state.status === "game-over" && (
        <Overlay
          title="The glass has settled"
          subtitle={`You reached chamber ${level?.id ?? 1} with a score of ${state.score.toLocaleString()}.`}
          actions={
            <>
              <button className="btn btn--primary" onClick={restart}>
                <IconRestart /> Try again
              </button>
              <button className="btn btn--ghost" onClick={onExit}>
                <IconBack /> Return to menu
              </button>
            </>
          }
        />
      )}

      {state.status === "level-cleared" && !isLast && (
        <Overlay
          title="Chamber cleared"
          subtitle={`Score ${state.score.toLocaleString()}`}
          actions={
            <>
              <button className="btn btn--primary" onClick={next}>
                <IconPlay /> Next chamber
              </button>
              <button className="btn btn--ghost" onClick={onExit}>
                <IconBack /> Return to menu
              </button>
            </>
          }
        />
      )}

      {state.status === "victory" && (
        <Overlay
          title="The last obelisk falls silent"
          subtitle={`Every chamber is cleared. Final score: ${state.score.toLocaleString()}.`}
          actions={
            <>
              <button className="btn btn--primary" onClick={onExit}>
                <IconBack /> Return to menu
              </button>
            </>
          }
        />
      )}
    </div>
  );
}
