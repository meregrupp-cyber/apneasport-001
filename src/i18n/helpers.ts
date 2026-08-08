import type { Locale } from './routes';

export function localeFromUrl(url: URL): Locale {
  return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'et';
}

export function stripTrailingSlash(path: string): string {
  return path === '/' ? path : path.replace(/\/$/, '');
}
