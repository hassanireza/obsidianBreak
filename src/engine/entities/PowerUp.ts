import { Vector2 } from "../Vector2";
import { Entity } from "./Entity";
import type { PowerUpKind } from "../types";

const GLYPHS: Record<PowerUpKind, string> = {
  widen: "W",
  slow: "S",
  multiball: "M",
  shield: "H",
  laser: "L",
};

export class PowerUp extends Entity {
  kind: PowerUpKind;
  fallSpeed = 140;
  spin = 0;

  constructor(position: Vector2, kind: PowerUpKind) {
    super(position, 26, 26);
    this.kind = kind;
  }

  update(dt: number): void {
    this.position = this.position.add(new Vector2(0, this.fallSpeed * dt));
    this.spin += dt * 2;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.position;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(this.spin) * 0.15);

    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18, 21, 28, 0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(232, 228, 218, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#e8e4da";
    ctx.font = "600 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(GLYPHS[this.kind], 0, 1);
    ctx.restore();
  }
}
