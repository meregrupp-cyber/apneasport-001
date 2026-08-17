import type { Locale } from './routes';

const monthsEt = [
  'jaanuar',
  'veebruar',
  'märts',
  'aprill',
  'mai',
  'juuni',
  'juuli',
  'august',
  'september',
  'oktoober',
  'november',
  'detsember',
];

/**
 * Formats an ISO date (YYYY-MM-DD) for display. Kept dependency-free and
 * deterministic so the static build does not rely on the build host's ICU data.
 */
export function formatNewsDate(iso: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;

  const [, year, month, day] = match as unknown as [string, string, string, string];
  const monthIndex = Number(month) - 1;

  if (locale === 'et') {
    const name = monthsEt[monthIndex] ?? month;
    return `${Number(day)}. ${name} ${year}`;
  }

  const name = new Date(Date.UTC(Number(year), monthIndex, Number(day))).toLocaleDateString(
    'en-GB',
    { month: 'long', timeZone: 'UTC' },
  );
  return `${Number(day)} ${name} ${year}`;
}
