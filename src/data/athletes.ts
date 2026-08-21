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
    firstName: 'Alo',
    lastName: 'Arumae',
    sex: 'M',
    country: 'EE',
    season: 2026,
    status: 'INACTIVE',
    disciplines: {
      STA: { pb: { value: '4:24', date: '2014-02-08', venue: 'RIGA FREEDIVING CUP 2014 AIDA' } },
      DYN: { pb: { value: '99 m', date: '2014-02-08', venue: 'RIGA FREEDIVING CUP 2014 AIDA' } },
      DNF: { pb: { value: '83 m', date: '2014-02-08', venue: 'RIGA FREEDIVING CUP 2014 AIDA' } },
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
      CWT: { pb: { value: '46 m', date: '2010-09-26', venue: 'Triple Depth 2010' } },
      CNF: { pb: { value: '30 m', date: '2010-09-26', venue: 'Triple Depth 2010' } },
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
      DYN: { pb: { value: '74 m', date: '2025-02-16', venue: 'Riga Freediving Cup 2025 (AIDA)' } },
      DYNB: { pb: { value: '59 m', date: '2025-02-15', venue: 'Riga Freediving Cup 2025 (AIDA)' } },
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
      STA: { pb: { value: '5:04', date: '2006-04-14', venue: 'Finnish National Championships' } },
      DYN: { pb: { value: '109 m', date: '2006-04-14', venue: 'Finnish National Championships' } },
      DNF: { pb: { value: '92 m', date: '2006-04-14', venue: 'Finnish National Championships' } },
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
      STA: { pb: { value: '5:13', date: '2019-02-09', venue: 'Riga Freediving Cup 2019 AIDA' } },
      DYN: { pb: { value: '100 m', date: '2019-02-10', venue: 'Riga Freediving Cup 2019 AIDA' } },
      DYNB: { pb: { value: '107 m', date: '2020-02-09', venue: 'AIDA Riga Freediving Cup 2020' } },
      DNF: { pb: { value: '74 m', date: '2019-02-09', venue: 'Riga Freediving Cup 2019 AIDA' } },
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
      },
      DYN: { pb: { value: '203 m', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' } },
      DYNB: {
        pb: {
          value: '160 m',
          date: '2019-06-23',
          venue: 'XVI Polish Freediving Pool Championships',
        },
      },
      DNF: {
        pb: { value: '153 m', date: '2018-04-07', venue: 'FFO 2018 - Freediving Finnish Open' },
      },
      CWT: { pb: { value: '57 m', date: '2018-09-19', venue: 'Authentic Big Blue 2018' } },
      CWTB: { pb: { value: '47 m', date: '2019-08-13', venue: 'Crystal Clear Water Competition' } },
      CNF: { pb: { value: '47 m', date: '2016-10-03', venue: 'Infinity Depth Games II' } },
      FIM: { pb: { value: '60 m', date: '2018-09-20', venue: 'Authentic Big Blue 2018' } },
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
      STA: { pb: { value: '2:11', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYNB: {
        pb: { value: '112 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' },
      },
      DNF: { pb: { value: '83 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
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
      STA: { pb: { value: '2:44', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYN: { pb: { value: '91 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYNB: { pb: { value: '80 m', date: '2025-11-15', venue: 'Riga Kickoff Comps 2025 AIDA' } },
      CWTB: { pb: { value: '32 m', date: '2025-04-28', venue: 'ONLY ONE AIDA COMPETITION' } },
      FIM: { pb: { value: '35 m', date: '2025-04-29', venue: 'ONLY ONE AIDA COMPETITION' } },
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
      STA: { pb: { value: '4:21', date: '2019-02-09', venue: 'Riga Freediving Cup 2019 AIDA' } },
      DYN: { pb: { value: '77 m', date: '2019-02-10', venue: 'Riga Freediving Cup 2019 AIDA' } },
      DYNB: { pb: { value: '102 m', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' } },
      DNF: { pb: { value: '93 m', date: '2019-04-20', venue: 'Finnish Freediving Open 2019' } },
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
      STA: { pb: { value: '5:02', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' } },
      DYNB: { pb: { value: '107 m', date: '2019-04-21', venue: 'Finnish Freediving Open 2019' } },
      DNF: { pb: { value: '104 m', date: '2019-04-20', venue: 'Finnish Freediving Open 2019' } },
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
      STA: { pb: { value: '3:08', date: '2020-02-08', venue: 'AIDA Riga Freediving Cup 2020' } },
      DYNB: { pb: { value: '55 m', date: '2020-02-09', venue: 'AIDA Riga Freediving Cup 2020' } },
      DNF: { pb: { value: '58 m', date: '2020-02-08', venue: 'AIDA Riga Freediving Cup 2020' } },
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
      STA: { pb: { value: '4:44', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
      DYN: { pb: { value: '100 m', date: '2006-04-14', venue: 'Finnish National Championships' } },
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
      STA: { pb: { value: '5:04', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYNB: { pb: { value: '77 m', date: '2025-02-15', venue: 'Riga Freediving Cup 2025 (AIDA)' } },
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
      STA: { pb: { value: '4:37', date: '2020-10-05', venue: 'Apnea Pirates Cup AIDA 2020' } },
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
      STA: { pb: { value: '5:23', date: '2019-03-29', venue: 'AFA Pool Nationals 2019' } },
      DYN: {
        pb: { value: '177 m', date: '2018-05-13', venue: 'Australian pool national championship' },
      },
      DYNB: { pb: { value: '156 m', date: '2019-03-31', venue: 'AFA Pool Nationals 2019' } },
      DNF: {
        pb: { value: '112 m', date: '2018-05-12', venue: 'Australian pool national championship' },
      },
      CWT: { pb: { value: '48 m', date: '2018-10-23', venue: 'AFA Depth Nationals 2018' } },
      CNF: { pb: { value: '24 m', date: '2018-10-24', venue: 'AFA Depth Nationals 2018' } },
      FIM: { pb: { value: '45 m', date: '2018-10-22', venue: 'AFA Depth Nationals 2018' } },
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
      STA: { pb: { value: '5:15', date: '2014-04-12', venue: 'Gili Pool Comp' } },
      DYN: { pb: { value: '75 m', date: '2014-04-12', venue: 'Gili Pool Comp' } },
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
      STA: { pb: { value: '7:43', date: '2023-08-06', venue: 'AIDA GetEcSTAtic! - Summer Buzz' } },
      DYN: {
        pb: { value: '272 m', date: '2025-09-13', venue: 'AIDA Get EcSTAtic! (Into The) Unknown' },
      },
      DYNB: {
        pb: { value: '261 m', date: '2022-12-05', venue: 'AIDA Ultimate Freediving Challenge 4' },
      },
      DNF: { pb: { value: '200 m', date: '2022-02-19', venue: 'AAS AIDA Mini Comp 2022' } },
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
      STA: { pb: { value: '4:15', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYNB: { pb: { value: '88 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
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
      STA: { pb: { value: '5:55', date: '2022-04-23', venue: 'AIDA Finnish Super Open' } },
      DYN: { pb: { value: '200 m', date: '2022-04-23', venue: 'AIDA Finnish Super Open' } },
      DNF: { pb: { value: '157 m', date: '2022-04-24', venue: 'AIDA Finnish Super Open' } },
      CWTB: {
        pb: { value: '48 m', date: '2019-08-18', venue: 'AIDA Asikkala Depth Challenge 2019' },
      },
      CNF: {
        pb: { value: '52 m', date: '2021-10-22', venue: 'AIDA Triton Cup October- Calm Zone' },
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
      STA: { pb: { value: '4:03', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' } },
      DYN: {
        pb: {
          value: '100 m',
          date: '2015-03-28',
          venue: 'Svenska dam mästerskapen poolfridykning 2015',
        },
      },
      DNF: {
        pb: {
          value: '75 m',
          date: '2015-03-28',
          venue: 'Svenska dam mästerskapen poolfridykning 2015',
        },
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
      STA: { pb: { value: '6:09', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' } },
      DYN: { pb: { value: '77 m', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' } },
      DNF: { pb: { value: '61 m', date: '2015-02-07', venue: 'Riga Freediving Cup 2015 AIDA' } },
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
      },
      DYNB: {
        pb: { value: '56 m', date: '2024-02-04', venue: 'AIDA Lithuania Open Pool Championship' },
      },
      DNF: {
        pb: { value: '37 m', date: '2024-02-03', venue: 'AIDA Lithuania Open Pool Championship' },
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
      STA: { pb: { value: '3:04', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYNB: { pb: { value: '76 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
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
      STA: { pb: { value: '6:01', date: '2013-02-09', venue: 'Riga Freediving Cup 2013' } },
      DNF: { pb: { value: '90 m', date: '2013-02-09', venue: 'Riga Freediving Cup 2013' } },
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
      STA: { pb: { value: '3:27', date: '2006-04-14', venue: 'Finnish National Championships' } },
      DYN: { pb: { value: '62 m', date: '2006-04-14', venue: 'Finnish National Championships' } },
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
      },
      DYNB: {
        pb: { value: '154 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' },
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
      STA: { pb: { value: '5:49', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
      DYN: { pb: { value: '116 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
      DNF: { pb: { value: '60 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
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
      STA: { pb: { value: '6:21', date: '2022-04-23', venue: 'AIDA Finnish Super Open' } },
      DYN: { pb: { value: '150 m', date: '2022-04-23', venue: 'AIDA Finnish Super Open' } },
      DNF: { pb: { value: '130 m', date: '2019-04-20', venue: 'Finnish Freediving Open 2019' } },
      FIM: { pb: { value: '31 m', date: '2016-10-03', venue: 'Infinity Depth Games II' } },
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
      STA: { pb: { value: '7:05', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
      DYN: { pb: { value: '105 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
      DNF: { pb: { value: '79 m', date: '2010-02-13', venue: 'Riga Freediving Cup 2010' } },
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
      STA: { pb: { value: '3:00', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYN: { pb: { value: '50 m', date: '2026-02-15', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
      DYNB: { pb: { value: '49 m', date: '2026-02-14', venue: 'Riga Freediving Cup 2026 (AIDA)' } },
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
      },
      DYN: {
        pb: { value: '130 m', date: '2018-02-11', venue: 'RIGA FREEDIVING CUP 2018 WR status' },
      },
      DNF: {
        pb: { value: '62 m', date: '2018-02-10', venue: 'RIGA FREEDIVING CUP 2018 WR status' },
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
