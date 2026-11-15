// Energy mode toggle. The initial mode is set before first paint by the inline
// script in Base.astro (URL param, then saved choice, then Pro). This file
// handles clicks: only a click is remembered, a link is not.

import { track } from './analytics';

type Mode = 'pro' | 'fire';
const KEY = 'rab-mode';
const root = document.documentElement;

function syncButtons(mode: Mode): void {
  document.querySelectorAll<HTMLElement>('.toggle [data-set-mode]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.setMode === mode));
  });
}

function setMode(mode: Mode, source: string): void {
  const changed = root.dataset.mode !== mode;
  root.dataset.mode = mode;
  syncButtons(mode);

  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // Storage can be blocked; the mode still applies for this visit.
  }

  // Keep the address bar in step, so a copied link opens in the same mode.
  const url = new URL(location.href);
  if (mode === 'fire') url.searchParams.set('mode', 'fire');
  else url.searchParams.delete('mode');
  history.replaceState(null, '', url);

  if (changed) track('mode_toggle', { to: mode, source });
}

syncButtons(root.dataset.mode === 'fire' ? 'fire' : 'pro');

// The hidden photo is lazy so it never delays first paint. Once the page has
// loaded, fetch it in the background so the first switch is instant.
window.addEventListener('load', () => {
  document.querySelectorAll<HTMLImageElement>('picture[data-show] img[loading="lazy"]').forEach((img) => {
    img.loading = 'eager';
  });
});

document.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLElement>('[data-set-mode]');
  if (!button) return;
  const mode = button.dataset.setMode === 'fire' ? 'fire' : 'pro';
  setMode(mode, button.dataset.source ?? 'unknown');
});
