import { Vector2 } from "../Vector2";
import type { Rect } from "../types";

/**
 * Every physical object in the game inherits from Entity. It owns a
 * position and a size, and exposes the bounds rectangle collision
 * routines need. Subclasses implement `update` and `render`.
 */
export abstract class Entity {
  position: Vector2;
  width: number;
  height: number;
  alive = true;

  protected constructor(position: Vector2, width: number, height: number) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  get bounds(): Rect {
    return {
      x: this.position.x - this.width / 2,
      y: this.position.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  abstract update(dt: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
