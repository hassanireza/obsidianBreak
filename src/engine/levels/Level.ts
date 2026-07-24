import { Vector2 } from "../Vector2";
import { Brick } from "../entities/Brick";
import type { LevelDefinition } from "../types";

const BRICK_GAP = 4;
const TOP_MARGIN = 70;
const SIDE_MARGIN = 16;

export class Level {
  readonly definition: LevelDefinition;
  bricks: Brick[] = [];

  constructor(definition: LevelDefinition, arenaWidth: number) {
    this.definition = definition;
    this.layout(arenaWidth);
  }

  private layout(arenaWidth: number): void {
    const usableWidth = arenaWidth - SIDE_MARGIN * 2;
    const brickWidth = (usableWidth - BRICK_GAP * (this.definition.columns - 1)) / this.definition.columns;
    const brickHeight = Math.min(22, brickWidth * 0.62);

    this.bricks = this.definition.bricks.map((b) => {
      const x = SIDE_MARGIN + b.col * (brickWidth + BRICK_GAP) + brickWidth / 2;
      const y = TOP_MARGIN + b.row * (brickHeight + BRICK_GAP) + brickHeight / 2;
      return new Brick(new Vector2(x, y), brickWidth, brickHeight, b.hp, b.material, b.col, b.row);
    });
  }

  get remainingBreakable(): number {
    return this.bricks.filter((b) => b.alive && !b.indestructible).length;
  }

  get cleared(): boolean {
    return this.remainingBreakable === 0;
  }

  get totalBreakable(): number {
    return this.definition.bricks.filter((b) => b.hp < 90).length;
  }
}
