/**
 * Freediving athlete registry.
 *
 * Only confirmed values live here. Results, rankings, records and AIDA profile
 * links are added once the official AIDA dataset is approved; until then the
 * field stays absent and the table renders `unknownValue` instead. Nothing in
 * this file may be estimated or invented (see docs/CONTENT_GUIDE.md).
 */

export type AthleteSex = 'F' | 'M';

/** Registry states. A new state only needs a badge modifier in the table. */
export type AthleteStatus = 'ACTIVE' | 'INACTIVE';

/** AIDA pool and depth disciplines, in the order the table shows them. */
export const disciplineCodes = ['STA', 'DYN', 'DYNB', 'DNF', 'CWT', 'CWTB', 'CNF', 'FIM'] as const;

export type DisciplineCode = (typeof disciplineCodes)[number];

/**
 * One confirmed cell value: a personal best, a ranking place, a record or a
 * profile link. Only `value` is required, so a cell can later gain a
 * competition date, a venue or a URL without touching the table component.
 */
export interface AthleteEntry {
  value: string;
  /** ISO date of the confirmed performance, for example `2026-08-08`. */
  date?: string;
  /** Competition or venue the value was confirmed at. */
  venue?: string;
  /** Turns the cell into a link, for example an AIDA profile or a result page. */
  url?: string;
}

export interface Athlete {
  firstName: string;
  /** Stored in natural case; `athleteName()` renders the surname in capitals. */
  lastName: string;
  sex: AthleteSex;
  status: AthleteStatus;
  /** Personal bests per discipline; a missing code stays unknown. */
  disciplines: Partial<Record<DisciplineCode, AthleteEntry>>;
  nationalRank?: AthleteEntry;
  europeanRank?: AthleteEntry;
  worldRank?: AthleteEntry;
  /** Estonian record held by the athlete, kept apart from a personal best. */
  nationalRecord?: AthleteEntry;
  /** World record held by the athlete, kept apart from the Estonian record. */
  worldRecord?: AthleteEntry;
  aidaProfile?: AthleteEntry;
}

/** Shown in every field that has no approved value yet. */
export const unknownValue = '—';

export const freedivingAthletes: Athlete[] = [
  { firstName: 'Kristin', lastName: 'Pedak', sex: 'F', status: 'INACTIVE', disciplines: {} },
  { firstName: 'Tomas', lastName: 'Rudžinskis', sex: 'M', status: 'INACTIVE', disciplines: {} },
  { firstName: 'Marco', lastName: 'Uustal', sex: 'M', status: 'INACTIVE', disciplines: {} },
];

/** Estonian collation keeps Š, Ž and other diacritics in the expected order. */
const collator = new Intl.Collator('et', { usage: 'sort' });

/** Sorted by surname, then given name, so the array order never decides it. */
export function athletesByLastName(athletes: Athlete[] = freedivingAthletes): Athlete[] {
  return [...athletes].sort(
    (a, b) =>
      collator.compare(a.lastName, b.lastName) || collator.compare(a.firstName, b.firstName),
  );
}

/** `Kristin PEDAK` - the surname is capitalized in the DOM, not only in CSS. */
export function athleteName(athlete: Athlete): string {
  return `${athlete.firstName} ${athlete.lastName.toLocaleUpperCase('et')}`;
}
