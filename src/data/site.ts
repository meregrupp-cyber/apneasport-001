export const site = {
  baseUrl: 'https://apneasport.ee',
  legalName: {
    et: 'Eesti Apneaspordi Liit',
    en: 'Estonian Apnea Sports League',
  },
  shortName: 'EAPSL',
  internationalRole: 'AIDA Estonia',
  registryCode: '80672860',
  registrySnapshotDate: '2026-05-20',
  statutesApprovedAt: '2026-08-08',
  location: {
    et: 'Saue vald, Harju maakond, Eesti',
    en: 'Saue Parish, Harju County, Estonia',
  },
  address: 'Kauri tee 12-5, Alliku küla, Saue vald, Harju maakond 76403',
  email: 'estonia@apneasport.ee',
  phoneDisplay: '+372 510 5573',
  phoneHref: '+3725105573',
} as const;

/**
 * Confirmed EAPSL Facebook page, approved for publication by the League.
 * This module is the single source of truth: never repeat the URL elsewhere.
 * `PUBLIC_FACEBOOK_PAGE_URL` still overrides it per environment.
 */
export const facebookPageUrl = 'https://facebook.com/apneasport.ee/';

export function getFacebookPageUrl(): string | null {
  const value = import.meta.env.PUBLIC_FACEBOOK_PAGE_URL?.trim();
  return value ? value : facebookPageUrl;
}
