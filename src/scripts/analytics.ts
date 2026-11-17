// One place for analytics, so the provider can be swapped in this file only.
// Events are anonymous. Without a configured provider, track() does nothing.
// Provider: Umami (cookieless), loaded in Base.astro.

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Props) => void };
  }
}

export function track(event: string, props?: Props): void {
  try {
    window.umami?.track(event, props);
  } catch {
    // Analytics must never break the page.
  }
}
