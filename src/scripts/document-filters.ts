export function initialiseDocumentFilters(): void {
  document.querySelectorAll<HTMLElement>('[data-document-browser]').forEach((browser) => {
    const form = browser.querySelector<HTMLFormElement>('[data-document-filters]');
    const documents = [...browser.querySelectorAll<HTMLElement>('[data-document]')];
    const noResults = browser.querySelector<HTMLElement>('[data-no-results]');
    if (!form || !noResults) return;

    const update = () => {
      const data = new FormData(form);
      const query = String(data.get('query') ?? '')
        .trim()
        .toLocaleLowerCase();
      const category = String(data.get('category') ?? '');
      const locale = String(data.get('locale') ?? '');
      const status = String(data.get('status') ?? '');
      const year = String(data.get('year') ?? '');
      let visible = 0;

      for (const item of documents) {
        const matches =
          (!query || item.dataset.search?.includes(query)) &&
          (!category || item.dataset.category === category) &&
          (!locale || item.dataset.locale === locale || item.dataset.locale === 'multi') &&
          (!status || item.dataset.status === status) &&
          (!year || item.dataset.year === year);
        item.hidden = !matches;
        if (matches) visible += 1;
      }

      noResults.hidden = visible > 0;
    };

    form.addEventListener('input', update);
    form.addEventListener('change', update);
  });
}
