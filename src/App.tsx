import { useState } from "react";
import MainMenu from "./screens/MainMenu";
import LevelSelect from "./screens/LevelSelect";
import GameScreen from "./screens/GameScreen";
import GrainOverlay from "./components/GrainOverlay";
import { LEVELS } from "./engine/levels/levelData";
import { loadHighestUnlocked } from "./lib/progress";
import "./styles/global.css";

type View = "menu" | "levels" | "game";

export default function App() {
  const [view, setView] = useState<View>("menu");
  const [levelIndex, setLevelIndex] = useState(0);

  const highestUnlocked = loadHighestUnlocked();
  const levelMeta = LEVELS.map((l, i) => ({ ...l, unlocked: i <= highestUnlocked }));

  return (
    <>
      <GrainOverlay />
      {view === "menu" && (
        <MainMenu
          continueLabel={highestUnlocked > 0 ? `Continue: Chamber ${highestUnlocked + 1}` : null}
          onPlay={() => {
            setLevelIndex(highestUnlocked);
            setView("game");
          }}
          onLevels={() => setView("levels")}
        />
      )}
      {view === "levels" && (
        <LevelSelect
          levels={levelMeta}
          onBack={() => setView("menu")}
          onSelect={(i) => {
            setLevelIndex(i);
            setView("game");
          }}
        />
      )}
      {view === "game" && <GameScreen levelIndex={levelIndex} onExit={() => setView("menu")} />}
    </>
  );
}
