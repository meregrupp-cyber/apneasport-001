import {
  createToken,
  hashToken,
  isoIn,
  json,
  maskEmail,
  rateLimited,
  sendMail,
  verificationMail,
  verificationUrl,
  MAX_RESENDS,
  RATE_LIMIT_SECONDS,
  TOKEN_TTL_HOURS,
  type Application,
  type Env,
} from './_shared';

interface Row {
  id: string;
  payload: string | null;
  resend_count: number;
  last_sent_at: string;
}

/**
 * Sends the confirmation mail again for an application that is still waiting.
 * It works from the opaque row id the browser was handed, never from an email
 * address, so it cannot be used to find out who has applied.
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = context.env.ATHLETE_APPLICATIONS;
  if (!db || !context.env.RESEND_API_KEY?.trim() || !context.env.APPLICATION_FROM_EMAIL?.trim()) {
    return json({ error: 'unconfigured' }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'invalid_request' }, { status: 400 });
  }

  const id = typeof payload.id === 'string' ? payload.id : '';
  if (!/^[0-9a-f-]{36}$/.test(id)) {
    return json({ error: 'invalid_request' }, { status: 400 });
  }

  if (await rateLimited(context.request, 'aida-resend')) {
    return json({ error: 'rate_limited' }, { status: 429 });
  }

  const row = await db
    .prepare(
      `SELECT id, payload, resend_count, last_sent_at
         FROM athlete_applications WHERE id = ? AND status = 'pending'`,
    )
    .bind(id)
    .first<Row>();
  // An unknown or already confirmed id says nothing back: there is nothing to
  // learn here about who applied.
  if (!row || !row.payload) {
    return json({ status: 'pending' });
  }

  if (row.resend_count >= MAX_RESENDS) {
    return json({ error: 'resend_limit' }, { status: 429 });
  }
  if (Date.now() - new Date(row.last_sent_at).getTime() < RATE_LIMIT_SECONDS * 1000) {
    return json({ error: 'rate_limited' }, { status: 429 });
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
    context.env,
    verificationMail(application, verificationUrl(context.request.url, token)),
  );
  if (!sent) return json({ error: 'send_failed' }, { status: 502 });

  return json({ status: 'pending', id, email: maskEmail(application.email) });
};
