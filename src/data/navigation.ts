import { routeFor, type Locale, type RouteKey } from '../i18n/routes';

type NavigationItem = {
  key: RouteKey;
  label: Record<Locale, string>;
};

const items: NavigationItem[] = [
  { key: 'sports', label: { et: 'Spordialad', en: 'Sports' } },
  { key: 'league', label: { et: 'Liit', en: 'League' } },
  { key: 'coaches', label: { et: 'Treenerid', en: 'Coaches' } },
  { key: 'documents', label: { et: 'Dokumendid', en: 'Documents' } },
  { key: 'news', label: { et: 'Uudised', en: 'News' } },
];

export function navigation(locale: Locale) {
  return items.map((item) => ({
    key: item.key,
    label: item.label[locale],
    href: routeFor(item.key, locale),
  }));
}
