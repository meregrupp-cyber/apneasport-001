import type { Locale } from './routes';

export const ui = {
  et: {
    skip: 'Liigu põhisisu juurde',
    menu: 'Menüü',
    close: 'Sulge menüü',
    language: 'English',
    languageCode: 'EN',
    contact: 'Kontakt',
    learnMore: 'Loe lähemalt',
    external: 'Avaneb uuel vahelehel',
    legalDocumentNote:
      'Veebikokkuvõte ei asenda kinnitatud dokumenti. Õigusliku tähendusega küsimustes on aluseks avaldatud dokument.',
    updated: 'Viimati uuendatud',
    placeholder: 'Info lisandub pärast kinnitamist.',
    allRights: 'Kõik õigused kaitstud.',
  },
  en: {
    skip: 'Skip to main content',
    menu: 'Menu',
    close: 'Close menu',
    language: 'Eesti',
    languageCode: 'ET',
    contact: 'Contact',
    learnMore: 'Learn more',
    external: 'Opens in a new tab',
    legalDocumentNote:
      'This web summary does not replace an approved document. Published source documents govern legal questions.',
    updated: 'Last updated',
    placeholder: 'Information will be added after approval.',
    allRights: 'All rights reserved.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function t(locale: Locale) {
  return ui[locale];
}
