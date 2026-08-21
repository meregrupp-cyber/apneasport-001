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

const fullName = (athlete: Athlete) => `${athlete.firstName} ${athlete.lastName}`;
const personalBests = freedivingAthletes.flatMap((athlete) =>
  Object.entries(athlete.disciplines).map(([code, result]) => ({ code, value: result.pb?.value })),
);

describe('freediving athlete registry', () => {
  it('sorts by surname no matter how the source array is ordered', () => {
    const reversed = [...freedivingAthletes].reverse();
    const sorted = athletesByLastName(reversed).map((athlete) => athlete.lastName);

    expect(sorted).toEqual(athletesByLastName().map((athlete) => athlete.lastName));
    expect(sorted[0]).toBe('Arumae');
  });

  it('orders diacritics by Estonian collation, not by code point', () => {
    const sorted = athletesByLastName([fixture('Zaar'), fixture('Šaar')]);

    // A plain code point comparison would put Zaar first.
    expect(sorted.map((athlete) => athlete.lastName)).toEqual(['Šaar', 'Zaar']);
  });

  it('capitalizes the surname in the rendered name', () => {
    expect(athleteName(fixture('Rudzinskis'))).toBe('Fixture RUDZINSKIS');
  });

  it('stores surnames in natural case, so the helper can capitalize them', () => {
    for (const athlete of freedivingAthletes) {
      expect(athlete.lastName).not.toBe(athlete.lastName.toLocaleUpperCase('et'));
    }
  });

  it('builds element ids that survive diacritics and stay unique', () => {
    const slugs = freedivingAthletes.map(athleteSlug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain('pedak-kristin');
  });

  it('derives the flag from the country code', () => {
    expect(countryFlag('EE')).toBe('🇪🇪');
  });

  it('keeps the registry on one roster: every athlete Estonian, 2026, inactive', () => {
    const names = freedivingAthletes.map(fullName);

    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain('Kristin Pedak');
    expect(names).toContain('Marco Uustal');
    for (const athlete of freedivingAthletes) {
      expect(athlete.country).toBe('EE');
      expect(athlete.season).toBe(2026);
      expect(athlete.status).toBe('INACTIVE');
      expect(['F', 'M']).toContain(athlete.sex);
    }
  });

  it('holds only AIDA discipline codes and bare result values', () => {
    for (const { code, value } of personalBests) {
      expect(disciplineCodes).toContain(code);
      expect(value).toBeDefined();
      // A result cell carries the result alone: no PB/NR/WR marker, no points,
      // no ranking place.
      expect(value).not.toMatch(/\b(PB|NR|WR)\b|#|pts|points/);
      expect(value).toMatch(code === 'STA' ? /^\d:\d{2}$/ : /^\d+ m$/);
    }
  });

  it('links only to official AIDA athlete profiles', () => {
    for (const athlete of freedivingAthletes) {
      if (!athlete.aidaProfile) continue;
      expect(athlete.aidaProfile.url).toMatch(
        /^https:\/\/www\.aidainternational\.org\/Athletes\/Profile-/,
      );
    }
  });

  it('claims a record only on a supported discipline, and no world records yet', () => {
    for (const athlete of freedivingAthletes) {
      expect(athlete.worldRecords).toEqual([]);
      for (const record of athlete.nationalRecords) {
        expect(disciplineCodes).toContain(record.discipline);
        expect(record.result.trim()).not.toBe('');
      }
    }
  });

  it('leaves unverifiable fields out rather than guessing them', () => {
    for (const athlete of freedivingAthletes) {
      // The competition count is not exactly verifiable from an AIDA profile.
      expect(athlete.aidaCompetitions).toBeUndefined();
    }
  });

  it('keeps rankings per discipline, in AIDA place format, never without a result', () => {
    for (const athlete of freedivingAthletes) {
      for (const result of Object.values(athlete.disciplines)) {
        const places = [result.nationalRank, result.europeanRank, result.worldRank];
        for (const place of places.filter((place) => place !== undefined)) {
          expect(place.value).toMatch(/^#\d+$/);
          // A place without a performance behind it would be a guess.
          expect(result.pb?.value).toBeDefined();
        }
      }
    }
  });

  it('keeps every published entry renderable, so unknown fields stay absent', () => {
    const entries = freedivingAthletes.flatMap((athlete) => [
      ...Object.values(athlete.disciplines).flatMap((result) => [
        result.pb,
        result.nationalRank,
        result.europeanRank,
        result.worldRank,
      ]),
      athlete.aidaProfile,
    ]);

    for (const entry of entries.filter((entry) => entry !== undefined)) {
      expect(entry.value.trim()).not.toBe('');
      expect(entry.value.trim()).not.toBe(unknownValue);
      if (entry.url) expect(entry.url.startsWith('https://')).toBe(true);
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
