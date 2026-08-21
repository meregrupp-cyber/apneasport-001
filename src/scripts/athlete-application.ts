/**
 * AIDA athlete status application dialog.
 *
 * The markup is rendered by AthleteApplication.astro; this wires up opening,
 * closing and submitting. A native <dialog> brings the focus trap, Escape
 * handling and focus restore with it. Nothing here logs or stores the
 * applicant's data: the payload goes straight to the Pages Function.
 */

type ErrorKind = 'generic' | 'network' | 'rate' | 'validation';

function messageFor(form: HTMLFormElement, kind: ErrorKind): string {
  const messages: Record<ErrorKind, string | undefined> = {
    generic: form.dataset.messageGeneric,
    network: form.dataset.messageNetwork,
    rate: form.dataset.messageRate,
    validation: form.dataset.messageValidation,
  };
  return messages[kind] ?? messages.generic ?? '';
}

export function initialiseAthleteApplication(): void {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-athlete-application]');
  const trigger = document.querySelector<HTMLButtonElement>('[data-athlete-application-open]');
  if (!dialog || !trigger) return;

  // The link is inert until the dialog and the submit handler are in place.
  trigger.disabled = false;
  trigger.addEventListener('click', () => dialog.showModal());
  dialog
    .querySelector<HTMLButtonElement>('[data-athlete-application-close]')
    ?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    // The card fills the dialog box, so a click on the dialog is the backdrop.
    if (event.target === dialog) dialog.close();
  });

  const form = dialog.querySelector<HTMLFormElement>('[data-athlete-application-form]');
  const submit = dialog.querySelector<HTMLButtonElement>('[data-athlete-application-submit]');
  const error = dialog.querySelector<HTMLElement>('[data-athlete-application-error]');
  const success = dialog.querySelector<HTMLElement>('[data-athlete-application-success]');
  if (!form || !submit || !error || !success) return;

  // Nobody was born tomorrow; the server checks this again.
  const birth = form.elements.namedItem('dateOfBirth');
  if (birth instanceof HTMLInputElement) {
    birth.max = new Date().toISOString().slice(0, 10);
  }

  const showError = (kind: ErrorKind) => {
    error.textContent = messageFor(form, kind);
    error.hidden = false;
  };

  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    error.hidden = true;
    sending = true;
    submit.disabled = true;
    submit.textContent = form.dataset.labelSending ?? submit.textContent;

    const data = new FormData(form);
    const payload = {
      locale: form.dataset.locale ?? 'et',
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      dateOfBirth: data.get('dateOfBirth'),
      email: data.get('email'),
      phone: data.get('phone'),
      aidaProfile: data.get('aidaProfile'),
      applicationType: data.get('applicationType'),
      consents: {
        citizen: data.get('citizen') === 'yes',
        dataProcessing: data.get('dataProcessing') === 'yes',
        publishResults: data.get('publishResults') === 'yes',
        publishStatus: data.get('publishStatus') === 'yes',
      },
      _confirm_url: data.get('_confirm_url'),
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // The dialog stays open so the applicant sees the confirmation.
        form.hidden = true;
        success.hidden = false;
        success.focus?.();
        return;
      }
      if (response.status === 429) showError('rate');
      else if (response.status === 400) showError('validation');
      else showError('generic');
    } catch {
      // The entered values stay in the form so nothing has to be retyped.
      showError('network');
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = form.dataset.labelSubmit ?? submit.textContent;
    }
  });
}
