// Lazy Calendly embed: the iframe is created only when the Contact section is
// close to the viewport. The plain booking link stays visible as a fallback.

const box = document.querySelector<HTMLElement>('[data-calendly]');
const frame = box?.querySelector<HTMLElement>('[data-calendly-frame]');

if (box && frame && box.dataset.url && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();

      const url = new URL(box.dataset.url!);
      url.searchParams.set('embed_type', 'Inline');
      url.searchParams.set('embed_domain', location.hostname);
      url.searchParams.set('hide_gdpr_banner', '1');

      const iframe = document.createElement('iframe');
      iframe.src = url.toString();
      iframe.title = box.dataset.title ?? 'Booking calendar';
      iframe.loading = 'lazy';
      iframe.addEventListener('load', () => {
        frame.querySelector('span')?.remove();
        frame.classList.add('is-loaded');
      });
      frame.append(iframe);
    },
    { rootMargin: '400px 0px' },
  );
  observer.observe(box);
}
