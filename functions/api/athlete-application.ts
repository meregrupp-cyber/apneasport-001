/**
 * AIDA Estonia athlete status application.
 *
 * `clean`, `validate` and `emailBody` are exported for the unit tests; the
 * Pages runtime only ever calls `onRequestPost`.
 *
 * Takes the application from the freediving page, validates it again on the
 * server and mails it to the League. The recipient and the citizenship are
 * fixed here: whatever the browser sends for them is ignored. Nothing about
 * the applicant is logged or stored - the payload only travels on to the mail
 * API, which needs `RESEND_API_KEY` and `APPLICATION_FROM_EMAIL` as
 * Cloudflare secrets.
 */

interface Env {
  RESEND_API_KEY?: string;
  APPLICATION_FROM_EMAIL?: string;
}

/** Never taken from the request: the League decides who receives this. */
const RECIPIENT = 'estonia@apneasport.ee';
/** AIDA Estonia registers Estonian citizens, so this is not a user input. */
const CITIZENSHIP = 'Estonia';
export const APPLICATION_TYPES = {
  activate: 'Activate AIDA Estonia athlete status (EUR 35, first registration)',
  renew: 'Renew AIDA Estonia athlete licence (EUR 15 / year)',
  removal: 'Remove athlete records from the AIDA Estonia website',
} as const;
const CONSENT_KEYS = ['citizen', 'dataProcessing', 'publishResults', 'publishStatus'] as const;
/** One application per minute per address is plenty for a real applicant. */
const RATE_LIMIT_SECONDS = 60;

type ApplicationType = keyof typeof APPLICATION_TYPES;

interface Application {
  locale: 'et' | 'en';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  aidaProfile: string;
  applicationType: ApplicationType;
}

function json(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(body), { ...init, headers });
}

/** Drops control characters, so no field can inject a header or a new line. */
export function clean(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return (
    value
      // Control characters are exactly what must go: they are how a header or a
      // second recipient would be smuggled into the mail.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
      .trim()
      .slice(0, maxLength)
  );
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && value.length <= 160;
}

function isPhone(value: string): boolean {
  return /^[+0-9][0-9 ()-]{5,31}$/.test(value);
}

function isPastDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || !date.toISOString().startsWith(value)) return false;
  return date.getTime() <= Date.now() && date.getUTCFullYear() >= 1900;
}

export function validate(payload: Record<string, unknown>): Application | null {
  const application: Application = {
    locale: payload.locale === 'en' ? 'en' : 'et',
    firstName: clean(payload.firstName, 80),
    lastName: clean(payload.lastName, 80),
    dateOfBirth: clean(payload.dateOfBirth, 10),
    email: clean(payload.email, 160),
    phone: clean(payload.phone, 32),
    aidaProfile: clean(payload.aidaProfile, 200),
    applicationType: clean(payload.applicationType, 20) as ApplicationType,
  };

  const consents = (payload.consents ?? {}) as Record<string, unknown>;
  const allConsentsGiven = CONSENT_KEYS.every((key) => consents[key] === true);

  const valid =
    application.firstName.length > 0 &&
    application.lastName.length > 0 &&
    isPastDate(application.dateOfBirth) &&
    isEmail(application.email) &&
    isPhone(application.phone) &&
    application.applicationType in APPLICATION_TYPES &&
    allConsentsGiven;

  return valid ? application : null;
}

export function emailBody(application: Application, submittedAt: string): string {
  return [
    `Application language: ${application.locale.toUpperCase()}`,
    `Eesnimi / First name: ${application.firstName}`,
    `Perekonnanimi / Last name: ${application.lastName}`,
    `Sünniaeg / Date of birth: ${application.dateOfBirth}`,
    `Kodakondsus / Citizenship: ${CITIZENSHIP}`,
    `Email: ${application.email}`,
    `Telefon / Phone: ${application.phone}`,
    `AIDA profile / AIDA ID: ${application.aidaProfile || '-'}`,
    `Taotluse tüüp / Application type: ${APPLICATION_TYPES[application.applicationType]}`,
    '',
    'Kinnitused / Confirmations:',
    '- Estonian citizen and information correct: yes',
    '- Personal data processing for the application: yes',
    '- Publishing name, results, personal bests and rankings: yes',
    '- Publishing athlete licence status (ACTIVE / INACTIVE): yes',
    '',
    `Submitted: ${submittedAt}`,
    'Sent by the application form on apneasport.ee.',
  ].join('\n');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.RESEND_API_KEY?.trim();
  const from = context.env.APPLICATION_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return json({ error: 'unconfigured' }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'invalid_request' }, { status: 400 });
  }

  // Spam trap. A bot that fills it gets a normal looking answer and no mail.
  if (clean(payload._confirm_url, 200).length > 0) {
    return json({ status: 'ok' });
  }

  const application = validate(payload);
  if (!application) {
    return json({ error: 'invalid_application' }, { status: 400 });
  }

  // Light rate limiting on the shared cache. The key carries its own time
  // window, so the limit lifts on schedule even where the cache keeps an
  // entry longer than its max-age.
  const address = context.request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const window = Math.floor(Date.now() / (RATE_LIMIT_SECONDS * 1000));
  const cache = (caches as CacheStorage & { default: Cache }).default;
  const rateKey = new Request(
    `https://rate-limit.invalid/athlete-application/${encodeURIComponent(address)}/${window}`,
  );
  if (await cache.match(rateKey)) {
    return json({ error: 'rate_limited' }, { status: 429 });
  }
  context.waitUntil(
    cache.put(
      rateKey,
      new Response('1', { headers: { 'Cache-Control': `max-age=${RATE_LIMIT_SECONDS * 2}` } }),
    ),
  );

  const submittedAt = new Date().toISOString();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [RECIPIENT],
      reply_to: application.email,
      subject: `AIDA Estonia athlete status application - ${application.firstName} ${application.lastName}`,
      text: emailBody(application, submittedAt),
    }),
  });

  if (!response.ok) {
    // Only the upstream status is worth knowing; the application itself is
    // personal data and never reaches a log.
    console.error(`Athlete application mail failed with ${response.status}`);
    return json({ error: 'send_failed' }, { status: 502 });
  }

  return json({ status: 'ok' });
};
