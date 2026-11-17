# ringabell

Public repo for ringabell.co.il: an Astro static site on Netlify.

## Hard rules
- This repo is PUBLIC. Never add email addresses, client names or
  descriptions, private notes, planning docs, or templates.
- Facts (numbers, dates, companies) come from the owner's private source
  of truth. Never invent, round, or change a number. If a fact is
  missing, stop and ask.
- Facts are identical in both modes. `npm run check:facts` must pass.
- The visual design is decided. Do not add colors, fonts, shadows, or
  sections without the owner's approval.
- The AI training offer stays generic (no topics, audiences, formats,
  or numbers) until the owner confirms the details.

## Content
- All copy lives in `src/content/`. Components contain no strings.
- A copy field is a string (same in both modes) or `{ pro, fire }`.
  `==text==` renders as a yellow highlight.
- Numbers live only in `achievements/*.yaml` under `facts`. Cards show
  them as chips by reference (`achievement-id/fact-id`).
- Humor targets situations and clichés, never people or employers.

## Modes
- Keys `pro` (default) and `fire`; labels "Pro" and "On Fire".
- `data-mode` on `<html>`; order: `?mode=` param, localStorage, `pro`.
- Only a click is saved, never a link. Pro content must read without JS.
- Motion is On Fire only and off under `prefers-reduced-motion`.

## Styles
- Plain CSS; tokens in `src/styles/tokens.css`.
- `--yellow`, `--teal`, `--orange` are never text colors.
- No blurred shadows. Every interactive element keeps a visible focus ring.

## SEO and AI agents
- Keep one `<h1>`, real headings, and the JSON-LD in `Base.astro`.
- `/llms.txt` is generated from the content files; do not hand-edit output.
- `robots.txt` allows all crawlers.

## Forms and analytics
- The contact form uses Netlify Forms; the notification address is set in
  the Netlify dashboard only.
- Analytics go through `track()` in `src/scripts/analytics.ts`. The
  provider is Umami Cloud, enabled with the `PUBLIC_UMAMI_WEBSITE_ID` env
  variable and counted only on the production domain.

## Commands
- `npm run dev`, `npm run build`, `npm run check:facts`, `npm run preview`
