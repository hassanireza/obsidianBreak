# Obsidian Break

Internal project record. Private game built for the Obsidian game center.

A brick-breaking game of glass, gravity and quiet light. Ten chambers. Real gravity physics. An AI assist that predicts where the ball will land, or can play a chamber on its own. No external art or audio assets: every icon is inline SVG, and every sound is synthesized at runtime with the Web Audio API.

## Stack

- TypeScript, strict mode, OOP engine with zero React coupling
- React 19 for the UI shell (menus, HUD, overlays)
- Canvas 2D for rendering, driven by a fixed-timestep game loop
- Vite for build and dev server

## Architecture

```
src/
  engine/                 Pure TypeScript, no DOM or React imports except Canvas types
    Vector2.ts            2D vector math
    types.ts              Shared engine types
    EventBus.ts           Typed pub/sub, engine -> React
    Input.ts              Pointer, touch and keyboard normalization
    AudioEngine.ts         Synthesized SFX (Web Audio API)
    AIAssist.ts            Trajectory prediction for guide/autoplay
    ParticleSystem.ts       Brick shatter effects
    GameEngine.ts           Orchestrator: loop, physics, collisions, state machine
    entities/               Entity, Ball, Paddle, Brick, PowerUp
    levels/                 Level layout + 10 authored level definitions
  hooks/
    useGameEngine.ts        Wires GameEngine lifecycle into React state
  screens/                  MainMenu, LevelSelect, GameScreen
  components/                HUD, Overlay, Logo, icons (all inline SVG), GrainOverlay
  lib/
    progress.ts             localStorage-backed level unlock persistence
  styles/                   Design tokens and global styles matching the Obsidian brand
```

The engine never touches the DOM directly except through the canvas 2D context and the `Input` class. React never reaches into engine internals; it only listens to discrete events (score, lives, status, power-ups) through the `EventBus`, so the 60fps game loop never triggers a React re-render on its own.

## Controls

- Drag or move the pointer to steer the paddle
- Tap or click to launch the ball
- Arrow keys or A/D also work on desktop, Space to launch
- Using the keyboard hands control to the keyboard until the pointer moves again, so the two inputs never fight for the paddle
- The AI icon in the HUD cycles between Guide (a subtle landing marker), Autoplay (the AI plays for you), and Off

## Commands

```bash
npm install
npm run dev         # local dev server
npm run typecheck   # tsc -b --noEmit
npm run build        # outputs to dist/
```

## Deploy

`.github/workflows/deploy.yml` type-checks, builds, and publishes `dist/` to GitHub Pages on push to `main`. The Vite base path is set from the repository name automatically; override with the `VITE_BASE_PATH` env var if the repo is renamed.
