import { describe, expect, it } from 'vitest';
import {
  athleteName,
  athletesByLastName,
  freedivingAthletes,
  unknownValue,
  type Athlete,
} from '../src/data/athletes';

/** Synthetic ordering fixtures - never published content. */
function fixture(lastName: string): Athlete {
  return { firstName: 'Fixture', lastName, sex: 'F', status: 'INACTIVE', disciplines: {} };
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

  it('keeps every published entry renderable, so unknown fields stay absent', () => {
    const entries = freedivingAthletes.flatMap((athlete) => [
      ...Object.values(athlete.disciplines),
      athlete.nationalRank,
      athlete.europeanRank,
      athlete.worldRank,
      athlete.nationalRecord,
      athlete.worldRecord,
      athlete.aidaProfile,
    ]);

    // An empty or placeholder value belongs nowhere in the data: the table
    // renders the em dash itself for every field that has no approved value.
    for (const entry of entries.filter((entry) => entry !== undefined)) {
      expect(entry.value.trim()).not.toBe('');
      expect(entry.value.trim()).not.toBe(unknownValue);
      if (entry.url) expect(entry.url.startsWith('https://')).toBe(true);
    }
  });
});
