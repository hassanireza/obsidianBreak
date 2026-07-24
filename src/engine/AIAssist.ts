import type { Ball } from "./entities/Ball";
import { Vector2 } from "./Vector2";

/**
 * Predicts where the ball will cross the paddle's y-plane by
 * simulating straight-line travel and reflecting the prediction off
 * the side walls, without running the full physics step. Used both
 * to draw the "guide" landing marker and to drive the paddle
 * directly in "auto" assist mode.
 */
export class AIAssist {
  predictLandingX(ball: Ball, paddleY: number, arenaWidth: number, ballRadius: number): number {
    if (ball.velocity.y <= 0) {
      // Ball is heading upward: assume it will eventually fall back down
      // through the same x, which keeps the guide marker stable rather
      // than jumping to the opposite wall.
      return this.clampToWalls(ball.position.x, arenaWidth, ballRadius);
    }

    const distanceY = paddleY - ball.position.y;
    const timeToReach = distanceY / ball.velocity.y;
    let x = ball.position.x + ball.velocity.x * timeToReach;

    const span = arenaWidth - ballRadius * 2;
    if (span <= 0) return arenaWidth / 2;

    // Reflect the predicted x back into range for every wall bounce it
    // would take along the way (triangle-wave reflection).
    let relative = (x - ballRadius) % (span * 2);
    if (relative < 0) relative += span * 2;
    x = relative > span ? span * 2 - relative : relative;
    return x + ballRadius;
  }

  private clampToWalls(x: number, arenaWidth: number, radius: number): number {
    return Math.min(Math.max(x, radius), arenaWidth - radius);
  }

  /** Returns a slightly imperfect target so "auto" mode looks alive, not robotic. */
  humanize(targetX: number, jitterSeed: number): number {
    const wobble = Math.sin(jitterSeed * 1.7) * 6;
    return targetX + wobble;
  }

  nearestBall(balls: Ball[], paddlePos: Vector2): Ball | null {
    let best: Ball | null = null;
    let bestScore = Infinity;
    for (const b of balls) {
      if (!b.alive) continue;
      const score = b.position.y - paddlePos.y < 0 ? Math.abs(b.position.x - paddlePos.x) + (paddlePos.y - b.position.y) : Infinity;
      if (score < bestScore) {
        bestScore = score;
        best = b;
      }
    }
    return best ?? balls.find((b) => b.alive) ?? null;
  }
}
