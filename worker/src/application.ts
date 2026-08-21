/**
 * AIDA Estonia athlete status application: the logic behind api.apneasport.ee.
 *
 * The website itself stays on GitHub Pages; this Worker is only the API. An
 * application is forwarded to the League after the applicant has confirmed
 * their own email address, so a submission waits in D1 until the verification
 * link is opened. The recipient and the citizenship are fixed here and never
 * read from a request. Personal data is dropped from the row as soon as the
 * application has been forwarded.
 */

export interface Env {
  ATHLETE_APPLICATIONS?: D1Database;
  /** The only secret. Everything else below is plain configuration. */
  RESEND_API_KEY?: string;
  APPLICATION_FROM_EMAIL?: string;
  /** Where the browser is sent back to after verifying, and the CORS origin. */
  SITE_ORIGIN?: string;
  /** This Worker's own public origin, used to build the link that is mailed. */
  API_ORIGIN?: string;
  /** Comma separated; the site origin is always allowed on top of these. */
  ALLOWED_ORIGINS?: string;
  /** Overrides the mail API. Unset in production; used by local end to end runs. */
  MAIL_API_URL?: string;
}

/** Never taken from the request: the League decides who receives this. */
export const RECIPIENT = 'estonia@apneasport.ee';
/** AIDA Estonia registers Estonian citizens, so this is not a user input. */
export const CITIZENSHIP = 'Estonia';
export const APPLICATION_TYPES = {
  activate: 'Activate AIDA Estonia athlete status (EUR 35, first registration)',
  renew: 'Renew AIDA Estonia athlete licence (EUR 15 / year)',
  removal: 'Remove athlete records from the AIDA Estonia website',
} as const;
export const CONSENT_KEYS = [
  'citizen',
  'dataProcessing',
  'publishResults',
  'publishStatus',
] as const;
/** The confirmation link is valid for a day; the row is dropped after two. */
export const TOKEN_TTL_HOURS = 24;
export const PURGE_HOURS = 48;
/** One submission or resend per minute per address. */
export const RATE_LIMIT_SECONDS = 60;
export const MAX_RESENDS = 3;

export type ApplicationType = keyof typeof APPLICATION_TYPES;
export type Locale = 'et' | 'en';

export interface Application {
  locale: Locale;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  aidaProfile: string;
  applicationType: ApplicationType;
}

export function json(body: unknown, init: ResponseInit = {}): Response {
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

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && value.length <= 160;
}

export function isPhone(value: string): boolean {
  return /^[+0-9][0-9 ()-]{5,31}$/.test(value);
}

export function isPastDate(value: string): boolean {
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

/** `taavi@example.com` becomes `ta***@example.com` for the waiting screen. */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return '';
  return `${name.slice(0, 2)}***@${domain}`;
}

/** 32 random bytes, URL safe. The plain token only ever exists in the mail. */
export function createToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Only the hash is stored, so a database copy cannot confirm applications. */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Built from configuration rather than from the incoming request, so the link
 * that lands in someone's inbox is always the public https address.
 */
export function verificationUrl(env: Env, token: string): string {
  const url = new URL(
    '/aida-athlete/verify',
    env.API_ORIGIN?.trim() || 'https://api.apneasport.ee',
  );
  url.searchParams.set('token', token);
  return url.toString();
}

interface Mail {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * `idempotencyKey` lets Resend collapse a repeated send: a retry after a
 * network hiccup delivers the same mail once, not twice.
 */
export async function sendMail(env: Env, mail: Mail, idempotencyKey?: string): Promise<boolean> {
  const response = await fetch(env.MAIL_API_URL?.trim() || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY ?? ''}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: env.APPLICATION_FROM_EMAIL,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.html ? { html: mail.html } : {}),
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });
  if (!response.ok) {
    // Only the upstream status is worth knowing; the application itself is
    // personal data and never reaches a log.
    console.error(`AIDA application mail failed with ${response.status}`);
  }
  return response.ok;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** The confirmation mail the applicant has to act on. */
export function verificationMail(application: Application, url: string): Mail {
  const et = application.locale === 'et';
  const button = et ? 'KINNITAN AVALDUSE' : 'CONFIRM APPLICATION';
  const lines = et
    ? [
        `Tere, ${application.firstName}`,
        '',
        'Said selle kirja, sest esitasid AIDA Estonia sportlasstaatuse avalduse.',
        '',
        'Avalduse edastamiseks AIDA Estoniale kinnita oma e-posti aadress ja avaldus:',
        '',
        url,
        '',
        'Kinnituslink kehtib 24 tundi.',
        '',
        'Kui sina seda avaldust ei esitanud, ära vajuta lingile. Kinnitamata avaldust AIDA Estoniale ei edastata.',
        '',
        'AIDA Estonia',
        'Estonian Apnea Sports League (EAPSL)',
        'apneasport.ee',
      ]
    : [
        `Hello ${application.firstName},`,
        '',
        'You received this email because an AIDA Estonia athlete status application was submitted using this email address.',
        '',
        'To forward the application to AIDA Estonia, please verify your email address and confirm the application:',
        '',
        url,
        '',
        'The confirmation link is valid for 24 hours.',
        '',
        'If you did not submit this application, do not click the link. An unconfirmed application will not be forwarded to AIDA Estonia.',
        '',
        'AIDA Estonia',
        'Estonian Apnea Sports League (EAPSL)',
        'apneasport.ee',
      ];

  const html = lines
    .map((line) => {
      if (line === url) {
        return `<p style="margin:24px 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#07345f;color:#ffffff;font-weight:700;text-decoration:none">${button}</a></p>`;
      }
      return line ? `<p style="margin:0 0 12px">${escapeHtml(line)}</p>` : '';
    })
    .join('\n');

  return {
    to: application.email,
    subject: et
      ? 'Kinnita oma AIDA Estonia sportlasstaatuse avaldus'
      : 'Confirm your AIDA Estonia athlete status application',
    text: lines.join('\n'),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#071822">${html}</div>`,
  };
}

/** The application itself, sent to the League only after verification. */
export function applicationMail(
  application: Application,
  submittedAt: string,
  verifiedAt: string,
): Mail {
  return {
    to: RECIPIENT,
    replyTo: application.email,
    subject: `AIDA Estonia athlete status application - ${application.firstName} ${application.lastName}`,
    text: [
      'Email verified: YES',
      `Verified at: ${verifiedAt}`,
      '',
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
      `Submitted at: ${submittedAt}`,
      `Email verified at: ${verifiedAt}`,
      'Sent by the application form on apneasport.ee.',
    ].join('\n'),
  };
}

/** The short receipt the applicant gets once the League has the application. */
export function confirmationMail(application: Application): Mail {
  const et = application.locale === 'et';
  return {
    to: application.email,
    subject: et
      ? 'AIDA Estonia avaldus on kinnitatud'
      : 'Your AIDA Estonia application has been confirmed',
    text: (et
      ? [
          `Tere, ${application.firstName}`,
          '',
          'Sinu e-posti aadress on kinnitatud ja AIDA Estonia sportlasstaatuse avaldus on edukalt edastatud.',
          '',
          'AIDA Estonia võtab vajadusel sinuga ühendust.',
          '',
          'AIDA Estonia',
          'Estonian Apnea Sports League (EAPSL)',
        ]
      : [
          `Hello ${application.firstName},`,
          '',
          'Your email address has been verified and your AIDA Estonia athlete status application has been successfully forwarded.',
          '',
          'AIDA Estonia will contact you if any further information is required.',
          '',
          'AIDA Estonia',
          'Estonian Apnea Sports League (EAPSL)',
        ]
    ).join('\n'),
  };
}

export type ResultKind = 'confirmed' | 'already' | 'expired' | 'invalid' | 'failed';

const SITE_PATHS: Record<Locale, string> = {
  et: '/spordialad/vabasukeldumine/',
  en: '/en/sports/freediving/',
};

export function siteOrigin(env: Env): string {
  return env.SITE_ORIGIN?.trim() || 'https://apneasport.ee';
}

/**
 * After verifying, the browser goes back to the website, which shows the
 * message. The token is dropped here on purpose: it must not survive in the
 * address bar or in history, and the redirect carries the outcome and nothing
 * about the applicant.
 */
export function resultRedirect(env: Env, locale: Locale, kind: ResultKind): Response {
  const url = new URL(SITE_PATHS[locale], siteOrigin(env));
  url.searchParams.set('application', kind);
  url.hash = locale === 'et' ? 'sportlased-ja-rekordid' : 'athletes-and-records';
  return new Response(null, {
    status: 303,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

function allowedOrigins(env: Env): string[] {
  const extra = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return [siteOrigin(env), ...extra];
}

/** Echoes the origin only when it is on the list. Never a wildcard. */
export function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin');
  if (!origin || !allowedOrigins(env).includes(origin)) return {};
  return { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };
}

/**
 * A request without an Origin header is not a cross-site browser request -
 * that is a plain client, which the validation and rate limits already cover.
 * A browser request from an origin that is not ours is refused outright.
 */
export function originRefused(request: Request, env: Env): boolean {
  const origin = request.headers.get('Origin');
  return Boolean(origin) && !allowedOrigins(env).includes(origin as string);
}

export function preflight(request: Request, env: Env): Response {
  const headers = corsHeaders(request, env);
  if (!headers['Access-Control-Allow-Origin']) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/** Light rate limiting on the shared cache, keyed by its own time window. */
export async function rateLimited(request: Request, scope: string): Promise<boolean> {
  const address = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const window = Math.floor(Date.now() / (RATE_LIMIT_SECONDS * 1000));
  const cache = (caches as CacheStorage & { default: Cache }).default;
  const key = new Request(
    `https://rate-limit.invalid/${scope}/${encodeURIComponent(address)}/${window}`,
  );
  if (await cache.match(key)) return true;
  await cache.put(
    key,
    new Response('1', { headers: { 'Cache-Control': `max-age=${RATE_LIMIT_SECONDS * 2}` } }),
  );
  return false;
}

/**
 * Unconfirmed applications disappear on their own: every request drops the
 * rows whose purge time has passed, so no scheduled job is needed.
 */
export async function purgeExpired(db: D1Database): Promise<void> {
  await db
    .prepare('DELETE FROM athlete_applications WHERE purge_at < ?')
    .bind(new Date().toISOString())
    .run();
}

export function isoIn(hours: number): string {
  return new Date(Date.now() + hours * 3600_000).toISOString();
}
