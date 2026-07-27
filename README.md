<div align="center">

<img src="https://img.shields.io/badge/status-portfolio%20project-1a1a2e?style=for-the-badge&labelColor=0d0d17" alt="status"/>
<img src="https://img.shields.io/badge/type-project%20record-8a7fff?style=for-the-badge&labelColor=0d0d17" alt="type"/>
<img src="https://img.shields.io/badge/support-not%20maintained-6c6c8a?style=for-the-badge&labelColor=0d0d17" alt="support"/>

<br/><br/>

<svg width="640" height="150" viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#8a7fff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d0d17" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c9c3ff"/>
      <stop offset="100%" stop-color="#6c63d8"/>
    </linearGradient>
  </defs>
  <rect width="640" height="150" fill="#0d0d17"/>
  <circle cx="320" cy="60" r="140" fill="url(#glow)"/>
  <g opacity="0.9">
    <rect x="120" y="95" width="34" height="12" rx="3" fill="url(#glass)"/>
    <rect x="160" y="95" width="34" height="12" rx="3" fill="url(#glass)" opacity="0.8"/>
    <rect x="200" y="95" width="34" height="12" rx="3" fill="url(#glass)" opacity="0.6"/>
    <rect x="446" y="95" width="34" height="12" rx="3" fill="url(#glass)" opacity="0.6"/>
    <rect x="486" y="95" width="34" height="12" rx="3" fill="url(#glass)" opacity="0.8"/>
    <rect x="526" y="95" width="34" height="12" rx="3" fill="url(#glass)"/>
  </g>
  <circle cx="320" cy="60" r="7" fill="#e8e6ff"/>
  <text x="320" y="45" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#f2f1ff" letter-spacing="2">Obsidian Break</text>
  <text x="320" y="135" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#8f8ab8" letter-spacing="3">GLASS · GRAVITY · QUIET LIGHT</text>
</svg>

<br/>

**A brick-breaking game built for the Obsidian game center.**
*Ten chambers of real gravity physics, an AI that can guide you or play the room itself, and a fully synthesized world: no external art, no external audio.*

<br/>

<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript strict"/>
<img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19"/>
<img src="https://img.shields.io/badge/Vite-build-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/Canvas-2D%20renderer-FF6B6B?style=flat-square" alt="Canvas 2D"/>
<img src="https://img.shields.io/badge/Web%20Audio-synthesized%20SFX-2E9E5B?style=flat-square" alt="Web Audio"/>
<img src="https://img.shields.io/badge/assets-inline%20SVG%20only-orange?style=flat-square" alt="Inline SVG"/>

</div>

<br/>

## Contents

- [What this is](#what-this-is)
- [Stack](#stack)
- [Architecture](#architecture)
- [Data flow](#data-flow)
- [Controls](#controls)

<br/>

## What this is

Obsidian Break is a brick-breaking game: glass bricks, real gravity, quiet light. Ten authored chambers, each its own layout and pacing. The whole build is self-contained: every icon in the UI is inline SVG, and every sound effect is synthesized at runtime through the Web Audio API. There are no image files and no audio files anywhere in the bundle.

This is a public repository kept for personal portfolio reference, not an actively maintained or supported project. There's no contribution guide and no public-facing packaging here, just the project as it stands.

<br/>

## Stack

| Layer | Choice | Why it's here |
|---|---|---|
| **Logic** | TypeScript, strict mode | An OOP engine with zero React coupling, physics and state don't know a UI framework exists |
| **UI shell** | React 19 | Menus, HUD, overlays, anything that isn't the game itself |
| **Rendering** | Canvas 2D | Driven by a fixed-timestep loop, decoupled from React's render cycle |
| **Tooling** | Vite | Build and dev server |

<br/>

## Architecture

<svg width="720" height="230" viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#8a7fff"/>
    </marker>
    <marker id="arrowheadDim" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#6c6c8a"/>
    </marker>
  </defs>
  <rect width="720" height="230" fill="#0d0d17"/>

  <rect x="30" y="30" width="220" height="90" rx="10" fill="#14141f" stroke="#3a3a5c" stroke-width="1.5"/>
  <rect x="30" y="30" width="220" height="26" rx="10" fill="#1c1c2e" stroke="#4a4a72" stroke-width="1.5"/>
  <text x="42" y="47" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#e8e6ff">engine/</text>
  <text x="42" y="76" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">GameEngine · physics</text>
  <text x="42" y="92" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">collisions · state machine</text>
  <text x="42" y="108" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">no DOM, no React</text>

  <rect x="30" y="150" width="220" height="60" rx="10" fill="#14141f" stroke="#3a3a5c" stroke-width="1.5"/>
  <text x="42" y="172" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#e8e6ff">EventBus</text>
  <text x="42" y="192" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">typed pub/sub, one direction</text>

  <rect x="500" y="30" width="190" height="90" rx="10" fill="#14141f" stroke="#3a3a5c" stroke-width="1.5"/>
  <rect x="500" y="30" width="190" height="26" rx="10" fill="#1c1c2e" stroke="#4a4a72" stroke-width="1.5"/>
  <text x="512" y="47" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#e8e6ff">React shell</text>
  <text x="512" y="76" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">HUD · Overlay</text>
  <text x="512" y="92" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">MainMenu · GameScreen</text>
  <text x="512" y="108" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">screens / components</text>

  <rect x="290" y="150" width="180" height="60" rx="10" fill="#14141f" stroke="#3a3a5c" stroke-width="1.5"/>
  <text x="302" y="172" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#e8e6ff">useGameEngine</text>
  <text x="302" y="192" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">wires lifecycle into state</text>

  <path d="M250,75 H460 Q480,75 480,95 V150" stroke="#8a7fff" stroke-width="1.6" fill="none" marker-end="url(#arrowhead)"/>
  <text x="330" y="68" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2">score · lives · status</text>

  <path d="M250,180 H290" stroke="#8a7fff" stroke-width="1.6" fill="none" marker-end="url(#arrowhead)"/>
  <path d="M470,180 H500,595 V120" stroke="#6c6c8a" stroke-width="1.4" fill="none" stroke-dasharray="4 3" marker-end="url(#arrowheadDim)"/>

  <path d="M595,120 V60" stroke="#6c6c8a" stroke-width="1.4" fill="none" stroke-dasharray="4 3" marker-end="url(#arrowheadDim)"/>
  <text x="600" y="140" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#9c97c2" text-anchor="end">Canvas ctx</text>
</svg>

<sub><em>Solid arrows: engine → EventBus → React (discrete events only). Dashed: React renders via the Canvas 2D context, never by touching engine internals directly.</em></sub>

```
src/
  engine/                 Pure TypeScript, no DOM or React imports except Canvas types
    Vector2.ts             2D vector math
    types.ts               Shared engine types
    EventBus.ts             Typed pub/sub, engine → React
    Input.ts                Pointer, touch and keyboard normalization
    AudioEngine.ts           Synthesized SFX (Web Audio API)
    AIAssist.ts              Trajectory prediction for guide/autoplay
    ParticleSystem.ts        Brick shatter effects
    GameEngine.ts            Orchestrator: loop, physics, collisions, state machine
    entities/                Entity, Ball, Paddle, Brick, PowerUp
    levels/                  Level layout + 10 authored level definitions
  hooks/
    useGameEngine.ts         Wires GameEngine lifecycle into React state
  screens/                   MainMenu, LevelSelect, GameScreen
  components/                 HUD, Overlay, Logo, icons (all inline SVG), GrainOverlay
  lib/
    progress.ts              localStorage-backed level unlock persistence
  styles/                    Design tokens and global styles matching the Obsidian brand
```

<br/>

## Data flow

The boundary between engine and UI is deliberate and one-way in practice:

- The **engine** owns the loop, the physics, the collisions, the state machine. It never imports React and never touches the DOM, with one exception: the Canvas 2D context it renders into, and the `Input` class that listens for pointer, touch, and keyboard events.
- **React** never reaches into engine internals. It only listens for discrete events (score, lives, status, power-ups) emitted through the `EventBus`.

That separation is what keeps the 60fps game loop from ever triggering a React re-render on its own. React re-renders on meaningful state changes; the frame loop just paints.

<br/>

## Controls

| Input | Action |
|---|---|
| Drag / move pointer | Steer the paddle |
| Tap / click | Launch the ball |
| Arrow keys or `A` / `D` | Steer on desktop |
| `Space` | Launch |

Keyboard input takes control of the paddle until the pointer moves again, so the two input methods never fight each other.

The AI icon in the HUD cycles through three states:

**Guide** → a subtle marker shows where the ball will land
**Autoplay** → the AI plays the chamber for you
**Off** → no assist

<br/>

<div align="center">
<sub>Project record · public repository · kept for personal portfolio reference only</sub>
</div>
