// Progressive enhancement for the Netlify contact form. Without JavaScript the
// form posts normally and lands on /thanks/. With it, the message is sent in
// place and the result is shown in the current voice.

import { track } from './analytics';

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

// A link with data-form-topic (e.g. the lab CTA) preselects that topic. The
// link still scrolls to #contact on its own, with or without JavaScript.
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLElement>('[data-form-topic]');
  const select = form?.querySelector<HTMLSelectElement>('select[name="topic"]');
  const topic = link?.dataset.formTopic;
  if (!select || !topic) return;
  if ([...select.options].some((option) => option.value === topic)) select.value = topic;
});

if (form) {
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const error = form.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (success) success.hidden = true;
    if (error) error.hidden = true;
    if (submit) submit.disabled = true;

    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!response.ok) throw new Error(`Form responded ${response.status}`);
      form.reset();
      if (success) success.hidden = false;
      track('contact_sent');
    } catch {
      if (error) error.hidden = false;
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}
