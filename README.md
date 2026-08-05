# Asadbek — Flutter Developer Portfolio (3D)

Personal portfolio website for **Asadbek**, a 16-year-old Flutter developer from Tashkent, Uzbekistan.

Live: [asadbekabdulboqiyev.github.io](https://asadbekabdulboqiyev.github.io)

---

## What's inside

A single-page portfolio with a **full 3D WebGL experience** — not particles, real 3D objects.
As you scroll, the camera flies through a 3D world where every section has its own object:

| Section  | 3D object |
|----------|-----------|
| Hero     | Iridescent torus knot (MeshPhysicalMaterial + clearcoat + iridescence) with wireframe shell and 3 orbiting satellites |
| About    | Floating platonic solids — metal dodecahedron, crystal icosahedron, dark octahedron, green torus |
| Projects | Geodesic wireframe globe with 2 orbital rings + **12 instanced metal cubes** (one per project) |
| Contact  | Pulsing tetrahedron constellation with orbiting icosahedron and glowing halo ring |

## Motion system

- **Scroll-driven camera** — flies along the Z axis through the objects (smoothstep eased)
- **Mouse parallax** — camera drifts and looks toward the pointer
- **Velocity kick** — FOV widens and objects spin faster while scrolling fast
- **Intro** — camera dollies in and the torus knot scales up on load
- **UnrealBloom** post-processing for a subtle cinematic glow
- **DOM motion** — 3D tilt on project cards, magnetic buttons, scroll parallax on hero text, scroll progress bar, film grain + vignette overlays

## Tech

- **Three.js r170** loaded from jsDelivr via an `importmap` (ES modules, no build step)
- RoomEnvironment for studio IBL reflections, ACESFilmic tone mapping
- Zero npm, zero bundler — still a single `index.html`, deployable anywhere
- Fonts: Syne + DM Mono + Inter (Google Fonts)

## Resilience & accessibility

- **Fallback** — if the CDN or WebGL is unavailable, a watchdog adds `.no-3d` and the page renders as a clean static portfolio
- **`prefers-reduced-motion`** — renders a single static frame, disables all DOM animation
- **Mobile** — objects are repositioned/scaled to stay on screen, bloom is reduced, pixel ratio capped at 1.6
- **Performance** — DPR capped at 2, rendering paused when the tab is hidden, only `transform`/`opacity` animated in DOM

## File structure

```
portfolio/
└── index.html   ← everything is here (single file)
```

## Customization

Design tokens live in `:root` at the top of `<style>`:

```css
:root {
  --accent: #97C459;   /* green — change to your color */
  --bg:     #080808;   /* main background */
  --text:   #f2ede4;   /* body text */
}
```

3D scene parameters (object positions, materials, camera path) are in the
`<script type="module">` block — search for `boot3D()`.

### Update your info

| What | Where in HTML |
|------|--------------|
| Name | `<div class="logo">`, `<footer>`, hero title |
| Job title / description | `.hero-title`, `.hero-sub` |
| Telegram link | `href="https://t.me/tmeAsadbek"` |
| GitHub link | all `href="https://github.com/asadbekabdulboqiyev"` |
| Projects | `.project-card` blocks in `#projects` section |
| Skills | `.skill-row` blocks in `#about` section |
| Stats | `.stat-box` blocks |

## Deployment

This repo is a GitHub Pages site — push to `main` and it goes live at
`https://asadbekabdulboqiyev.github.io` (Settings → Pages → Deploy from branch, `/` root).

---

Built by Asadbek · 2026
