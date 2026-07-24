import { Vector2 } from "./Vector2";
import { Ball } from "./entities/Ball";
import { Paddle } from "./entities/Paddle";
import { PowerUp } from "./entities/PowerUp";
import type { Brick } from "./entities/Brick";
import { ParticleSystem } from "./ParticleSystem";
import { AudioEngine } from "./AudioEngine";
import { AIAssist } from "./AIAssist";
import { InputController } from "./Input";
import { Level } from "./levels/Level";
import { LEVELS } from "./levels/levelData";
import type { AssistLevel, GameStatus, PowerUpKind } from "./types";
import { EventBus } from "./EventBus";

const BALL_RADIUS = 7;
const PADDLE_HEIGHT = 16;
const PADDLE_Y_OFFSET = 46;
const STARTING_LIVES = 3;
const MAX_BALL_SPEED = 900;
const MIN_BALL_SPEED_FACTOR = 0.85;

interface EngineEvents {
  status: GameStatus;
  score: number;
  lives: number;
  levelProgress: { broken: number; total: number };
  combo: number;
  powerup: { kind: PowerUpKind; active: boolean };
  toast: string;
  unlocked: number;
  [key: string]: unknown;
}

export class GameEngine {
  readonly events = new EventBus<EngineEvents>();

  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;

  private level!: Level;
  private levelIndex = 0;
  private paddle!: Paddle;
  private balls: Ball[] = [];
  private powerUps: PowerUp[] = [];
  private particles = new ParticleSystem();
  private audio = new AudioEngine();
  private ai = new AIAssist();
  private input = new InputController();
  private detachInput: (() => void) | null = null;

  private status: GameStatus = "idle";
  private score = 0;
  private lives = STARTING_LIVES;
  private combo = 0;
  private assist: AssistLevel = "guide";
  private rafId: number | null = null;
  private lastTime = 0;
  private activePowerUps = new Map<PowerUpKind, number>();
  private timeScale = 1;
  private highestUnlockedLevel = 0;
  private dragOffset = 0;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.detachInput = this.input.attach(canvas);
  }

  resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    const canvas = this.ctx.canvas;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.paddle) {
      this.paddle.setBounds(4, width - 4);
      this.paddle.position = new Vector2(width / 2, height - PADDLE_Y_OFFSET);
      this.paddle.targetX = width / 2;
    }
  }

  setAssist(level: AssistLevel): void {
    this.assist = level;
  }

  setHighestUnlocked(index: number): void {
    this.highestUnlockedLevel = Math.max(this.highestUnlockedLevel, index);
  }

  setAudioEnabled(enabled: boolean): void {
    this.audio.setEnabled(enabled);
  }

  getLevelMeta() {
    return LEVELS.map((l, i) => ({ ...l, unlocked: i <= this.highestUnlockedLevel }));
  }

  loadLevel(index: number): void {
    this.levelIndex = index;
    const def = LEVELS[index];
    this.level = new Level(def, this.width);
    this.paddle = new Paddle(
      new Vector2(this.width / 2, this.height - PADDLE_Y_OFFSET),
      def.paddleWidth,
      PADDLE_HEIGHT,
    );
    this.paddle.setBounds(4, this.width - 4);
    this.powerUps = [];
    this.activePowerUps.clear();
    this.particles.clear();
    this.combo = 0;
    this.spawnBallOnPaddle();
    this.status = "aiming";
    this.events.emit("status", this.status);
    this.events.emit("levelProgress", { broken: 0, total: this.level.totalBreakable });
  }

  private spawnBallOnPaddle(): void {
    const ball = new Ball(
      new Vector2(this.paddle.position.x, this.paddle.position.y - PADDLE_HEIGHT),
      BALL_RADIUS,
      new Vector2(0, 0),
    );
    this.balls = [ball];
  }

  start(): void {
    this.audio.resume();
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.events.emit("score", this.score);
    this.events.emit("lives", this.lives);
    this.loadLevel(this.levelIndex);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  restartLevel(): void {
    this.loadLevel(this.levelIndex);
  }

  nextLevel(): void {
    const next = Math.min(this.levelIndex + 1, LEVELS.length - 1);
    this.highestUnlockedLevel = Math.max(this.highestUnlockedLevel, next);
    this.loadLevel(next);
  }

  jumpToLevel(index: number): void {
    this.loadLevel(Math.min(index, this.highestUnlockedLevel));
  }

  togglePause(): void {
    if (this.status === "running") {
      this.status = "paused";
    } else if (this.status === "paused") {
      this.status = "running";
    }
    this.events.emit("status", this.status);
  }

  launch(): void {
    if (this.status !== "aiming") return;
    const ball = this.balls[0];
    const speed = this.level.definition.ballSpeed;
    const angle = -Math.PI / 2 + (Math.random() * 0.5 - 0.25);
    ball.velocity = Vector2.fromAngle(angle, speed);
    this.status = "running";
    this.events.emit("status", this.status);
  }

  destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.detachInput?.();
  }

  private loop = (time: number): void => {
    const dt = Math.min((time - this.lastTime) / 1000, 1 / 30) * this.timeScale;
    this.lastTime = time;

    if (this.status === "running" || this.status === "aiming") {
      this.update(dt);
    }
    this.render();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    this.updatePaddle(dt);

    if (this.status === "aiming") {
      const ball = this.balls[0];
      ball.position = new Vector2(this.paddle.position.x, this.paddle.position.y - PADDLE_HEIGHT - BALL_RADIUS);
      return;
    }

    const gravity = this.level.definition.gravity * (this.activePowerUps.has("slow") ? 0.4 : 1);
    const speedFactor = this.activePowerUps.has("slow") ? 0.55 : 1;

    for (const ball of this.balls) {
      ball.applyGravity(gravity, dt);
      const minSpeed = this.level.definition.ballSpeed * MIN_BALL_SPEED_FACTOR * speedFactor;
      const maxSpeed = MAX_BALL_SPEED * speedFactor;
      if (ball.speed > 0) {
        const clamped = ball.velocity.clampLength(minSpeed, maxSpeed);
        ball.velocity = clamped;
      }
      ball.update(dt);
      this.resolveWallCollisions(ball);
      this.resolvePaddleCollision(ball);
      this.resolveBrickCollisions(ball);
    }

    this.balls = this.balls.filter((b) => b.alive);
    this.updatePowerUps(dt);
    this.particles.update(dt, gravity);

    if (this.level.cleared) {
      this.onLevelCleared();
      return;
    }

    if (this.balls.length === 0) {
      this.onLifeLost();
      return;
    }
  }

  private updatePaddle(dt: number): void {
    const freshDown = this.input.consumeFreshPointerDown();
    if (freshDown) {
      // Touch: grab the paddle wherever it currently is and keep that
      // same relative offset to the finger for the whole drag, so the
      // paddle follows the drag instead of jumping to the touch point.
      // Mouse: track the cursor directly, which is the expected desktop feel.
      this.dragOffset = freshDown.isTouch ? this.paddle.position.x - freshDown.x : 0;
    }

    const keyboardX = this.input.stepKeyboard(this.paddle.position.x, dt, this.width);
    if (keyboardX !== null) {
      this.paddle.setTarget(keyboardX);
    } else if (this.input.pointerActive && this.input.pointerX !== null) {
      this.paddle.setTarget(this.input.pointerX + this.dragOffset);
    }

    if (this.assist === "auto") {
      const target = this.ai.nearestBall(this.balls, this.paddle.position);
      if (target) {
        const predicted = this.ai.predictLandingX(
          target,
          this.paddle.position.y,
          this.width,
          BALL_RADIUS,
        );
        this.paddle.setTarget(this.ai.humanize(predicted, performance.now() / 500));
      }
    }

    this.paddle.update(dt);

    if (this.status === "aiming" && this.input.consumeLaunch()) {
      this.launch();
    } else {
      this.input.consumeLaunch();
    }
  }

  private resolveWallCollisions(ball: Ball): void {
    if (ball.position.x - ball.radius < 0) {
      ball.position.x = ball.radius;
      ball.velocity = new Vector2(Math.abs(ball.velocity.x), ball.velocity.y);
      this.audio.wallHit();
    } else if (ball.position.x + ball.radius > this.width) {
      ball.position.x = this.width - ball.radius;
      ball.velocity = new Vector2(-Math.abs(ball.velocity.x), ball.velocity.y);
      this.audio.wallHit();
    }
    if (ball.position.y - ball.radius < 0) {
      ball.position.y = ball.radius;
      ball.velocity = new Vector2(ball.velocity.x, Math.abs(ball.velocity.y));
      this.audio.wallHit();
    }

    if (ball.position.y - ball.radius > this.height) {
      if (this.paddle.shieldCharges > 0) {
        this.paddle.shieldCharges -= 1;
        ball.position.y = this.height - ball.radius;
        ball.velocity = new Vector2(ball.velocity.x, -Math.abs(ball.velocity.y));
      } else {
        ball.alive = false;
      }
    }
  }

  private resolvePaddleCollision(ball: Ball): void {
    const pb = this.paddle.bounds;
    if (
      ball.position.y + ball.radius >= pb.y &&
      ball.position.y - ball.radius <= pb.y + pb.height &&
      ball.position.x + ball.radius >= pb.x &&
      ball.position.x - ball.radius <= pb.x + pb.width &&
      ball.velocity.y > 0
    ) {
      const factor = Math.max(-1, Math.min(1, this.paddle.hitFactor(ball.position.x)));
      const angle = -Math.PI / 2 + factor * (Math.PI / 3);
      const speed = Math.max(ball.speed, this.level.definition.ballSpeed);
      ball.velocity = Vector2.fromAngle(angle, speed);
      ball.position.y = pb.y - ball.radius;
      this.combo = 0;
      this.audio.paddleHit();
    }
  }

  private resolveBrickCollisions(ball: Ball): void {
    for (const brick of this.level.bricks) {
      if (!brick.alive) continue;
      const bb = brick.bounds;
      const closestX = Math.max(bb.x, Math.min(ball.position.x, bb.x + bb.width));
      const closestY = Math.max(bb.y, Math.min(ball.position.y, bb.y + bb.height));
      const dx = ball.position.x - closestX;
      const dy = ball.position.y - closestY;
      const distSq = dx * dx + dy * dy;

      if (distSq <= ball.radius * ball.radius) {
        const overlapX = Math.min(
          Math.abs(ball.position.x - bb.x),
          Math.abs(ball.position.x - (bb.x + bb.width)),
        );
        const overlapY = Math.min(
          Math.abs(ball.position.y - bb.y),
          Math.abs(ball.position.y - (bb.y + bb.height)),
        );
        const normal = overlapX < overlapY ? new Vector2(Math.sign(dx) || 1, 0) : new Vector2(0, Math.sign(dy) || 1);
        ball.velocity = ball.velocity.reflect(normal);

        const broke = brick.hit();
        if (broke) {
          this.onBrickBroken(brick);
        } else if (!brick.indestructible) {
          this.score += 4;
          this.audio.brickHit();
        } else {
          this.audio.brickHit(0.6);
        }
        break;
      }
    }
  }

  private onBrickBroken(brick: Brick): void {
    this.combo += 1;
    const comboBonus = Math.min(this.combo, 8) * 2;
    this.score += 10 + comboBonus;
    this.events.emit("score", this.score);
    this.events.emit("combo", this.combo);

    const [, colorTo] = [this.level.definition.accentFrom, this.level.definition.accentTo];
    this.particles.burst(brick.position, brick.material === "aurora" ? colorTo : "#e8e4da", 14);
    this.audio.brickBreak(1 + Math.min(this.combo, 6) * 0.05);

    const broken = this.level.definition.bricks.length - this.level.remainingBreakable;
    this.events.emit("levelProgress", { broken, total: this.level.totalBreakable });

    if (brick.material === "aurora" || Math.random() < 0.12) {
      this.spawnPowerUp(brick.position.clone());
    }
  }

  private spawnPowerUp(position: Vector2): void {
    const kinds: PowerUpKind[] = ["widen", "slow", "multiball", "shield", "laser"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    this.powerUps.push(new PowerUp(position, kind));
  }

  private updatePowerUps(dt: number): void {
    for (const [kind, remaining] of this.activePowerUps) {
      const next = remaining - dt;
      if (next <= 0) {
        this.activePowerUps.delete(kind);
        this.events.emit("powerup", { kind, active: false });
      } else {
        this.activePowerUps.set(kind, next);
      }
    }

    for (const p of this.powerUps) {
      p.update(dt);
      const pb = this.paddle.bounds;
      if (
        p.position.y + 13 >= pb.y &&
        p.position.y - 13 <= pb.y + pb.height &&
        p.position.x >= pb.x &&
        p.position.x <= pb.x + pb.width
      ) {
        this.applyPowerUp(p.kind);
        p.alive = false;
      } else if (p.position.y - 13 > this.height) {
        p.alive = false;
      }
    }
    this.powerUps = this.powerUps.filter((p) => p.alive);
  }

  private applyPowerUp(kind: PowerUpKind): void {
    this.audio.powerUp();
    this.events.emit("toast", kind);
    this.events.emit("powerup", { kind, active: true });

    switch (kind) {
      case "widen":
        this.paddle.applyWiden(9);
        this.activePowerUps.set(kind, 9);
        break;
      case "slow":
        this.activePowerUps.set(kind, 8);
        break;
      case "shield":
        this.paddle.shieldCharges += 1;
        this.activePowerUps.set(kind, 20);
        break;
      case "multiball": {
        const source = this.balls[0];
        if (source) {
          for (const spread of [-0.35, 0.35]) {
            const clone = new Ball(source.position.clone(), BALL_RADIUS, source.velocity.reflect(new Vector2(Math.cos(spread), Math.sin(spread))));
            clone.velocity = Vector2.fromAngle(Math.atan2(source.velocity.y, source.velocity.x) + spread, source.speed);
            this.balls.push(clone);
          }
        }
        break;
      }
      case "laser":
        this.activePowerUps.set(kind, 10);
        break;
    }
  }

  private onLifeLost(): void {
    this.lives -= 1;
    this.events.emit("lives", this.lives);
    this.audio.lifeLost();
    if (this.lives <= 0) {
      this.status = "game-over";
      this.events.emit("status", this.status);
      return;
    }
    this.status = "life-lost";
    this.events.emit("status", this.status);
    setTimeout(() => {
      if (this.status !== "life-lost") return;
      this.spawnBallOnPaddle();
      this.status = "aiming";
      this.events.emit("status", this.status);
    }, 900);
  }

  private onLevelCleared(): void {
    this.status = "level-cleared";
    this.audio.levelClear();
    this.events.emit("status", this.status);
    this.highestUnlockedLevel = Math.max(this.highestUnlockedLevel, this.levelIndex + 1);
    this.events.emit("unlocked", this.highestUnlockedLevel);
    if (this.levelIndex >= LEVELS.length - 1) {
      setTimeout(() => {
        this.status = "victory";
        this.events.emit("status", this.status);
      }, 900);
    }
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const bg = ctx.createLinearGradient(0, 0, 0, this.height);
    bg.addColorStop(0, "#0c0e12");
    bg.addColorStop(1, "#0a0a0c");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.width, this.height);

    this.renderAimGuide(ctx);

    for (const brick of this.level.bricks) {
      brick.update(1 / 60);
      brick.render(ctx);
    }
    this.level.bricks = this.level.bricks.filter((b) => b.alive || b.fadeOut > 0);

    this.particles.render(ctx);

    for (const p of this.powerUps) p.render(ctx);

    this.paddle.render(ctx);
    for (const ball of this.balls) ball.render(ctx);
  }

  private renderAimGuide(ctx: CanvasRenderingContext2D): void {
    if (this.assist === "off") return;
    if (this.status !== "running" && this.status !== "aiming") return;
    const ball = this.balls[0];
    if (!ball) return;

    if (this.status === "aiming") {
      ctx.save();
      ctx.strokeStyle = "rgba(232, 228, 218, 0.18)";
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.moveTo(ball.position.x, ball.position.y);
      ctx.lineTo(ball.position.x, 0);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (this.assist === "guide" && ball.velocity.y > 0) {
      const landingX = this.ai.predictLandingX(ball, this.paddle.position.y, this.width, BALL_RADIUS);
      ctx.save();
      ctx.beginPath();
      ctx.arc(landingX, this.paddle.position.y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(232, 228, 218, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  getSnapshot() {
    return {
      status: this.status,
      score: this.score,
      lives: this.lives,
      levelIndex: this.levelIndex,
      levelName: this.level?.definition.name ?? "",
    };
  }
}
