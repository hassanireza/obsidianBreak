import { Vector2 } from "./Vector2";

interface Particle {
  position: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

/**
 * A pooled, allocation-light particle system. `burst` seeds a shard
 * explosion at a point; `update`/`render` are called once per frame
 * from the main engine loop.
 */
export class ParticleSystem {
  private particles: Particle[] = [];

  burst(origin: Vector2, color: string, count = 10): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 160;
      this.particles.push({
        position: origin.clone(),
        velocity: Vector2.fromAngle(angle, speed),
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        size: 1.5 + Math.random() * 2.5,
        color,
      });
    }
  }

  update(dt: number, gravity: number): void {
    for (const p of this.particles) {
      p.velocity = p.velocity.add(new Vector2(0, gravity * 0.4 * dt));
      p.position = p.position.add(p.velocity.scale(dt));
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.beginPath();
      ctx.rect(p.position.x - p.size / 2, p.position.y - p.size / 2, p.size, p.size);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  clear(): void {
    this.particles = [];
  }
}
