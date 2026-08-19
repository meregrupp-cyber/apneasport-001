/**
 * Athlete profile dialogs. The markup is rendered for every athlete in the
 * overview table; this only wires up opening and closing. A native <dialog>
 * brings the focus trap, Escape handling and focus restore with it.
 */
export function initialiseAthleteModals(): void {
  for (const trigger of document.querySelectorAll<HTMLButtonElement>('[data-athlete-modal-open]')) {
    const dialog = document.getElementById(trigger.dataset.athleteModalOpen ?? '');
    if (!(dialog instanceof HTMLDialogElement)) continue;

    // The name is inert until the dialog can actually be opened.
    trigger.disabled = false;
    trigger.addEventListener('click', () => dialog.showModal());
  }

  for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[data-athlete-modal]')) {
    const close = dialog.querySelector<HTMLButtonElement>('[data-athlete-modal-close]');
    close?.addEventListener('click', () => dialog.close());

    // The profile card fills the dialog box, so a click that lands on the
    // dialog itself came from the backdrop.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
}
