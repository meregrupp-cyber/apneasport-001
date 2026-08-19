/**
 * Freediving athlete registry.
 *
 * Single source of truth for both the overview table and the athlete profile
 * dialog. Only confirmed values live here: personal bests, rankings, records,
 * the AIDA competition count and profile links are added once the official
 * AIDA dataset is approved. Until then the field stays absent and the UI
 * renders `unknownValue` instead. Nothing here may be estimated or invented
 * (see docs/CONTENT_GUIDE.md).
 */

export type AthleteSex = 'F' | 'M';

/** Registry states. A new state only needs a `.status-pill` modifier. */
export type AthleteStatus = 'ACTIVE' | 'INACTIVE';

/** AIDA pool and depth disciplines, in the order the tables show them. */
export const disciplineCodes = ['STA', 'DYN', 'DYNB', 'DNF', 'CWT', 'CWTB', 'CNF', 'FIM'] as const;

export type DisciplineCode = (typeof disciplineCodes)[number];

/**
 * One confirmed cell value: a personal best, a ranking place or a profile
 * link. Only `value` is required, so a cell can later gain a competition date,
 * a venue or a URL without touching the components that render it.
 */
export interface AthleteEntry {
  value: string;
  /** ISO date of the confirmed performance, for example `2026-08-08`. */
  date?: string;
  /** Competition or venue the value was confirmed at. */
  venue?: string;
  /** Turns the cell into a link, for example a result or profile page. */
  url?: string;
}

/** Personal best and rankings within one discipline. */
export interface DisciplineResult {
  pb?: AthleteEntry;
  nationalRank?: AthleteEntry;
  europeanRank?: AthleteEntry;
  worldRank?: AthleteEntry;
}

/** A record held by the athlete; one athlete can hold several. */
export interface AthleteRecord {
  discipline: DisciplineCode;
  result: string;
  date?: string;
  venue?: string;
  url?: string;
}

export interface Athlete {
  firstName: string;
  /** Stored in natural case; `athleteName()` renders the surname in capitals. */
  lastName: string;
  sex: AthleteSex;
  /** ISO 3166-1 alpha-2 code; flag and country name are derived from it. */
  country: string;
  /** AIDA season this status belongs to. */
  season: number;
  status: AthleteStatus;
  /** Results per discipline; a missing code stays unknown. */
  disciplines: Partial<Record<DisciplineCode, DisciplineResult>>;
  /** Overall standing of the athlete, separate from the per discipline ranks. */
  nationalRank?: AthleteEntry;
  europeanRank?: AthleteEntry;
  worldRank?: AthleteEntry;
  /** Estonian records held by the athlete, kept apart from a personal best. */
  nationalRecords: AthleteRecord[];
  worldRecords: AthleteRecord[];
  /** Confirmed AIDA competition count; never derived from other fields. */
  aidaCompetitions?: number;
  aidaProfile?: AthleteEntry;
}

/** Shown in every field that has no approved value yet. */
export const unknownValue = '—';

export const freedivingAthletes: Athlete[] = [
  {
    firstName: 'Kristin',
    lastName: 'Pedak',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {},
    nationalRecords: [],
    worldRecords: [],
  },
  {
    firstName: 'Tomas',
    lastName: 'Rudžinskis',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {},
    nationalRecords: [],
    worldRecords: [],
  },
  {
    firstName: 'Marco',
    lastName: 'Uustal',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {},
    nationalRecords: [],
    worldRecords: [],
  },
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

/** Stable element id for one athlete, with diacritics folded: `pedak-kristin`. */
export function athleteSlug(athlete: Athlete): string {
  return `${athlete.lastName}-${athlete.firstName}`
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Regional indicator letters for an ISO 3166-1 alpha-2 code: `EE` -> 🇪🇪. */
export function countryFlag(country: string): string {
  return [...country.toUpperCase().replace(/[^A-Z]/g, '')]
    .map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65))
    .join('');
}

/** `DYN 201 m` - discipline and result, the way records are quoted. */
export function formatRecord(record: AthleteRecord): string {
  return `${record.discipline} ${record.result}`;
}

/** Overview cell for a record list; undefined when the athlete holds none. */
export function recordSummary(records: AthleteRecord[]): AthleteEntry | undefined {
  const [only] = records;
  if (!only) return undefined;

  const value = records.map(formatRecord).join(' · ');
  return records.length === 1 && only.url ? { value, url: only.url } : { value };
}
