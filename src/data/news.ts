import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/routes';

type NewsEntry = CollectionEntry<'news'>;

/** Collection ids look like `et/my-article`; the last segment is the URL slug. */
export function newsSlug(entry: NewsEntry): string {
  const segments = entry.id.split('/');
  return segments[segments.length - 1] ?? entry.id;
}

export function newsPath(entry: NewsEntry): string {
  const slug = newsSlug(entry);
  return entry.data.locale === 'et' ? `/uudised/${slug}/` : `/en/news/${slug}/`;
}

/** Published, non-draft entries for one locale, newest first. */
export async function publishedNews(locale: Locale): Promise<NewsEntry[]> {
  const entries = await getCollection('news');
  return entries
    .filter((entry) => entry.data.locale === locale && !entry.data.draft)
    .sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt));
}

/**
 * Canonical and alternate paths for an article. Falls back to the news archive
 * in the other language when no translation exists yet.
 */
export async function newsAlternatePaths(entry: NewsEntry): Promise<{ et: string; en: string }> {
  const entries = await getCollection('news');
  const counterpart = entries.find(
    (candidate) =>
      candidate.data.translationKey === entry.data.translationKey &&
      candidate.data.locale !== entry.data.locale &&
      !candidate.data.draft,
  );

  const own = newsPath(entry);
  const other = counterpart
    ? newsPath(counterpart)
    : entry.data.locale === 'et'
      ? '/en/news/'
      : '/uudised/';

  return entry.data.locale === 'et' ? { et: own, en: other } : { et: other, en: own };
}
