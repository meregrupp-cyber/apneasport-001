import {
  clean,
  createToken,
  hashToken,
  isoIn,
  json,
  maskEmail,
  purgeExpired,
  rateLimited,
  sendMail,
  validate,
  verificationMail,
  verificationUrl,
  PURGE_HOURS,
  TOKEN_TTL_HOURS,
  type Env,
} from './_shared';

/**
 * First step of the application: the form is validated and parked in D1, and
 * the applicant gets a confirmation mail. Nothing reaches the League until the
 * link in that mail is opened.
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

  // Spam trap. A bot that fills it gets a normal looking answer and no mail.
  if (clean(payload._confirm_url, 200).length > 0) {
    return json({ status: 'pending', email: maskEmail(clean(payload.email, 160)) });
  }

  const application = validate(payload);
  if (!application) {
    return json({ error: 'invalid_application' }, { status: 400 });
  }

  if (await rateLimited(context.request, 'aida-apply')) {
    return json({ error: 'rate_limited' }, { status: 429 });
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
    context.env,
    verificationMail(application, verificationUrl(context.request.url, token)),
  );
  if (!sent) {
    // Nothing to confirm if the mail never left, so the row goes too.
    await db.prepare('DELETE FROM athlete_applications WHERE id = ?').bind(id).run();
    return json({ error: 'send_failed' }, { status: 502 });
  }

  return json({ status: 'pending', id, email: maskEmail(application.email) });
};
