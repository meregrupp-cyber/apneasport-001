import { describe, expect, it } from 'vitest';
import {
  athleteName,
  athleteSlug,
  athletesByLastName,
  countryFlag,
  disciplineCodes,
  formatRecord,
  freedivingAthletes,
  recordSummary,
  unknownValue,
  type Athlete,
} from '../src/data/athletes';

/** Synthetic ordering fixtures - never published content. */
function fixture(lastName: string): Athlete {
  return {
    firstName: 'Fixture',
    lastName,
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {},
    nationalRecords: [],
    worldRecords: [],
  };
}

describe('freediving athlete registry', () => {
  it('sorts by surname no matter how the source array is ordered', () => {
    const reversed = [...freedivingAthletes].reverse();

    expect(athletesByLastName(reversed).map((athlete) => athlete.lastName)).toEqual([
      'Pedak',
      'Rudžinskis',
      'Uustal',
    ]);
  });

  it('orders diacritics by Estonian collation, not by code point', () => {
    const sorted = athletesByLastName([fixture('Zaar'), fixture('Šaar')]);

    // A plain code point comparison would put Zaar first.
    expect(sorted.map((athlete) => athlete.lastName)).toEqual(['Šaar', 'Zaar']);
  });

  it('capitalizes the surname in the rendered name', () => {
    const rudzinskis = freedivingAthletes.find((athlete) => athlete.lastName === 'Rudžinskis');

    expect(rudzinskis && athleteName(rudzinskis)).toBe('Tomas RUDŽINSKIS');
  });

  it('builds element ids that survive diacritics and stay unique', () => {
    const slugs = freedivingAthletes.map(athleteSlug);

    expect(slugs).toEqual(['pedak-kristin', 'rudzinskis-tomas', 'uustal-marco']);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('derives the flag from the country code', () => {
    expect(countryFlag('EE')).toBe('🇪🇪');
  });

  it('keeps every published entry renderable, so unknown fields stay absent', () => {
    const entries = freedivingAthletes.flatMap((athlete) => [
      ...Object.values(athlete.disciplines).flatMap((result) => [
        result.pb,
        result.nationalRank,
        result.europeanRank,
        result.worldRank,
      ]),
      athlete.nationalRank,
      athlete.europeanRank,
      athlete.worldRank,
      athlete.aidaProfile,
    ]);

    // An empty or placeholder value belongs nowhere in the data: the UI
    // renders the em dash itself for every field with no approved value.
    for (const entry of entries.filter((entry) => entry !== undefined)) {
      expect(entry.value.trim()).not.toBe('');
      expect(entry.value.trim()).not.toBe(unknownValue);
      if (entry.url) expect(entry.url.startsWith('https://')).toBe(true);
    }
  });

  it('keeps records on supported disciplines only', () => {
    const records = freedivingAthletes.flatMap((athlete) => [
      ...athlete.nationalRecords,
      ...athlete.worldRecords,
    ]);

    for (const record of records) {
      expect(disciplineCodes).toContain(record.discipline);
      expect(record.result.trim()).not.toBe('');
    }
  });

  it('summarizes records for the overview, and keeps a single record linkable', () => {
    expect(recordSummary([])).toBeUndefined();
    expect(formatRecord({ discipline: 'DYN', result: '201 m' })).toBe('DYN 201 m');
    expect(
      recordSummary([{ discipline: 'DYN', result: '201 m', url: 'https://example.org/record' }]),
    ).toEqual({ value: 'DYN 201 m', url: 'https://example.org/record' });
    expect(
      recordSummary([
        { discipline: 'DYN', result: '201 m' },
        { discipline: 'STA', result: '7:21' },
      ]),
    ).toEqual({ value: 'DYN 201 m · STA 7:21' });
  });
});
