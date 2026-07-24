import { useEffect, useRef, useState } from "react";
import { GameEngine } from "../engine/GameEngine";
import type { AssistLevel, GameStatus, PowerUpKind } from "../engine/types";
import { loadHighestUnlocked, saveHighestUnlocked } from "../lib/progress";

export interface EngineUiState {
  status: GameStatus;
  score: number;
  lives: number;
  levelIndex: number;
  levelProgress: { broken: number; total: number };
  combo: number;
  activePowerUps: PowerUpKind[];
  toast: string | null;
}

const initialState: EngineUiState = {
  status: "idle",
  score: 0,
  lives: 3,
  levelIndex: 0,
  levelProgress: { broken: 0, total: 0 },
  combo: 0,
  activePowerUps: [],
  toast: null,
};

export function useGameEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const engineRef = useRef<GameEngine | null>(null);
  const [state, setState] = useState<EngineUiState>(initialState);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new GameEngine(canvas);
    engine.setHighestUnlocked(loadHighestUnlocked());
    engineRef.current = engine;

    const container = canvas.parentElement;
    const resize = () => {
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.resize(container.clientWidth, container.clientHeight, dpr);
    };
    resize();
    const observer = new ResizeObserver(resize);
    if (container) observer.observe(container);

    const unsubs = [
      engine.events.on("status", (status) => setState((s) => ({ ...s, status }))),
      engine.events.on("score", (score) => setState((s) => ({ ...s, score }))),
      engine.events.on("lives", (lives) => setState((s) => ({ ...s, lives }))),
      engine.events.on("levelProgress", (levelProgress) => setState((s) => ({ ...s, levelProgress }))),
      engine.events.on("combo", (combo) => setState((s) => ({ ...s, combo }))),
      engine.events.on("powerup", ({ kind, active }) =>
        setState((s) => ({
          ...s,
          activePowerUps: active
            ? [...s.activePowerUps.filter((k) => k !== kind), kind]
            : s.activePowerUps.filter((k) => k !== kind),
        })),
      ),
      engine.events.on("unlocked", (n) => saveHighestUnlocked(n)),
      engine.events.on("toast", (toast) => {
        setState((s) => ({ ...s, toast }));
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setState((s) => ({ ...s, toast: null })), 1600);
      }),
    ];

    return () => {
      unsubs.forEach((u) => u());
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [canvasRef]);

  return {
    engine: engineRef,
    state,
    startLevel: (index: number) => {
      const e = engineRef.current;
      if (!e) return;
      e.jumpToLevel(index);
      e.start();
      setState((s) => ({ ...s, levelIndex: index }));
    },
    restart: () => engineRef.current?.restartLevel(),
    next: () => {
      engineRef.current?.nextLevel();
      setState((s) => ({ ...s, levelIndex: s.levelIndex + 1 }));
    },
    togglePause: () => engineRef.current?.togglePause(),
    setAssist: (level: AssistLevel) => engineRef.current?.setAssist(level),
    setAudioEnabled: (enabled: boolean) => engineRef.current?.setAudioEnabled(enabled),
    getLevelMeta: () => engineRef.current?.getLevelMeta() ?? [],
  };
}
