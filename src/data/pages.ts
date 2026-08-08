import { externalLinks } from './external-links';
import type { Locale, RouteKey } from '../i18n/routes';

export type PageLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type PageSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
  links?: PageLink[];
};

export type StaticPage = {
  routeKey: RouteKey;
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  sections: PageSection[];
  placeholder?: boolean;
};

type LocalizedPage = Omit<StaticPage, 'routeKey' | 'locale'>;

function pair(routeKey: RouteKey, et: LocalizedPage, en: LocalizedPage): StaticPage[] {
  return [
    { routeKey, locale: 'et', ...et },
    { routeKey, locale: 'en', ...en },
  ];
}

const placeholderPairs: Array<{
  routeKey: RouteKey;
  et: { title: string; intro: string };
  en: { title: string; intro: string };
}> = [
  {
    routeKey: 'trainingCalendar',
    et: {
      title: 'Koolituste kalender',
      intro: 'Avaldatavad koolitused lisanduvad pärast kinnitamist.',
    },
    en: { title: 'Training calendar', intro: 'Publishable courses will be added after approval.' },
  },
  {
    routeKey: 'learningMaterials',
    et: { title: 'Õppematerjalid', intro: 'Kinnitatud õppematerjalid lisanduvad siia.' },
    en: { title: 'Learning materials', intro: 'Approved learning materials will be added here.' },
  },
  {
    routeKey: 'competition',
    et: { title: 'Võistlused', intro: 'EAPSL-i võistlusmoodul on avaldamiseks ette valmistatud.' },
    en: {
      title: 'Competition',
      intro: 'The EAPSL competition module is prepared for future publication.',
    },
  },
  {
    routeKey: 'competitionCalendar',
    et: { title: 'Võistluskalender', intro: 'Kinnitatud võistluskalender lisandub siia.' },
    en: {
      title: 'Competition calendar',
      intro: 'The approved competition calendar will be added here.',
    },
  },
  {
    routeKey: 'results',
    et: { title: 'Tulemused', intro: 'Kinnitatud võistlustulemused lisanduvad siia.' },
    en: { title: 'Results', intro: 'Approved competition results will be added here.' },
  },
  {
    routeKey: 'records',
    et: {
      title: 'Rekordid',
      intro: 'Rekordid avaldatakse pärast ametliku andmestiku kinnitamist.',
    },
    en: {
      title: 'Records',
      intro: 'Records will be published after the official dataset is approved.',
    },
  },
  {
    routeKey: 'nationalTeam',
    et: {
      title: 'Koondis',
      intro: 'Koondise koosseis ja valikuinfo lisanduvad pärast kinnitamist.',
    },
    en: {
      title: 'National team',
      intro: 'Team selection information will be added after approval.',
    },
  },
  {
    routeKey: 'rules',
    et: {
      title: 'Võistlusreeglid',
      intro: 'EAPSL-i kinnitatud reeglid lisanduvad dokumendiarhiivi.',
    },
    en: {
      title: 'Competition rules',
      intro: 'Approved EAPSL rules will be added to the document archive.',
    },
  },
];

const placeholderPages = placeholderPairs.flatMap(({ routeKey, et, en }) =>
  pair(
    routeKey,
    {
      eyebrow: 'Avaldamiseks valmis struktuur',
      title: et.title,
      intro: et.intro,
      placeholder: true,
      sections: [
        {
          title: 'Info lisandub pärast kinnitamist',
          paragraphs: [
            'Lehe route, kahekeelne seos ja sisustruktuur on olemas, kuid ametlikke kuupäevi, tulemusi, isikuid ega nõudeid ei ole leiutatud.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Publication-ready structure',
      title: en.title,
      intro: en.intro,
      placeholder: true,
      sections: [
        {
          title: 'Information will be added after approval',
          paragraphs: [
            'The route, bilingual relationship and content structure are ready, but no dates, results, people or requirements have been invented.',
          ],
        },
      ],
    },
  ),
);

export const staticPages: StaticPage[] = [
  ...pair(
    'sports',
    {
      eyebrow: 'Kolm veealust maailma',
      title: 'Spordialad',
      intro: 'Leia ala, mis ühendab sinu jaoks oskuse, liikumise ja teadliku ohutuse.',
      sections: [
        {
          title: 'Ohutus algab enne vette minekut',
          paragraphs: [
            'Kõik EAPSL-i alad eeldavad oskustele vastavat keskkonda, pädevat juhendamist ja valmisolekut tegutseda kõrvalekalde korral.',
          ],
          items: [
            'Ära harjuta hinge kinni hoidmist vees üksi.',
            'Alusta juhendatud treeningust ja kasuta alale sobivat varustust.',
            'Tutvu kinnitatud reeglitega enne võistlemist või sügavuse suurendamist.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Three underwater worlds',
      title: 'Sports',
      intro: 'Find the discipline that connects skill, movement and deliberate safety for you.',
      sections: [
        {
          title: 'Safety starts before entering the water',
          paragraphs: [
            'Every EAPSL sport requires an appropriate environment, competent supervision and readiness to respond when something changes.',
          ],
          items: [
            'Never practise breath-holding in water alone.',
            'Begin with supervised training and use discipline-appropriate equipment.',
            'Read approved rules before competing or increasing depth.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'league',
    {
      eyebrow: 'Avalikes huvides. Ausalt. Avatult.',
      title: 'Eesti Apneaspordi Liit',
      intro:
        'EAPSL on avalikes huvides ja heategevuslikul alusel tegutsev mittetulundusühing, mis arendab apneasporti ja sellega seotud liikumisharrastusi Eestis.',
      sections: [
        {
          title: 'Miks Liit tegutseb?',
          paragraphs: [
            'Liidu eesmärk on luua ohutud, ausad, üldkättesaadavad ja tulu mittetaotlevad tingimused sportimiseks, treeninguks, võistlusteks, koolitusteks ning rahvusvaheliseks esindamiseks.',
          ],
        },
        {
          title: 'Kuidas Liitu juhitakse?',
          paragraphs: [
            'Kõrgeim organ on liikmete üldkoosolek. Liitu juhib ja esindab ühe- kuni viieliikmeline juhatus; juhatuse esimees on president.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Public interest. Fairness. Openness.',
      title: 'Estonian Apnea Sports League',
      intro:
        'EAPSL is a non-profit association operating in the public interest and on a charitable basis to develop apnea sports and related physical activity in Estonia.',
      sections: [
        {
          title: 'Why does the League exist?',
          paragraphs: [
            'The League aims to create safe, fair, accessible and non-profit conditions for sport, training, competition, education and international representation.',
          ],
        },
        {
          title: 'How is the League governed?',
          paragraphs: [
            'The general meeting of members is the highest body. A board of one to five members manages and represents the League; its chair is the president.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'mission',
    {
      eyebrow: 'Põhikirjast tulenev identiteet',
      title: 'Eesmärgid ja olemus',
      intro:
        'EAPSL ühendab vabasukeldumise, allveevõitluse, merineitsispordi ning seotud allveespordialade arendajaid.',
      sections: [
        {
          title: 'Avalikes huvides tegevus',
          paragraphs: [
            'Tegevus on suunatud spordi, liikumisharrastuse, veeohutuse, tervislike eluviiside, noorte arengu, rahvusvahelise spordiesindatuse ning ausa ja ohutu keskkonna edendamisele.',
          ],
        },
        {
          title: 'Tulu ei ole eesmärk',
          paragraphs: [
            'Majandustegevusest saadud tulu kasutatakse ainult põhikirjaliste eesmärkide saavutamiseks. Tulu ega kasumit ei jaotata liikmete või juhtorganite vahel.',
          ],
        },
        {
          title: 'Sõltumatus ja koostöö',
          paragraphs: [
            'Liit on poliitiliselt ja religioosselt sõltumatu ning teeb koostööd avaliku sektori, spordiorganisatsioonide, haridus- ja teadusasutuste, ettevõtjate ning vabatahtlikega.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Identity grounded in the Statutes',
      title: 'Mission and identity',
      intro:
        'EAPSL brings together organisations developing freediving, underwater combat, mermaiding and related underwater sports.',
      sections: [
        {
          title: 'Public-interest activity',
          paragraphs: [
            'Its work advances sport, physical activity, water safety, healthy lifestyles, youth development, international representation and a safe, fair sporting environment.',
          ],
        },
        {
          title: 'Profit is not the purpose',
          paragraphs: [
            'Income from economic activity is used only for the objectives stated in the Statutes. Income and profit are not distributed to members or governing bodies.',
          ],
        },
        {
          title: 'Independence and cooperation',
          paragraphs: [
            'The League is politically and religiously independent and works with the public sector, sports organisations, education and research institutions, businesses and volunteers.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'aidaEstonia',
    {
      eyebrow: 'Eesti ühendus rahvusvahelise vabasukeldumisega',
      title: 'AIDA Estonia',
      intro:
        'EAPSL on AIDA Internationali liige ning tegutseb vabasukeldumise valdkonnas AIDA Estonia rollis.',
      sections: [
        {
          title: 'Rolli täpne ulatus',
          paragraphs: [
            'AIDA põhikiri, võistlus-, rekordi-, ohutus-, koolitus-, kohtuniku- ja dopinguvastased reeglid kohalduvad EAPSL-i vabasukeldumise tegevussuunale. Liidu teisi alasid juhitakse nende oma pädevate reeglite järgi.',
          ],
        },
        {
          title: 'Ametlikud AIDA allikad',
          paragraphs: [
            'Ajakohase info puhul kontrolli alati AIDA Internationali ametlikku allikat.',
          ],
          links: [
            { label: 'AIDA International', href: externalLinks.aida.home, external: true },
            { label: 'AIDA sündmused', href: externalLinks.aida.calendar, external: true },
            { label: 'AIDA koolitused', href: externalLinks.aida.education, external: true },
            { label: 'AIDA dokumendid', href: externalLinks.aida.documents, external: true },
          ],
        },
      ],
    },
    {
      eyebrow: 'Estonia in international freediving',
      title: 'AIDA Estonia',
      intro:
        'EAPSL is a member of AIDA International and acts as AIDA Estonia in the field of freediving.',
      sections: [
        {
          title: 'Exact scope of the role',
          paragraphs: [
            'AIDA statutes and competition, record, safety, education, judging and anti-doping rules apply to the EAPSL freediving programme. The League’s other sports are governed under their own competent rules.',
          ],
        },
        {
          title: 'Official AIDA sources',
          paragraphs: [
            'Always check an official AIDA International source for current information.',
          ],
          links: [
            { label: 'AIDA International', href: externalLinks.aida.home, external: true },
            { label: 'AIDA events', href: externalLinks.aida.calendar, external: true },
            { label: 'AIDA education', href: externalLinks.aida.education, external: true },
            { label: 'AIDA documents', href: externalLinks.aida.documents, external: true },
          ],
        },
      ],
    },
  ),
  ...pair(
    'governance',
    {
      eyebrow: 'Selged organid ja vastutus',
      title: 'Juhtimine',
      intro:
        'Liidu organid on üldkoosolek ja juhatus. Järelevalveks võib valida revidendi või määrata audiitori.',
      sections: [
        {
          title: 'Üldkoosolek',
          paragraphs: [
            'Üldkoosolek on Liidu kõrgeim organ. Igal liikmel on üks hääl ning otsustusprotsessid peavad olema demokraatlikud ja läbipaistvad.',
          ],
        },
        {
          title: 'Juhatus ja president',
          paragraphs: [
            'Juhatuses on üks kuni viis liiget, kelle üldkoosolek valib kuni neljaks aastaks. Presidendi valib üldkoosolek juhatuse liikmete hulgast.',
            'Avaldatavate juhatuse liikmete ja komisjonide nimekiri lisandub pärast kinnitamist.',
          ],
        },
        {
          title: 'Komisjonid',
          paragraphs: [
            'Juhatus võib moodustada tehnilise, ohutus-, kohtunike, treenerite, sportlaste ning eetika- ja distsiplinaarkomisjoni. Konkreetseid koosseise ei ole veel avaldamiseks kinnitatud.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Clear bodies and accountability',
      title: 'Governance',
      intro:
        'The League’s bodies are the general meeting and the board. An internal auditor or external auditor may provide oversight.',
      sections: [
        {
          title: 'General meeting',
          paragraphs: [
            'The general meeting is the highest body. Each member has one vote, and decision-making must be democratic and transparent.',
          ],
        },
        {
          title: 'Board and president',
          paragraphs: [
            'The board has one to five members elected by the general meeting for up to four years. The general meeting elects the president from among the board members.',
            'The publishable list of board and committee members will be added after approval.',
          ],
        },
        {
          title: 'Committees',
          paragraphs: [
            'The board may form technical, safety, judging, coaching, athlete, ethics and disciplinary committees. No specific membership has yet been approved for publication.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'memberClubs',
    {
      eyebrow: 'Liitu kannavad juriidilistest isikutest liikmed',
      title: 'Liikmesklubid',
      intro:
        'Liikmeskonna moodustavad eelkõige spordiklubid, spordiseltsid ja teised EAPSL-i alasid arendavad organisatsioonid.',
      sections: [
        {
          title: 'Skaleeruv liikmesklubide vaade',
          paragraphs: [
            'MVP-s on üks kinnitatud klubiviide. Lahendus on ette valmistatud täiendavate klubide lisamiseks ilma lehestruktuuri muutmata.',
          ],
        },
      ],
    },
    {
      eyebrow: 'The League is carried by legal-entity members',
      title: 'Member clubs',
      intro:
        'Membership primarily consists of sports clubs, sports associations and other organisations developing EAPSL sports.',
      sections: [
        {
          title: 'A scalable member view',
          paragraphs: [
            'The MVP contains one approved club reference. The structure is ready for more clubs without redesigning the page.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'membership',
    {
      eyebrow: 'Liikmeks saavad juriidilised isikud',
      title: 'Liikmeks astumine',
      intro:
        'Liikmeks võivad olla Eestis või välisriigis registreeritud juriidilised isikud, kes tunnustavad põhikirja ja Liidu eesmärke.',
      sections: [
        {
          title: 'Põhikirjaline menetlus',
          paragraphs: [
            'Taotleja esitab juhatusele kirjalikku taasesitamist võimaldavas vormis avalduse. Juhatus otsustab vastuvõtmise 60 kalendripäeva jooksul.',
            'Keeldumise korral võib taotleja 30 kalendripäeva jooksul nõuda, et küsimuse otsustaks üldkoosolek.',
          ],
        },
        {
          title: 'Vormid ja tasud',
          paragraphs: [
            'Liitumisvorm, nõutavad lisad ning kehtivad sisseastumis- ja liikmemaksud lisanduvad pärast pädeva organi kinnitust.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Membership is open to legal entities',
      title: 'Membership',
      intro:
        'Legal entities registered in Estonia or abroad may apply if they recognise the Statutes and the League’s objectives.',
      sections: [
        {
          title: 'Procedure in the Statutes',
          paragraphs: [
            'The applicant submits a reproducible written application to the board. The board decides within 60 calendar days.',
            'If refused, the applicant may ask within 30 calendar days for the general meeting to decide.',
          ],
        },
        {
          title: 'Forms and fees',
          paragraphs: [
            'The application form, required attachments and current entrance and membership fees will be added after approval by the competent body.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'safetyIntegrity',
    {
      eyebrow: 'Ohutus ei ole footnote',
      title: 'Ohutus ja aus sport',
      intro:
        'EAPSL edendab ohutust, spordieetikat, antidopingut, laste kaitset, väärkohtlemise ennetamist ja manipulatsioonivastaseid põhimõtteid.',
      sections: [
        {
          title: 'Põhikirjas nõutud ohutuselemendid',
          paragraphs: ['Kinnitatavad ohutusreeglid peavad arvestama iga ala eripära.'],
          items: [
            'treeningu ja võistluse järelevalve;',
            'pädeva juhendaja ning ohutuspersonali roll;',
            'esmaabi, hapniku- ja päästevahendite olemasolu;',
            'tervise- ja oskuseeldused ning juhtumitest teatamine.',
          ],
        },
        {
          title: 'Kinnitatavad korrad',
          paragraphs: [
            'EAPSL-i eetikakoodeks, ohutusreeglid ning distsiplinaar- ja vaidemenetluse kord lisanduvad pärast kinnitamist.',
          ],
          links: [
            { label: 'AIDA antidoping', href: externalLinks.aida.antidoping, external: true },
          ],
        },
      ],
    },
    {
      eyebrow: 'Safety is not a footnote',
      title: 'Safety and integrity',
      intro:
        'EAPSL promotes safety, ethics, anti-doping, child protection, safeguarding and protection against competition manipulation.',
      sections: [
        {
          title: 'Safety elements required by the Statutes',
          paragraphs: [
            'Approved safety rules must reflect the specific characteristics of each sport.',
          ],
          items: [
            'supervision of training and competition;',
            'the role of competent instructors and safety personnel;',
            'first aid, oxygen and rescue equipment;',
            'health and skill prerequisites and incident reporting.',
          ],
        },
        {
          title: 'Policies awaiting approval',
          paragraphs: [
            'The EAPSL code of ethics, safety rules, and disciplinary and appeal procedures will be added after approval.',
          ],
          links: [
            { label: 'AIDA anti-doping', href: externalLinks.aida.antidoping, external: true },
          ],
        },
      ],
    },
  ),
  ...pair(
    'coaches',
    {
      eyebrow: 'Vali õige teekond',
      title: 'Treenerid ja koolitused',
      intro:
        'Eristame Eesti treenerikutset, AIDA koolitussüsteemi ja EAPSL-i enda tulevasi koolitusi.',
      sections: [
        {
          title: 'Kolm teekonda',
          paragraphs: [
            'Vali eesmärk ning kontrolli enne taotlemist alati ajakohast ametlikku allikat.',
          ],
          items: [
            'Eesti treenerikutse või selle kohta ametliku info leidmine',
            'AIDA instruktoriks või ohutusspetsialistiks õppimine',
            'EAPSL-i koolituste ja õppematerjalide leidmine',
          ],
        },
      ],
    },
    {
      eyebrow: 'Choose the right pathway',
      title: 'Coaches and education',
      intro:
        'We distinguish the Estonian professional qualification, the AIDA education system and future EAPSL courses.',
      sections: [
        {
          title: 'Three pathways',
          paragraphs: [
            'Choose your objective and always verify a current official source before applying.',
          ],
          items: [
            'Find official information about an Estonian coaching qualification',
            'Become an AIDA instructor or safety specialist',
            'Find EAPSL courses and learning materials',
          ],
        },
      ],
    },
  ),
  ...pair(
    'qualification',
    {
      eyebrow: 'Staatus vajab ametlikku kinnitust',
      title: 'Treenerikutse info',
      intro: 'EAPSL-i rolli Eesti treenerikutse süsteemis ei ole veel avaldamiseks kinnitatud.',
      placeholder: true,
      sections: [
        {
          title: 'Enne avaldamist vajalik',
          paragraphs: [
            'Kutseandja, hindamiskomisjon, tasemed, nõuded, tähtajad, tasud ja vormid lisanduvad ainult ametliku allika põhjal.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Status requires official confirmation',
      title: 'Professional qualification',
      intro:
        'EAPSL’s role in the Estonian coaching qualification system is not yet approved for publication.',
      placeholder: true,
      sections: [
        {
          title: 'Required before publication',
          paragraphs: [
            'The awarding body, assessment committee, levels, requirements, deadlines, fees and forms will be added only from an official source.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'aidaEducation',
    {
      eyebrow: 'Rahvusvaheline vabasukeldumise õpitee',
      title: 'AIDA koolitustee',
      intro:
        'AIDA avaldab oma kursuste, ohutuskvalifikatsioonide, instruktori- ja kohtunikutee ajakohase info ametlikus keskkonnas.',
      sections: [
        {
          title: 'Kontrolli ametlikku allikat',
          paragraphs: [
            'Koolituste tasemed, eeldused ja õigused võivad muutuda. EAPSL-i veeb annab teekonnale sissejuhatuse, kuid ei dubleeri muutuvat reeglistikku.',
          ],
          links: [
            {
              label: 'AIDA Freediving Courses',
              href: externalLinks.aida.education,
              external: true,
            },
          ],
        },
      ],
    },
    {
      eyebrow: 'The international freediving pathway',
      title: 'AIDA education pathway',
      intro:
        'AIDA publishes current information about courses, safety qualifications, instructors and judges through its official platform.',
      sections: [
        {
          title: 'Check the official source',
          paragraphs: [
            'Levels, prerequisites and privileges may change. The EAPSL site introduces the pathway but does not duplicate changing rules.',
          ],
          links: [
            {
              label: 'AIDA Freediving Courses',
              href: externalLinks.aida.education,
              external: true,
            },
          ],
        },
      ],
    },
  ),
  ...pair(
    'contact',
    {
      eyebrow: 'Kinnitatud avalik kontakt',
      title: 'Kontakt',
      intro:
        'Võta EAPSL-iga ühendust üldküsimustes. Valdkondlikud kontaktid lisanduvad pärast kinnitamist.',
      sections: [
        {
          title: 'Eesti Apneaspordi Liit',
          paragraphs: [
            'Registrikood 80672860',
            'Kauri tee 12-5, Alliku küla, Saue vald, Harju maakond 76403',
            'E-post: estonia@apneasport.ee',
            'Telefon: +372 510 5573',
          ],
          links: [
            {
              label: 'Eesti spordiregistri kanne',
              href: externalLinks.sportsRegistry,
              external: true,
            },
          ],
        },
      ],
    },
    {
      eyebrow: 'Verified public contact',
      title: 'Contact',
      intro:
        'Contact EAPSL for general enquiries. Topic-specific contacts will be added after approval.',
      sections: [
        {
          title: 'Estonian Apnea Sports League',
          paragraphs: [
            'Registry code 80672860',
            'Kauri tee 12-5, Alliku village, Saue Parish, Harju County 76403, Estonia',
            'Email: estonia@apneasport.ee',
            'Phone: +372 510 5573',
          ],
          links: [
            {
              label: 'Estonian Sports Register entry',
              href: externalLinks.sportsRegistry,
              external: true,
            },
          ],
        },
      ],
    },
  ),
  ...pair(
    'privacy',
    {
      eyebrow: 'Privaatsus tegeliku lahenduse põhjal',
      title: 'Privaatsus',
      intro: 'MVP ei kasuta analüütikat, reklaamijälgimist ega veebipõhist kontaktivormi.',
      sections: [
        {
          title: 'Milliseid andmeid veeb töötleb?',
          paragraphs: [
            'Staatiline veeb ei kogu EAPSL-i andmebaasi külastaja isikuandmeid. Majutusteenuse tehnilised turva- ja ligipääsulogid võivad sisaldada IP-aadressi ning brauseri päringu metaandmeid vastavalt teenusepakkuja tingimustele.',
            'Kui saadad e-kirja või helistad, töötleb EAPSL sinu antud kontaktandmeid päringule vastamiseks.',
          ],
        },
        {
          title: 'Vastutav töötleja',
          paragraphs: [
            'Eesti Apneaspordi Liit, registrikood 80672860. Privaatsusküsimused: estonia@apneasport.ee.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Privacy based on the actual implementation',
      title: 'Privacy',
      intro: 'The MVP uses no analytics, advertising tracking or web contact form.',
      sections: [
        {
          title: 'What data does the website process?',
          paragraphs: [
            'The static website does not collect visitor personal data into an EAPSL database. Technical security and access logs held by the hosting provider may contain IP addresses and request metadata under the provider’s terms.',
            'If you email or call, EAPSL processes the contact details you provide to answer your enquiry.',
          ],
        },
        {
          title: 'Controller',
          paragraphs: [
            'Estonian Apnea Sports League, registry code 80672860. Privacy enquiries: estonia@apneasport.ee.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'cookies',
    {
      eyebrow: 'Minimaalne tehniline jalajälg',
      title: 'Küpsised',
      intro: 'MVP ei sea EAPSL-i enda analüütika-, turundus- ega eelistusküpsiseid.',
      sections: [
        {
          title: 'Kolmandad osapooled',
          paragraphs: [
            'Facebooki SDK-d ega embed’i esimesel laadimisel ei käivitata. Sotsiaalmeedia link avaneb ainult siis, kui kinnitatud keskkonnamuutuja on seadistatud ja kasutaja valib lingi.',
          ],
        },
      ],
    },
    {
      eyebrow: 'A minimal technical footprint',
      title: 'Cookies',
      intro: 'The MVP sets no EAPSL analytics, marketing or preference cookies.',
      sections: [
        {
          title: 'Third parties',
          paragraphs: [
            'No Facebook SDK or embed loads on the initial visit. A social link is available only when the approved environment variable is configured and the visitor chooses to follow it.',
          ],
        },
      ],
    },
  ),
  ...pair(
    'accessibility',
    {
      eyebrow: 'Eesmärk WCAG 2.2 AA',
      title: 'Ligipääsetavus',
      intro:
        'Sait on kavandatud semantiliseks, klaviatuuriga kasutatavaks ja liikumise vähendamise eelistust austavaks.',
      sections: [
        {
          title: 'Lahenduse omadused',
          paragraphs: [
            'MVP sisaldab nähtavat fookust, skip-linki, 44 × 44 px puutealasid, korrektset keeleatribuuti ja reduced-motion fallback’i.',
          ],
        },
        {
          title: 'Tagasiside',
          paragraphs: [
            'Kui leiad ligipääsetavuse takistuse, kirjuta estonia@apneasport.ee ning lisa probleemi lehe aadress.',
          ],
        },
      ],
    },
    {
      eyebrow: 'Target: WCAG 2.2 AA',
      title: 'Accessibility',
      intro:
        'The site is designed to be semantic, keyboard-accessible and respectful of reduced-motion preferences.',
      sections: [
        {
          title: 'Implementation features',
          paragraphs: [
            'The MVP includes visible focus, a skip link, 44 × 44 px touch targets, correct language attributes and a reduced-motion fallback.',
          ],
        },
        {
          title: 'Feedback',
          paragraphs: [
            'If you encounter an accessibility barrier, email estonia@apneasport.ee and include the page address.',
          ],
        },
      ],
    },
  ),
  ...placeholderPages,
];

export function pagesFor(locale: Locale): StaticPage[] {
  return staticPages.filter((page) => page.locale === locale);
}
