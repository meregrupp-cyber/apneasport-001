/**
 * Freediving athlete registry.
 *
 * Single source of truth for both the overview table and the athlete profile
 * dialog.
 *
 * Personal bests come from the AIDA International athlete profiles
 * (www.aidainternational.org/Athletes), cross-checked against the AIDA
 * Estonia ranking (www.aidainternational.org/Ranking, nationality Estonia).
 * The profile is canonical because it excludes red-carded attempts, which the
 * ranking still lists. National records come from the official AIDA national
 * records page for Estonia. Only AIDA sources belong here - never CMAS,
 * aggregator or club data.
 *
 * Rankings are per discipline, the way AIDA publishes them: the national,
 * continental and world place shown on the athlete's own AIDA profile. AIDA
 * gives no as-of date for them, so they are a snapshot and move whenever
 * anyone else competes.
 *
 * A value that no official AIDA source confirms is left out, and the UI
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
  /** Results and rankings per discipline; a missing code stays unknown. */
  disciplines: Partial<Record<DisciplineCode, DisciplineResult>>;
  /** Estonian records held by the athlete, kept apart from a personal best. */
  nationalRecords: AthleteRecord[];
  worldRecords: AthleteRecord[];
  /** Confirmed AIDA competition count; never derived from other fields. */
  aidaCompetitions?: number;
  aidaProfile?: AthleteEntry;
}

/** Shown in every field that has no approved value yet. */
export const unknownValue = '—';

/**
 * The day the rankings below were read off the AIDA profiles. AIDA publishes
 * no as-of date of its own, so the UI shows this one. Update it in the same
 * commit that refreshes the ranking values.
 */
export const rankingSnapshotDate = '2026-09-10';

export const freedivingAthletes: Athlete[] = [
  {
    firstName: 'Alo',
    lastName: 'Arumae',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '4:24', date: '2014-02-08', venue: 'RIGA FREEDIVING CUP 2014 AIDA' },
        nationalRank: { value: '#20' },
        europeanRank: { value: '#2324' },
        worldRank: { value: '#4127' },
      },
      DYN: {
        pb: { value: '99 m', date: '2014-02-08', venue: 'RIGA FREEDIVING CUP 2014 AIDA' },
        nationalRank: { value: '#13' },
        europeanRank: { value: '#1897' },
        worldRank: { value: '#3093' },
      },
      DNF: {
        pb: { value: '83 m', date: '2014-02-08', venue: 'RIGA FREEDIVING CUP 2014 AIDA' },
        nationalRank: { value: '#10' },
        europeanRank: { value: '#1331' },
        worldRank: { value: '#2303' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000001344',
    },
  },
  {
    firstName: 'Vassili',
    lastName: 'Baidala',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      CWT: {
        pb: { value: '46 m', date: '2010-09-26', venue: 'Triple Depth 2010' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#591' },
        worldRank: { value: '#1197' },
      },
      CNF: {
        pb: { value: '30 m', date: '2010-09-26', venue: 'Triple Depth 2010' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#499' },
        worldRank: { value: '#1042' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000000c7d',
    },
  },
  {
    firstName: 'Anita',
    lastName: 'Berezovskaja',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      DYN: {
        pb: { value: '74 m', date: '2025-02-16', venue: 'Riga Freediving Cup 2025 (AIDA)' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#1054' },
        worldRank: { value: '#2137' },
      },
      DYNB: {
        pb: { value: '59 m', date: '2025-02-15', venue: 'Riga Freediving Cup 2025 (AIDA)' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#557' },
        worldRank: { value: '#2345' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-8a7f1413-0e7f-4d6b-9ae2-80f054c04142',
    },
  },
  {
    firstName: 'Vladimir',
    lastName: 'Demjantshuk',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:04', date: '2006-04-14', venue: 'Finnish National Championships' },
        nationalRank: { value: '#14' },
        europeanRank: { value: '#1499' },
        worldRank: { value: '#2472' },
      },
      DYN: {
        pb: { value: '109 m', date: '2006-04-14', venue: 'Finnish National Championships' },
        nationalRank: { value: '#10' },
        europeanRank: { value: '#1363' },
        worldRank: { value: '#2215' },
      },
      DNF: {
        pb: { value: '92 m', date: '2006-04-14', venue: 'Finnish National Championships' },
        nationalRank: { value: '#7' },
        europeanRank: { value: '#1078' },
        worldRank: { value: '#1841' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000000586',
    },
  },
  {
    firstName: 'Kaspar',
    lastName: 'Eevald',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:13', date: '2019-02-09', venue: 'Riga Freediving Cup 2019 AIDA' },
        nationalRank: { value: '#13' },
        europeanRank: { value: '#1294' },
        worldRank: { value: '#2094' },
      },
      DYN: {
        pb: { value: '100 m', date: '2019-02-10', venue: 'Riga Freediving Cup 2019 AIDA' },
        nationalRank: { value: '#12' },
        europeanRank: { value: '#1822' },
        worldRank: { value: '#2925' },
      },
      DYNB: {
        pb: { value: '107 m', date: '2020-02-09', venue: 'AIDA Riga Freediving Cup 2020' },
        nationalRank: { value: '#6' },
        europeanRank: { value: '#557' },
        worldRank: { value: '#1525' },
      },
      DNF: {
        pb: { value: '74 m', date: '2019-02-09', venue: 'Riga Freediving Cup 2019 AIDA' },
        nationalRank: { value: '#12' },
        europeanRank: { value: '#1698' },
        worldRank: { value: '#3049' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-f21872c4-3c6e-4841-aba4-670dfd4a970a',
    },
  },
  {
    firstName: 'Erki',
    lastName: 'Enkvist',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: {
          value: '6:26',
          date: '2019-06-22',
          venue: 'XVI Polish Freediving Pool Championships',
        },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#345' },
        worldRank: { value: '#515' },
      },
      DYN: {
        pb: { value: '203 m', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#145' },
        worldRank: { value: '#225' },
      },
      DYNB: {
        pb: {
          value: '160 m',
          date: '2019-06-23',
          venue: 'XVI Polish Freediving Pool Championships',
        },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#175' },
        worldRank: { value: '#405' },
      },
      DNF: {
        pb: { value: '153 m', date: '2018-04-07', venue: 'FFO 2018 - Freediving Finnish Open' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#155' },
        worldRank: { value: '#240' },
      },
      CWT: {
        pb: { value: '57 m', date: '2018-09-19', venue: 'Authentic Big Blue 2018' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#422' },
        worldRank: { value: '#847' },
      },
      CWTB: {
        pb: { value: '47 m', date: '2019-08-13', venue: 'Crystal Clear Water Competition' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#264' },
        worldRank: { value: '#800' },
      },
      CNF: {
        pb: { value: '47 m', date: '2016-10-03', venue: 'Infinity Depth Games II' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#234' },
        worldRank: { value: '#479' },
      },
      FIM: {
        pb: { value: '60 m', date: '2018-09-20', venue: 'Authentic Big Blue 2018' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#362' },
        worldRank: { value: '#739' },
      },
    },
    nationalRecords: [
      { discipline: 'CWT', result: '57 m' },
      { discipline: 'FIM', result: '60 m' },
    ],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-1300f3a7-9a11-470b-a199-3bb9f488c6f9',
    },
  },
  {
    firstName: 'Andrei',
    lastName: 'Horev',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '2:11', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#24' },
        europeanRank: { value: '#4016' },
        worldRank: { value: '#7874' },
      },
      DYNB: {
        pb: { value: '112 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#5' },
        europeanRank: { value: '#509' },
        worldRank: { value: '#1350' },
      },
      DNF: {
        pb: { value: '83 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#9' },
        europeanRank: { value: '#1322' },
        worldRank: { value: '#2291' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-9e00841c-b311-458b-893d-21a784ffabfb',
    },
  },
  {
    firstName: 'Liisa',
    lastName: 'Kask',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '2:44', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#7' },
        europeanRank: { value: '#1405' },
        worldRank: { value: '#3537' },
      },
      DYN: {
        pb: { value: '91 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#784' },
        worldRank: { value: '#1593' },
      },
      DYNB: {
        pb: { value: '80 m', date: '2025-11-15', venue: 'Riga Kickoff Comps 2025 AIDA' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#462' },
        worldRank: { value: '#1729' },
      },
      CWTB: {
        pb: { value: '32 m', date: '2025-04-28', venue: 'ONLY ONE AIDA COMPETITION' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#230' },
        worldRank: { value: '#791' },
      },
      FIM: {
        pb: { value: '35 m', date: '2025-04-29', venue: 'ONLY ONE AIDA COMPETITION' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#335' },
        worldRank: { value: '#846' },
      },
    },
    nationalRecords: [
      { discipline: 'CWTB', result: '32 m' },
      { discipline: 'FIM', result: '35 m' },
    ],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-1a716add-1dcb-498c-853f-2389e8acca67',
    },
  },
  {
    firstName: 'Kea',
    lastName: 'Kendra',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '4:21', date: '2019-02-09', venue: 'Riga Freediving Cup 2019 AIDA' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#658' },
        worldRank: { value: '#1461' },
      },
      DYN: {
        pb: { value: '77 m', date: '2019-02-10', venue: 'Riga Freediving Cup 2019 AIDA' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#969' },
        worldRank: { value: '#1960' },
      },
      DYNB: {
        pb: { value: '102 m', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#352' },
        worldRank: { value: '#1116' },
      },
      DNF: {
        pb: { value: '93 m', date: '2019-04-20', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#364' },
        worldRank: { value: '#721' },
      },
    },
    nationalRecords: [
      { discipline: 'DYNB', result: '102 m' },
      { discipline: 'DNF', result: '93 m' },
    ],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-043ffe13-4f53-4c09-bbae-58d42dee2109',
    },
  },
  {
    firstName: 'Mikk',
    lastName: 'Kendra',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:02', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#17' },
        europeanRank: { value: '#1599' },
        worldRank: { value: '#2658' },
      },
      DYNB: {
        pb: { value: '107 m', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#7' },
        europeanRank: { value: '#560' },
        worldRank: { value: '#1545' },
      },
      DNF: {
        pb: { value: '104 m', date: '2019-04-20', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#6' },
        europeanRank: { value: '#830' },
        worldRank: { value: '#1381' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-f6e049aa-19b3-4825-a2f6-eb82f477984b',
    },
  },
  {
    firstName: 'Jekaterina',
    lastName: 'Korhonen',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '3:08', date: '2020-02-08', venue: 'AIDA Riga Freediving Cup 2020' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#1271' },
        worldRank: { value: '#3152' },
      },
      DYNB: {
        pb: { value: '55 m', date: '2020-02-09', venue: 'AIDA Riga Freediving Cup 2020' },
        nationalRank: { value: '#6' },
        europeanRank: { value: '#572' },
        worldRank: { value: '#2437' },
      },
      DNF: {
        pb: { value: '58 m', date: '2020-02-08', venue: 'AIDA Riga Freediving Cup 2020' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#831' },
        worldRank: { value: '#1769' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-84701594-0b98-4e8d-8d39-c1b1cf8159c9',
    },
  },
  {
    firstName: 'Gennadi',
    lastName: 'Kovalenko',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '4:44', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#19' },
        europeanRank: { value: '#1874' },
        worldRank: { value: '#3205' },
      },
      DYN: {
        pb: { value: '100 m', date: '2006-04-14', venue: 'Finnish National Championships' },
        nationalRank: { value: '#14' },
        europeanRank: { value: '#2293' },
        worldRank: { value: '#3755' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-00000000063e',
    },
  },
  {
    firstName: 'Karol',
    lastName: 'Kovanen',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:02', date: '2004-07-31', venue: 'Finnish Freediving Championship 2004' },
        nationalRank: { value: '#16' },
        europeanRank: { value: '#1569' },
        worldRank: { value: '#2610' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000000451',
    },
  },
  {
    firstName: 'Aleksandr',
    lastName: 'Krolov',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:04', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#15' },
        europeanRank: { value: '#1517' },
        worldRank: { value: '#2508' },
      },
      DYNB: {
        pb: { value: '77 m', date: '2025-02-15', venue: 'Riga Freediving Cup 2025 (AIDA)' },
        nationalRank: { value: '#9' },
        europeanRank: { value: '#829' },
        worldRank: { value: '#2744' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-465b44bc-aeb8-4bbe-8f77-be6ae14fec5a',
    },
  },
  {
    firstName: 'Ksenia',
    lastName: 'Kruberg',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '4:37', date: '2020-10-05', venue: 'Apnea Pirates Cup AIDA 2020' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#524' },
        worldRank: { value: '#1103' },
      },
    },
    nationalRecords: [{ discipline: 'STA', result: '4:37' }],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-0c9d5470-430c-43b6-81b1-0b9ffbacd902',
    },
  },
  {
    firstName: 'Rauno',
    lastName: 'Lehtsalu',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:23', date: '2019-03-29', venue: 'AFA Pool Nationals 2019' },
        nationalRank: { value: '#11' },
        europeanRank: { value: '#1096' },
        worldRank: { value: '#1758' },
      },
      DYN: {
        pb: { value: '177 m', date: '2018-05-13', venue: 'Australian pool national championship' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#298' },
        worldRank: { value: '#480' },
      },
      DYNB: {
        pb: { value: '156 m', date: '2019-03-31', venue: 'AFA Pool Nationals 2019' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#200' },
        worldRank: { value: '#470' },
      },
      DNF: {
        pb: { value: '112 m', date: '2018-05-12', venue: 'Australian pool national championship' },
        nationalRank: { value: '#5' },
        europeanRank: { value: '#608' },
        worldRank: { value: '#1012' },
      },
      CWT: {
        pb: { value: '48 m', date: '2018-10-23', venue: 'AFA Depth Nationals 2018' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#575' },
        worldRank: { value: '#1158' },
      },
      CNF: {
        pb: { value: '24 m', date: '2018-10-24', venue: 'AFA Depth Nationals 2018' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#600' },
        worldRank: { value: '#1272' },
      },
      FIM: {
        pb: { value: '45 m', date: '2018-10-22', venue: 'AFA Depth Nationals 2018' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#593' },
        worldRank: { value: '#1294' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-27b2bd93-6efa-4049-8c7a-9ec261ab64b4',
    },
  },
  {
    firstName: 'Tarass',
    lastName: 'Markin',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:15', date: '2014-04-12', venue: 'Gili Pool Comp' },
        nationalRank: { value: '#12' },
        europeanRank: { value: '#1255' },
        worldRank: { value: '#2030' },
      },
      DYN: {
        pb: { value: '75 m', date: '2014-04-12', venue: 'Gili Pool Comp' },
        nationalRank: { value: '#16' },
        europeanRank: { value: '#2579' },
        worldRank: { value: '#4241' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-0000000013c4',
    },
  },
  {
    firstName: 'Dmitri',
    lastName: 'Melnikov',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '7:43', date: '2023-08-06', venue: 'AIDA GetEcSTAtic! - Summer Buzz' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#80' },
        worldRank: { value: '#104' },
      },
      DYN: {
        pb: { value: '272 m', date: '2025-09-13', venue: 'AIDA Get EcSTAtic! (Into The) Unknown' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#11' },
        worldRank: { value: '#16' },
      },
      DYNB: {
        pb: { value: '261 m', date: '2022-12-05', venue: 'AIDA Ultimate Freediving Challenge 4' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#5' },
        worldRank: { value: '#9' },
      },
      DNF: {
        pb: { value: '200 m', date: '2022-02-19', venue: 'AAS AIDA Mini Comp 2022' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#18' },
        worldRank: { value: '#24' },
      },
    },
    nationalRecords: [
      { discipline: 'STA', result: '7:43' },
      { discipline: 'DYN', result: '272 m' },
      { discipline: 'DYNB', result: '261 m' },
      { discipline: 'DNF', result: '200 m' },
    ],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-aba65a8c-8556-49f2-8a77-aa15826c95bc',
    },
  },
  {
    firstName: 'Aleksandr',
    lastName: 'Oleshko',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '4:15', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#21' },
        europeanRank: { value: '#2519' },
        worldRank: { value: '#4503' },
      },
      DYNB: {
        pb: { value: '88 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#8' },
        europeanRank: { value: '#741' },
        worldRank: { value: '#2382' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-45f8360c-1593-48dc-92b0-574c842e33be',
    },
  },
  {
    firstName: 'Robert',
    lastName: 'Pallas',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:55', date: '2022-04-23', venue: 'AIDA Finnish Super Open' },
        nationalRank: { value: '#8' },
        europeanRank: { value: '#673' },
        worldRank: { value: '#1043' },
      },
      DYN: {
        pb: { value: '200 m', date: '2022-04-23', venue: 'AIDA Finnish Super Open' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#183' },
        worldRank: { value: '#287' },
      },
      DNF: {
        pb: { value: '157 m', date: '2022-04-24', venue: 'AIDA Finnish Super Open' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#122' },
        worldRank: { value: '#177' },
      },
      CWTB: {
        pb: { value: '48 m', date: '2019-08-18', venue: 'AIDA Asikkala Depth Challenge 2019' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#258' },
        worldRank: { value: '#786' },
      },
      CNF: {
        pb: { value: '52 m', date: '2021-10-22', venue: 'AIDA Triton Cup October- Calm Zone' },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#174' },
        worldRank: { value: '#343' },
      },
    },
    nationalRecords: [
      { discipline: 'CWTB', result: '48 m' },
      { discipline: 'CNF', result: '52 m' },
    ],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-3108ae27-127b-4812-bd73-f545f1c1a700',
    },
  },
  {
    firstName: 'Pille',
    lastName: 'Peri',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '4:03', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#874' },
        worldRank: { value: '#2013' },
      },
      DYN: {
        pb: {
          value: '100 m',
          date: '2015-03-28',
          venue: 'Svenska dam mästerskapen poolfridykning 2015',
        },
        nationalRank: { value: '#1' },
        europeanRank: { value: '#689' },
        worldRank: { value: '#1361' },
      },
      DNF: {
        pb: {
          value: '75 m',
          date: '2015-03-28',
          venue: 'Svenska dam mästerskapen poolfridykning 2015',
        },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#593' },
        worldRank: { value: '#1206' },
      },
    },
    nationalRecords: [{ discipline: 'DYN', result: '100 m' }],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-bf137a8a-287e-49c5-999d-6c37ff32cb74',
    },
  },
  {
    firstName: 'Indrek',
    lastName: 'Roosileht',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '6:09', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' },
        nationalRank: { value: '#6' },
        europeanRank: { value: '#464' },
        worldRank: { value: '#717' },
      },
      DYN: {
        pb: { value: '77 m', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' },
        nationalRank: { value: '#15' },
        europeanRank: { value: '#2421' },
        worldRank: { value: '#3974' },
      },
      DNF: {
        pb: { value: '61 m', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' },
        nationalRank: { value: '#14' },
        europeanRank: { value: '#2043' },
        worldRank: { value: '#3799' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-00000000157e',
    },
  },
  {
    firstName: 'Irina',
    lastName: 'Samsonova',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '3:07', date: '2024-02-03', venue: 'AIDA Lithuania Open Pool Championship' },
        nationalRank: { value: '#5' },
        europeanRank: { value: '#1279' },
        worldRank: { value: '#3172' },
      },
      DYNB: {
        pb: { value: '56 m', date: '2024-02-04', venue: 'AIDA Lithuania Open Pool Championship' },
        nationalRank: { value: '#5' },
        europeanRank: { value: '#569' },
        worldRank: { value: '#2412' },
      },
      DNF: {
        pb: { value: '37 m', date: '2024-02-03', venue: 'AIDA Lithuania Open Pool Championship' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#1053' },
        worldRank: { value: '#2438' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-74646bd4-fe61-4e11-8fcf-7ceaefc1f2d6',
    },
  },
  {
    firstName: 'Jelena',
    lastName: 'Savotskina',
    sex: 'F',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '3:04', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#6' },
        europeanRank: { value: '#1305' },
        worldRank: { value: '#3249' },
      },
      DYNB: {
        pb: { value: '76 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#491' },
        worldRank: { value: '#1882' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-d51a7032-1335-4828-9c5a-0d9c2333d5ed',
    },
  },
  {
    firstName: 'Martin',
    lastName: 'Schvede',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '6:01', date: '2013-02-09', venue: 'Riga Freediving Cup 2013' },
        nationalRank: { value: '#7' },
        europeanRank: { value: '#607' },
        worldRank: { value: '#945' },
      },
      DNF: {
        pb: { value: '90 m', date: '2013-02-09', venue: 'Riga Freediving Cup 2013' },
        nationalRank: { value: '#8' },
        europeanRank: { value: '#1125' },
        worldRank: { value: '#1928' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-00000000110b',
    },
  },
  {
    firstName: 'Aleksandr',
    lastName: 'Shamanin',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '3:27', date: '2006-04-14', venue: 'Finnish National Championships' },
        nationalRank: { value: '#23' },
        europeanRank: { value: '#3728' },
        worldRank: { value: '#7160' },
      },
      DYN: {
        pb: { value: '62 m', date: '2006-04-14', venue: 'Finnish National Championships' },
        nationalRank: { value: '#17' },
        europeanRank: { value: '#3124' },
        worldRank: { value: '#5129' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000000672',
    },
  },
  {
    firstName: 'Aleksei',
    lastName: 'Sosojev',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '6:34', date: '2026-05-02', venue: 'RIGA SPRING - AIDA STATIC PERFORMANCES' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#286' },
        worldRank: { value: '#426' },
      },
      DYNB: {
        pb: { value: '154 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#214' },
        worldRank: { value: '#513' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-8d469607-eb8e-4efe-98f1-3f7e2efc6d3d',
    },
  },
  {
    firstName: 'Sergei',
    lastName: 'Tekanov',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:49', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#9' },
        europeanRank: { value: '#727' },
        worldRank: { value: '#1121' },
      },
      DYN: {
        pb: { value: '116 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#9' },
        europeanRank: { value: '#1226' },
        worldRank: { value: '#1978' },
      },
      DNF: {
        pb: { value: '60 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#15' },
        europeanRank: { value: '#2096' },
        worldRank: { value: '#3914' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000000666',
    },
  },
  {
    firstName: 'Ken',
    lastName: 'Tomson',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '6:21', date: '2022-04-23', venue: 'AIDA Finnish Super Open' },
        nationalRank: { value: '#5' },
        europeanRank: { value: '#368' },
        worldRank: { value: '#555' },
      },
      DYN: {
        pb: { value: '150 m', date: '2022-04-23', venue: 'AIDA Finnish Super Open' },
        nationalRank: { value: '#5' },
        europeanRank: { value: '#618' },
        worldRank: { value: '#1008' },
      },
      DNF: {
        pb: { value: '130 m', date: '2019-04-20', venue: 'Finnish Freediving Open 2019' },
        nationalRank: { value: '#4' },
        europeanRank: { value: '#343' },
        worldRank: { value: '#540' },
      },
      FIM: {
        pb: { value: '31 m', date: '2016-10-03', venue: 'Infinity Depth Games II' },
        nationalRank: { value: '#3' },
        europeanRank: { value: '#888' },
        worldRank: { value: '#1993' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
  },
  {
    firstName: 'Roman',
    lastName: 'Tsherkesov',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '7:05', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#2' },
        europeanRank: { value: '#156' },
        worldRank: { value: '#233' },
      },
      DYN: {
        pb: { value: '105 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#11' },
        europeanRank: { value: '#1519' },
        worldRank: { value: '#2455' },
      },
      DNF: {
        pb: { value: '79 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' },
        nationalRank: { value: '#11' },
        europeanRank: { value: '#1525' },
        worldRank: { value: '#2678' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-00000000-0000-0000-0000-000000000b2b',
    },
  },
  {
    firstName: 'Timur',
    lastName: 'Tumajev',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '3:00', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#22' },
        europeanRank: { value: '#3649' },
        worldRank: { value: '#6975' },
      },
      DYN: {
        pb: { value: '50 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#18' },
        europeanRank: { value: '#3155' },
        worldRank: { value: '#5193' },
      },
      DYNB: {
        pb: { value: '49 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' },
        nationalRank: { value: '#10' },
        europeanRank: { value: '#959' },
        worldRank: { value: '#3496' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-4e293f8e-40e2-455b-9898-cdb49eb14f31',
    },
  },
  {
    firstName: 'Aleksandr',
    lastName: 'Zaborski',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: {
        pb: { value: '5:01', date: '2018-02-10', venue: 'RIGA FREEDIVING CUP 2018 WR status' },
        nationalRank: { value: '#18' },
        europeanRank: { value: '#1637' },
        worldRank: { value: '#2742' },
      },
      DYN: {
        pb: { value: '130 m', date: '2018-02-11', venue: 'RIGA FREEDIVING CUP 2018 WR status' },
        nationalRank: { value: '#8' },
        europeanRank: { value: '#902' },
        worldRank: { value: '#1459' },
      },
      DNF: {
        pb: { value: '62 m', date: '2018-02-10', venue: 'RIGA FREEDIVING CUP 2018 WR status' },
        nationalRank: { value: '#13' },
        europeanRank: { value: '#1988' },
        worldRank: { value: '#3683' },
      },
    },
    nationalRecords: [],
    worldRecords: [],
    aidaProfile: {
      value: 'AIDA →',
      url: 'https://www.aidainternational.org/Athletes/Profile-2d73f9d8-a701-483d-acda-0170ef89fd31',
    },
  },
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
