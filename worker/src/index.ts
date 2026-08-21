import {
  applicationMail,
  clean,
  confirmationMail,
  corsHeaders,
  createToken,
  hashToken,
  isoIn,
  json,
  maskEmail,
  originRefused,
  preflight,
  purgeExpired,
  rateLimited,
  resultRedirect,
  sendMail,
  validate,
  verificationMail,
  verificationUrl,
  MAX_RESENDS,
  PURGE_HOURS,
  RATE_LIMIT_SECONDS,
  TOKEN_TTL_HOURS,
  type Application,
  type Env,
  type Locale,
} from './application';

/**
 * api.apneasport.ee - the AIDA Estonia athlete status application API.
 *
 * The website stays on GitHub Pages and calls this Worker cross-origin, so
 * every answer carries a strict CORS header for apneasport.ee and nothing
 * else. Only these three routes exist.
 */

interface PendingRow {
  id: string;
  status: string;
  locale: string;
  payload: string | null;
  created_at: string;
  expires_at: string;
}

interface ResendRow {
  id: string;
  payload: string | null;
  resend_count: number;
  last_sent_at: string;
}

function configured(env: Env): boolean {
  return Boolean(
    env.ATHLETE_APPLICATIONS && env.RESEND_API_KEY?.trim() && env.APPLICATION_FROM_EMAIL?.trim(),
  );
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function apply(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const db = env.ATHLETE_APPLICATIONS!;
  const payload = await readJson(request);
  if (!payload) return json({ error: 'invalid_request' }, { status: 400, headers: cors });

  // Spam trap. A bot that fills it gets a normal looking answer and no mail.
  if (clean(payload._confirm_url, 200).length > 0) {
    return json(
      { status: 'pending', email: maskEmail(clean(payload.email, 160)) },
      { headers: cors },
    );
  }

  const application = validate(payload);
  if (!application) return json({ error: 'invalid_application' }, { status: 400, headers: cors });
  if (await rateLimited(request, 'aida-apply')) {
    return json({ error: 'rate_limited' }, { status: 429, headers: cors });
  }

  await purgeExpired(db);

  const id = crypto.randomUUID();
  const token = createToken();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO athlete_applications
         (id, token_hash, status, locale, payload, created_at, expires_at, purge_at, last_sent_at)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      await hashToken(token),
      application.locale,
      JSON.stringify(application),
      now,
      isoIn(TOKEN_TTL_HOURS),
      isoIn(PURGE_HOURS),
      now,
    )
    .run();

  const sent = await sendMail(
    env,
    verificationMail(application, verificationUrl(env, token)),
    `verify:${id}:0`,
  );
  if (!sent) {
    // Nothing to confirm if the mail never left, so the row goes too.
    await db.prepare('DELETE FROM athlete_applications WHERE id = ?').bind(id).run();
    return json({ error: 'send_failed' }, { status: 502, headers: cors });
  }

  return json({ status: 'pending', id, email: maskEmail(application.email) }, { headers: cors });
}

async function verify(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
  const db = env.ATHLETE_APPLICATIONS!;
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (token.length < 20 || token.length > 200) return resultRedirect(env, 'et', 'invalid');

  const row = await db
    .prepare(
      `SELECT id, status, locale, payload, created_at, expires_at
         FROM athlete_applications WHERE token_hash = ?`,
    )
    .bind(await hashToken(token))
    .first<PendingRow>();
  if (!row) return resultRedirect(env, 'et', 'invalid');

  const locale: Locale = row.locale === 'en' ? 'en' : 'et';
  if (row.status !== 'pending') {
    // Confirmed, or already being forwarded by a parallel click.
    return resultRedirect(env, locale, 'already');
  }
  if (row.expires_at < new Date().toISOString()) return resultRedirect(env, locale, 'expired');

  const verifiedAt = new Date().toISOString();
  const claim = await db
    .prepare(
      `UPDATE athlete_applications SET status = 'sending', verified_at = ?
         WHERE id = ? AND status = 'pending'`,
    )
    .bind(verifiedAt, row.id)
    .run();
  if (claim.meta.changes !== 1) return resultRedirect(env, locale, 'already');

  const application = JSON.parse(row.payload ?? '{}') as Application;
  const forwarded = await sendMail(
    env,
    applicationMail(application, row.created_at, verifiedAt),
    `application:${row.id}`,
  );
  if (!forwarded) {
    // Hand the application back so the same link can be tried again.
    await db
      .prepare(
        `UPDATE athlete_applications SET status = 'pending', verified_at = NULL WHERE id = ?`,
      )
      .bind(row.id)
      .run();
    return resultRedirect(env, locale, 'failed');
  }

  // The League has it now, so the personal data leaves the database. What
  // stays is only enough to recognise a second click on the same link.
  await db
    .prepare(`UPDATE athlete_applications SET status = 'confirmed', payload = NULL WHERE id = ?`)
    .bind(row.id)
    .run();

  context.waitUntil(sendMail(env, confirmationMail(application), `receipt:${row.id}`));
  context.waitUntil(purgeExpired(db));
  return resultRedirect(env, locale, 'confirmed');
}

async function resend(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const db = env.ATHLETE_APPLICATIONS!;
  const payload = await readJson(request);
  const id = typeof payload?.id === 'string' ? payload.id : '';
  if (!/^[0-9a-f-]{36}$/.test(id)) {
    return json({ error: 'invalid_request' }, { status: 400, headers: cors });
  }
  if (await rateLimited(request, 'aida-resend')) {
    return json({ error: 'rate_limited' }, { status: 429, headers: cors });
  }

  const row = await db
    .prepare(
      `SELECT id, payload, resend_count, last_sent_at
         FROM athlete_applications WHERE id = ? AND status = 'pending'`,
    )
    .bind(id)
    .first<ResendRow>();
  // An unknown or already confirmed id says nothing back: there is nothing to
  // learn here about who applied.
  if (!row || !row.payload) return json({ status: 'pending' }, { headers: cors });

  if (row.resend_count >= MAX_RESENDS) {
    return json({ error: 'resend_limit' }, { status: 429, headers: cors });
  }
  if (Date.now() - new Date(row.last_sent_at).getTime() < RATE_LIMIT_SECONDS * 1000) {
    return json({ error: 'rate_limited' }, { status: 429, headers: cors });
  }

  // A fresh token replaces the old one, which stops working immediately.
  const token = createToken();
  const application = JSON.parse(row.payload) as Application;
  await db
    .prepare(
      `UPDATE athlete_applications
         SET token_hash = ?, expires_at = ?, resend_count = resend_count + 1, last_sent_at = ?
       WHERE id = ? AND status = 'pending'`,
    )
    .bind(await hashToken(token), isoIn(TOKEN_TTL_HOURS), new Date().toISOString(), id)
    .run();

  const sent = await sendMail(
    env,
    verificationMail(application, verificationUrl(env, token)),
    `verify:${id}:${row.resend_count + 1}`,
  );
  if (!sent) return json({ error: 'send_failed' }, { status: 502, headers: cors });

  return json({ status: 'pending', id, email: maskEmail(application.email) }, { headers: cors });
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') return preflight(request, env);
    if (originRefused(request, env)) return json({ error: 'origin_not_allowed' }, { status: 403 });

    // The verification link is opened by the applicant, not by the site.
    if (pathname === '/aida-athlete/verify' && request.method === 'GET') {
      if (!configured(env)) return resultRedirect(env, 'et', 'failed');
      return verify(request, env, context);
    }

    if (request.method === 'POST') {
      if (!configured(env)) return json({ error: 'unconfigured' }, { status: 503, headers: cors });
      if (pathname === '/aida-athlete/apply') return apply(request, env, cors);
      if (pathname === '/aida-athlete/resend') return resend(request, env, cors);
    }

    return json({ error: 'not_found' }, { status: 404, headers: cors });
  },
} satisfies ExportedHandler<Env>;
