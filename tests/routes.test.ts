import { describe, expect, it } from 'vitest';
import { routes } from '../src/i18n/routes';

describe('localized routes', () => {
  it('keeps Estonian unprefixed and English under /en/', () => {
    for (const route of Object.values(routes)) {
      expect(route.et.startsWith('/et/')).toBe(false);
      expect(route.en === '/en/' || route.en.startsWith('/en/')).toBe(true);
      expect(route.et.endsWith('/')).toBe(true);
      expect(route.en.endsWith('/')).toBe(true);
    }
  });

  it('does not emit duplicate routes within a locale', () => {
    const values = Object.values(routes);
    expect(new Set(values.map((route) => route.et)).size).toBe(values.length);
    expect(new Set(values.map((route) => route.en)).size).toBe(values.length);
  });
});
