# Ring a Bell

Source for [ringabell.co.il](https://ringabell.co.il), the personal site of Helly Rachel Bell, Senior Product Manager specializing in EdTech and Workforce Management.

The site has two modes with identical facts: **Pro** (default) and **On Fire** (same facts, more playful wording). Add `?mode=fire` to a link to open it in On Fire.

## Run it

```bash
npm install
npm run dev
```

`npm run build` checks the facts and builds to `dist/`.

## Edit the copy

All text lives in `src/content/`:

| File or folder | What it holds |
|---|---|
| `site.yaml` | Name, page title and description, navigation, toggle labels, photo alt text |
| `sections/` | Hero, section labels, contact heading |
| `cards/` | The "What I build" cards |
| `achievements/` | Facts and numbers; cards reference them as chips |
| `offers/` | The "What I offer" columns |
| `microcopy.yaml` | Pop-up, form, booking link, 404 and thanks pages |

A text field is either one string, used in both modes, or a pair:

```yaml
heading:
  pro: Sounds like a match? Let's talk.
  fire: Ring ring. Who is it?
```

Wrap words in `==double equals==` for a yellow highlight.

## Built with

Astro, plain CSS, Netlify (hosting and forms).
