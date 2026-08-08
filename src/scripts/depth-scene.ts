type Particle = {
  x: number;
  y: number;
  z: number;
  radius: number;
  speed: number;
};

export function initialiseDepthScene(): void {
  const root = document.querySelector<HTMLElement>('[data-depth-root]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-depth-canvas]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData =
    'connection' in navigator &&
    Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );

  if (!root || !canvas || reduceMotion || saveData) return;

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  const particles: Particle[] = Array.from({ length: 34 }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 0.9 + 0.1,
    radius: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.0007 + 0.00025,
  }));

  let width = 0;
  let height = 0;
  let frame = 0;
  let running = false;

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time: number) => {
    if (!running) return;
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.y -= particle.speed * (1 + particle.z) * 16;
      if (particle.y < -1.15) {
        particle.y = 1.15;
        particle.x = Math.random() * 2 - 1;
      }

      const drift = Math.sin(time * 0.00022 + particle.z * 8) * 0.04;
      const perspective = 0.55 + particle.z * 0.65;
      const x = width * (0.72 + (particle.x + drift) * 0.26 * perspective);
      const y = height * (0.5 + particle.y * 0.46 * perspective);
      const radius = particle.radius * perspective;

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(178, 244, 237, ${0.12 + particle.z * 0.34})`;
      context.fill();
    }

    frame = window.requestAnimationFrame(draw);
  };

  const setRunning = (value: boolean) => {
    if (value === running) return;
    running = value;
    if (running) frame = window.requestAnimationFrame(draw);
    else window.cancelAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    ([entry]) => setRunning(Boolean(entry?.isIntersecting)),
    { threshold: 0.05 },
  );
  observer.observe(root);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () =>
    setRunning(document.visibilityState === 'visible' && root.getBoundingClientRect().bottom > 0),
  );
  resize();
  root.dataset.enhanced = 'true';
}
