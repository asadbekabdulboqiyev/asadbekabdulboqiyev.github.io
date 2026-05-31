# Asadbek — Flutter Developer Portfolio

Personal portfolio website for **Asadbek**, a 16-year-old Flutter developer from Tashkent, Uzbekistan.

## Live Preview

> Deploy to [Vercel](https://vercel.com), [Netlify](https://netlify.com), or [GitHub Pages](https://pages.github.com) for free.

---

## Tech Stack

- Pure **HTML + CSS + Vanilla JS** — zero dependencies, zero build step
- Fonts: [Syne](https://fonts.google.com/specimen/Syne) (display) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) + Inter — loaded from Google Fonts
- No frameworks, no npm, no bundler

---

## Features

- Custom animated cursor with ring follower
- Scroll-triggered reveal animations (IntersectionObserver)
- Sticky blur nav with underline hover effect
- Live "available" pulse indicator
- Responsive layout (mobile + desktop)
- Grain texture overlay for depth
- Fully dark theme with CSS variables

---

## File Structure

```
portfolio/
└── index.html   ← everything is here (single file)
```

---

## Customization

All design tokens are in `:root` at the top of `<style>`:

```css
:root {
  --accent: #97C459;   /* green — change to your color */
  --bg:     #080808;   /* main background */
  --text:   #f2ede4;   /* body text */
}
```

### Update your info

| What | Where in HTML |
|------|--------------|
| Name | `<div class="logo">`, `<footer>`, hero title |
| Job title / description | `.hero-title`, `.hero-sub` |
| Telegram link | `href="https://t.me/tmeAsadbek"` |
| GitHub link | all `href="https://github.com/c4wnh7vr8k-cell"` |
| Projects | `.project-card` blocks in `#projects` section |
| Skills | `.skill-row` blocks in `#about` section |
| Stats | `.stat-box` blocks |

---

## Deployment

### GitHub Pages (free)

```bash
git init
git add index.html
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

Then go to **Settings → Pages → Source: main / root** and hit Save.  
Your site will be live at `https://YOUR_USERNAME.github.io/portfolio`

### Vercel (recommended — faster)

```bash
npm i -g vercel
vercel --prod
```

Or just drag-and-drop `index.html` at [vercel.com/new](https://vercel.com/new).

---

## What Makes This Different From AI Templates

- **Syne** typeface instead of Inter/Space Grotesk
- Asymmetric hero with bottom-anchored metadata row
- Custom cursor (not in any template)
- Section numbers `01 / 02 / 03` — editorial feel
- Project cards use `001 / 002` index instead of generic titles
- `AVAILABLE` badge injected via CSS `::before` — no extra HTML
- Grain overlay via inline SVG filter — no image files

---

## License

Do whatever you want with it. No attribution required.  
Built by Asadbek · 2025
