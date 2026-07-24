/**
 * A minimal, immutable-by-convention 2D vector used across every
 * physics body in the engine. Methods that return a Vector2 always
 * return a *new* instance so callers can safely chain without
 * mutating shared state.
 */
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static fromAngle(radians: number, length = 1): Vector2 {
    return new Vector2(Math.cos(radians) * length, Math.sin(radians) * length);
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  scale(factor: number): Vector2 {
    return new Vector2(this.x * factor, this.y * factor);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalized(): Vector2 {
    const len = this.length();
    if (len === 0) return Vector2.zero();
    return new Vector2(this.x / len, this.y / len);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  reflect(normal: Vector2): Vector2 {
    const n = normal.normalized();
    const d = 2 * this.dot(n);
    return new Vector2(this.x - d * n.x, this.y - d * n.y);
  }

  clampLength(min: number, max: number): Vector2 {
    const len = this.length();
    if (len === 0) return Vector2.zero();
    const clamped = Math.min(Math.max(len, min), max);
    return this.normalized().scale(clamped);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
}
