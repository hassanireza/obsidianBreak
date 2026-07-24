import { Vector2 } from "../Vector2";
import { Entity } from "./Entity";
import type { BrickMaterial } from "../types";

const MATERIAL_FILLS: Record<BrickMaterial, [string, string]> = {
  quartz: ["#e8e4da", "#a8a49a"],
  ash: ["#8a8f92", "#4a4d51"],
  ember: ["#c98f5e", "#7a4f2e"],
  obsidian: ["#3a3d42", "#1c1e22"],
  aurora: ["#9fd8c9", "#6fa5c9"],
};

export class Brick extends Entity {
  hp: number;
  readonly maxHp: number;
  material: BrickMaterial;
  col: number;
  row: number;
  crackPhase = 0;
  fadeOut = 1;

  constructor(
    position: Vector2,
    width: number,
    height: number,
    hp: number,
    material: BrickMaterial,
    col: number,
    row: number,
  ) {
    super(position, width, height);
    this.hp = hp;
    this.maxHp = hp;
    this.material = material;
    this.col = col;
    this.row = row;
  }

  get indestructible(): boolean {
    return this.material === "obsidian" && this.maxHp > 90;
  }

  hit(): boolean {
    if (this.indestructible) {
      this.crackPhase = 1;
      return false;
    }
    this.hp -= 1;
    this.crackPhase = 1;
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  update(dt: number): void {
    if (this.crackPhase > 0) this.crackPhase = Math.max(0, this.crackPhase - dt * 3);
    if (!this.alive) this.fadeOut = Math.max(0, this.fadeOut - dt * 6);
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.fadeOut <= 0) return;
    const { x, y, width, height } = this.bounds;
    const [top, bottom] = MATERIAL_FILLS[this.material];
    const damageRatio = 1 - this.hp / this.maxHp;

    ctx.save();
    ctx.globalAlpha = this.fadeOut;
    if (this.fadeOut < 1) {
      const scale = this.fadeOut;
      ctx.translate(x + width / 2, y + height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }

    ctx.beginPath();
    const r = 3;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fill();

    if (damageRatio > 0 && !this.indestructible) {
      ctx.fillStyle = `rgba(10, 10, 12, ${0.25 * damageRatio})`;
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(10, 10, 12, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (this.crackPhase > 0) {
      ctx.strokeStyle = `rgba(232, 228, 218, ${this.crackPhase})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + width * 0.3, y);
      ctx.lineTo(x + width * 0.5, y + height * 0.6);
      ctx.lineTo(x + width * 0.7, y + height);
      ctx.stroke();
    }

    ctx.restore();
  }
}
