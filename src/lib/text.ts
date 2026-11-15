export type Mode = 'pro' | 'fire';
export type Variant = string | { pro: string; fire: string };

/** The plain string for one mode. */
export function pick(value: Variant | undefined, mode: Mode = 'pro'): string {
  if (value === undefined) return '';
  return typeof value === 'string' ? value : value[mode];
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes HTML and turns ==text== into a yellow highlight. */
export function format(text: string): string {
  return text
    .replace(/[&<>"']/g, (c) => ESCAPES[c])
    .replace(/==(.+?)==/g, '<mark class="mark">$1</mark>');
}

/** Removes inline markers, for meta tags and plain-text output. */
export function plain(text: string): string {
  return text.replace(/==(.+?)==/g, '$1');
}
