export const routes = {
  home: { et: '/', en: '/en/' },
  sports: { et: '/spordialad/', en: '/en/sports/' },
  freediving: {
    et: '/spordialad/vabasukeldumine/',
    en: '/en/sports/freediving/',
  },
  waterfighting: {
    et: '/spordialad/allveevoitlus/',
    en: '/en/sports/waterfighting/',
  },
  mermaiding: {
    et: '/spordialad/merineitsisport/',
    en: '/en/sports/mermaiding/',
  },
  league: { et: '/liit/', en: '/en/league/' },
  mission: {
    et: '/liit/eesmargid-ja-olemus/',
    en: '/en/league/mission-and-identity/',
  },
  aidaEstonia: {
    et: '/liit/aida-estonia/',
    en: '/en/league/aida-estonia/',
  },
  governance: {
    et: '/liit/juhtimine/',
    en: '/en/league/governance/',
  },
  memberClubs: {
    et: '/liit/liikmesklubid/',
    en: '/en/league/member-clubs/',
  },
  membership: {
    et: '/liit/liikmeks-astumine/',
    en: '/en/league/membership/',
  },
  safetyIntegrity: {
    et: '/liit/ohutus-ja-aus-sport/',
    en: '/en/league/safety-and-integrity/',
  },
  coaches: { et: '/treenerid/', en: '/en/coaches/' },
  qualification: {
    et: '/treenerid/kutse-info/',
    en: '/en/coaches/professional-qualification/',
  },
  aidaEducation: {
    et: '/treenerid/aida-koolitustee/',
    en: '/en/coaches/aida-education-pathway/',
  },
  trainingCalendar: {
    et: '/treenerid/koolituste-kalender/',
    en: '/en/coaches/training-calendar/',
  },
  learningMaterials: {
    et: '/treenerid/oppematerjalid/',
    en: '/en/coaches/learning-materials/',
  },
  competition: { et: '/voistlused/', en: '/en/competition/' },
  competitionCalendar: {
    et: '/voistlused/kalender/',
    en: '/en/competition/calendar/',
  },
  results: {
    et: '/voistlused/tulemused/',
    en: '/en/competition/results/',
  },
  records: {
    et: '/voistlused/rekordid/',
    en: '/en/competition/records/',
  },
  nationalTeam: {
    et: '/voistlused/koondis/',
    en: '/en/competition/national-team/',
  },
  rules: {
    et: '/voistlused/reeglid/',
    en: '/en/competition/rules/',
  },
  documents: { et: '/dokumendid/', en: '/en/documents/' },
  news: { et: '/uudised/', en: '/en/news/' },
  contact: { et: '/kontakt/', en: '/en/contact/' },
  privacy: { et: '/privaatsus/', en: '/en/privacy/' },
  cookies: { et: '/kypsised/', en: '/en/cookies/' },
  accessibility: {
    et: '/ligipaasetavus/',
    en: '/en/accessibility/',
  },
} as const;

export type Locale = 'et' | 'en';
export type RouteKey = keyof typeof routes;

export function routeFor(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

export function alternatePath(key: RouteKey, locale: Locale): string {
  return routeFor(key, locale === 'et' ? 'en' : 'et');
}
