export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type GameStatus =
  | "idle"
  | "aiming"
  | "running"
  | "paused"
  | "level-cleared"
  | "life-lost"
  | "game-over"
  | "victory";

export type PowerUpKind = "widen" | "slow" | "multiball" | "shield" | "laser";

export type AssistLevel = "off" | "guide" | "auto";

export type BrickMaterial = "quartz" | "ash" | "ember" | "obsidian" | "aurora";

export interface BrickDefinition {
  col: number;
  row: number;
  hp: number;
  material: BrickMaterial;
}

export interface LevelDefinition {
  id: number;
  name: string;
  epigraph: string;
  columns: number;
  rows: number;
  bricks: BrickDefinition[];
  gravity: number;
  ballSpeed: number;
  paddleWidth: number;
  accentFrom: string;
  accentTo: string;
}
