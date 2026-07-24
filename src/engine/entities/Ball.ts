import { Vector2 } from "../Vector2";
import { Entity } from "./Entity";

/**
 * The ball carries its own trail history for the "falling ember"
 * render style, and exposes `speed` as a scalar so the engine can
 * enforce min/max velocity independent of direction.
 */
export class Ball extends Entity {
  velocity: Vector2;
  radius: number;
  trail: Vector2[] = [];
  readonly maxTrail = 10;
  glowPhase = Math.random() * Math.PI * 2;

  constructor(position: Vector2, radius: number, velocity = Vector2.zero()) {
    super(position, radius * 2, radius * 2);
    this.radius = radius;
    this.velocity = velocity;
  }

  get speed(): number {
    return this.velocity.length();
  }

  setSpeed(speed: number): void {
    this.velocity = this.velocity.normalized().scale(speed);
  }

  applyGravity(gravity: number, dt: number): void {
    this.velocity = this.velocity.add(new Vector2(0, gravity * dt));
  }

  update(dt: number): void {
    this.trail.unshift(this.position.clone());
    if (this.trail.length > this.maxTrail) this.trail.pop();
    this.position = this.position.add(this.velocity.scale(dt));
    this.glowPhase += dt * 4;
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const t = this.trail[i];
      const fade = 1 - i / this.maxTrail;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius * fade * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 228, 218, ${fade * 0.14})`;
      ctx.fill();
    }

    const glow = 0.55 + Math.sin(this.glowPhase) * 0.15;
    const gradient = ctx.createRadialGradient(
      this.position.x,
      this.position.y,
      0,
      this.position.x,
      this.position.y,
      this.radius * 3,
    );
    gradient.addColorStop(0, `rgba(232, 228, 218, ${glow})`);
    gradient.addColorStop(1, "rgba(232, 228, 218, 0)");
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e8e4da";
    ctx.fill();
  }
}
