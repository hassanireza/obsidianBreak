/**
 * Normalizes mouse, touch and keyboard input into a single pointerX
 * value in canvas-space, plus a launch/pause intent flag. Keeping
 * this isolated from GameEngine means the engine never touches the
 * DOM directly.
 */
export class InputController {
  pointerX: number | null = null;
  pointerActive = false;
  launchRequested = false;
  private keyLeft = false;
  private keyRight = false;
  private keyboardX: number | null = null;
  private freshPointerDown = false;
  private lastPointerIsTouch = false;

  attach(canvas: HTMLCanvasElement): () => void {
    const toCanvasX = (clientX: number): number => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width / (window.devicePixelRatio || 1);
      return (clientX - rect.left) * scaleX;
    };

    const onPointerMove = (e: PointerEvent) => {
      this.pointerX = toCanvasX(e.clientX);
      this.pointerActive = true;
    };
    const onPointerDown = (e: PointerEvent) => {
      // Keep receiving move events for this pointer even if the finger
      // drifts outside the canvas bounds mid-drag, which is what made
      // the right edge feel "locked" on mobile: without capture, fast
      // drags near the screen edge lost their move events entirely.
      canvas.setPointerCapture?.(e.pointerId);
      this.pointerX = toCanvasX(e.clientX);
      this.pointerActive = true;
      this.launchRequested = true;
      this.freshPointerDown = true;
      this.lastPointerIsTouch = e.pointerType === "touch" || e.pointerType === "pen";
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        this.keyLeft = true;
        this.pointerActive = false;
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        this.keyRight = true;
        this.pointerActive = false;
      }
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

  /**
   * Returns the touch/mouse-down x and pointer kind exactly once per
   * press, so the engine can decide how to grab the paddle: touch
   * drags are relative to where the finger first lands (so the
   * paddle follows finger movement instead of teleporting under it),
   * while mouse stays absolute since desktop users expect the paddle
   * to track the cursor directly.
   */
  consumeFreshPointerDown(): { x: number; isTouch: boolean } | null {
    if (!this.freshPointerDown) return null;
    this.freshPointerDown = false;
    return { x: this.pointerX ?? 0, isTouch: this.lastPointerIsTouch };
  }
}
