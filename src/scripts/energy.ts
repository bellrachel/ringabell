// energy.exe pop-up: shown once per session when the visitor has scrolled 75%
// of the page. Non-modal: it never takes focus and never blocks the page.

import { track } from './analytics';

const KEY = 'rab-energy';
const THRESHOLD = 0.75;
const popup = document.querySelector<HTMLElement>('[data-energy]');

function alreadyShown(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function isTyping(): boolean {
  return !!document.activeElement?.closest('input, select, textarea');
}

if (popup && !alreadyShown()) {
  const open = () => {
    popup.hidden = false;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      // Without storage the pop-up may show again on the next page load.
    }
    track('energy_open', { mode: document.documentElement.dataset.mode ?? 'pro' });
  };

  const onScroll = () => {
    const el = document.scrollingElement;
    if (!el) return;
    const max = el.scrollHeight - window.innerHeight;
    if (max <= 0 || el.scrollTop / max < THRESHOLD) return;
    window.removeEventListener('scroll', onScroll);

    // Don't cover the form while someone is filling it in.
    if (isTyping()) {
      const wait = () => {
        setTimeout(() => {
          if (isTyping()) return;
          document.removeEventListener('focusout', wait);
          open();
        }, 0);
      };
      document.addEventListener('focusout', wait);
    } else {
      open();
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  popup.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLElement>('[data-energy-close]');
    if (!button) return;
    popup.hidden = true;
    track('energy_click', { choice: button.dataset.setMode ?? 'close' });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !popup.hidden) {
      popup.hidden = true;
      track('energy_click', { choice: 'escape' });
    }
  });
}
