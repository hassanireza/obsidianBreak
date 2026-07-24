import { Vector2 } from "../Vector2";
import { Entity } from "./Entity";

/**
 * The paddle never teleports to the pointer position: it eases
 * toward a target x each frame, which reads as weighty and
 * intentional rather than twitchy, matching the Obsidian brand's
 * calm, deliberate motion language.
 */
export class Paddle extends Entity {
  baseWidth: number;
  targetX: number;
  minX = 0;
  maxX = 0;
  shieldCharges = 0;
  laserCharges = 0;
  widenTimer = 0;
  readonly ease = 16;

  constructor(position: Vector2, width: number, height: number) {
    super(position, width, height);
    this.baseWidth = width;
    this.targetX = position.x;
  }

  setBounds(minX: number, maxX: number): void {
    this.minX = minX;
    this.maxX = maxX;
  }

  setTarget(x: number): void {
    const half = this.width / 2;
    this.targetX = Math.min(Math.max(x, this.minX + half), this.maxX - half);
  }

  applyWiden(durationSeconds: number): void {
    this.width = this.baseWidth * 1.5;
    this.widenTimer = durationSeconds;
  }

  update(dt: number): void {
    if (this.widenTimer > 0) {
      this.widenTimer -= dt;
      if (this.widenTimer <= 0) this.width = this.baseWidth;
    }
    const dx = this.targetX - this.position.x;
    this.position = new Vector2(
      this.position.x + dx * Math.min(1, this.ease * dt),
      this.position.y,
    );
  }

  /** Returns a value from -1 (far left edge) to 1 (far right edge) for reflection angling. */
  hitFactor(ballX: number): number {
    return (ballX - this.position.x) / (this.width / 2);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this.bounds;
    const radius = height / 2;

    ctx.save();
    if (this.shieldCharges > 0) {
      ctx.shadowColor = "rgba(139, 143, 148, 0.7)";
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowColor = "rgba(232, 228, 218, 0.35)";
      ctx.shadowBlur = 10;
    }

    ctx.beginPath();
    this.roundedRectPath(ctx, x, y, width, height, radius);
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, "#a8a49a");
    gradient.addColorStop(0.5, "#e8e4da");
    gradient.addColorStop(1, "#a8a49a");
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    if (this.shieldCharges > 0) {
      ctx.beginPath();
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x + width, y - 6);
      ctx.strokeStyle = "rgba(139, 143, 148, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  private roundedRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
