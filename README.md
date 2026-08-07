# Asadbek — Flutter Developer Portfolio (3D)

Personal portfolio website for **Asadbek**, a 16-year-old Flutter developer from Tashkent, Uzbekistan.

Live: [asadbekabdulboqiyev.github.io](https://asadbekabdulboqiyev.github.io)

---

## What's inside

A single-page portfolio with a **full 3D WebGL experience** — not particles, real 3D objects.
There are **two Three.js scenes** running at once:

### Scene A — ambient background world
As you scroll, the camera flies through a 3D world where every section has its own object:

| Section  | 3D object |
|----------|-----------|
| Hero     | Iridescent torus knot (MeshPhysicalMaterial + clearcoat + iridescence) with wireframe shell and 3 orbiting satellites |
| About    | Floating platonic solids — metal dodecahedron, crystal icosahedron, dark octahedron, green torus |
| Contact  | Pulsing tetrahedron constellation with orbiting icosahedron and glowing halo ring |

### Scene B — interactive 12-project 3D carousel

The Projects section is a **real 3D carousel**: all 12 projects are placed on a ring as
individual 3D objects, each with a **unique shape** matching its product:

| Shape | Project |
|-------|---------|
| Cube      | Nesto UZ (marketplace) |
| Octahedron| Hisob (finance) |
| Ring      | Bloom & Petal (florist e-commerce) |
| Tetrahedron | Zer Language IDE |
| Sphere    | Tinchlik (wellness) |
| Dodecahedron | Mini Metro Runner (game) |
| Icosahedron | Weather App |
| Coin (cylinder) | NexPay Business (fintech) |
| Torus knot | Social Hub |
| Store (box) | E-Commerce App |
| Capsule   | FreshLink (marketplace) |
| Cone      | Day0 Bot (AI Telegram) |

**Interactions:**
- **Drag / swipe** to spin the carousel (with inertia and idle auto-rotation)
- **Click / tap** any object or its floating label to select it
- Selecting updates a live detail panel (description, tags, GitHub link)
- **Prev / Next** buttons and a **Spin it** button in the detail panel
- A pulsing **selection ring** highlights the active object; hover glows in the accent color
- Auto-cycles through projects every 3.2 s **until the first manual pick**
- Rendering pauses when the carousel scrolls off-screen (IntersectionObserver)

## Motion system

- **Scroll-driven camera** — flies along the Z axis through the objects (smoothstep eased)
- **Mouse parallax** — camera drifts and looks toward the pointer
- **Velocity kick** — FOV widens and objects spin faster while scrolling fast
- **Intro** — camera dollies in and the torus knot scales up on load
- **UnrealBloom** post-processing for a subtle cinematic glow
- **DOM motion** — magnetic buttons, scroll parallax on hero text, scroll progress bar, scrollspy nav, count-up stats, animated skill bars, skills marquee, film grain + vignette overlays

## Tech

- **Three.js r170** loaded from jsDelivr via an `importmap` (ES modules, no build step)
- RoomEnvironment for studio IBL reflections, ACESFilmic tone mapping
- Raycaster-based picking for the carousel, DOM labels projected from 3D world positions
- Zero npm, zero bundler — still a single `index.html`, deployable anywhere
- Fonts: Syne + DM Mono + Inter (Google Fonts)

## Resilience & accessibility

- **Fallback** — if the CDN or WebGL is unavailable, a watchdog adds `.no-3d` and the page renders as a clean static portfolio with a 12-card project grid
- **`prefers-reduced-motion`** — renders a single static frame, disables all DOM animation
- **Mobile** — objects are repositioned/scaled to stay on screen, carousel radius shrinks, bloom is reduced, pixel ratio capped at 1.6
- **Performance** — DPR capped at 2, rendering paused when the tab is hidden or the carousel is off-screen, only `transform`/`opacity` animated in DOM

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

### Update your projects

The carousel data is the `PROJECTS` array in the module script (search for `const PROJECTS`):

```js
{ name:'Nesto UZ', url:'https://github.com/...', desc:'...', tags:['Flutter','AI'], geo:'cube' }
```

- `geo` picks the 3D shape — options: `cube, store, octa, ring, tetra, sphere, dode, ico, coin, knot, capsule, cone`
- The static fallback grid is `.proj-fallback a` blocks in the `#projects` section

### Update your info

| What | Where in HTML |
|------|--------------|
| Name | `<div class="logo">`, `<footer>`, hero title |
| Job title / description | `.hero-title`, `.hero-sub` |
| Telegram link | `href="https://t.me/tmeAsadbek"` |
| GitHub link | all `href="https://github.com/asadbekabdulboqiyev"` |
| Projects | `PROJECTS` array + `.proj-fallback` blocks |
| Skills | `.skill-row` blocks in `#about` section |
| Stats | `.stat-box` blocks |
| Marquee strip | `.marquee-track` spans |

## Deployment

This repo is a GitHub Pages site — push to `main` and it goes live at
`https://asadbekabdulboqiyev.github.io` (Settings → Pages → Deploy from branch, `/` root).

---

Built by Asadbek · 2026
