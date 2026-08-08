export function initialiseMotion(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.dataset.motion = 'ready';

  const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.visible = 'true';
        revealObserver.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty('--tilt-x', `${(-y * 3.5).toFixed(2)}deg`);
      element.style.setProperty('--tilt-y', `${(x * 4.5).toFixed(2)}deg`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.removeProperty('--tilt-x');
      element.style.removeProperty('--tilt-y');
    });
  });
}
