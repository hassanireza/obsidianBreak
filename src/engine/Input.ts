/**
 * Normalizes mouse, touch and keyboard input into a single pointerX
 * value in canvas-space, plus a launch/pause intent flag. Keeping
 * this isolated from GameEngine means the engine never touches the
 * DOM directly.
 */
export class InputController {
  pointerX: number | null = null;
  launchRequested = false;
  private keyLeft = false;
  private keyRight = false;
  private keyboardX: number | null = null;

  attach(canvas: HTMLCanvasElement): () => void {
    const toCanvasX = (clientX: number): number => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width / (window.devicePixelRatio || 1);
      return (clientX - rect.left) * scaleX;
    };

    const onPointerMove = (e: PointerEvent) => {
      this.pointerX = toCanvasX(e.clientX);
    };
    const onPointerDown = (e: PointerEvent) => {
      this.pointerX = toCanvasX(e.clientX);
      this.launchRequested = true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") this.keyLeft = true;
      if (e.key === "ArrowRight" || e.key === "d") this.keyRight = true;
      if (e.key === " ") this.launchRequested = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") this.keyLeft = false;
      if (e.key === "ArrowRight" || e.key === "d") this.keyRight = false;
    };

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }

  /** Steps a virtual keyboard cursor and returns it, or null if keyboard is idle. */
  stepKeyboard(currentX: number, dt: number, arenaWidth: number): number | null {
    if (!this.keyLeft && !this.keyRight) {
      this.keyboardX = null;
      return null;
    }
    const base = this.keyboardX ?? currentX;
    const speed = 620;
    let next = base;
    if (this.keyLeft) next -= speed * dt;
    if (this.keyRight) next += speed * dt;
    this.keyboardX = Math.min(Math.max(next, 0), arenaWidth);
    return this.keyboardX;
  }

  consumeLaunch(): boolean {
    if (this.launchRequested) {
      this.launchRequested = false;
      return true;
    }
    return false;
  }
}
