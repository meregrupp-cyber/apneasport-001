import {
  applicationMail,
  confirmationMail,
  hashToken,
  purgeExpired,
  resultPage,
  sendMail,
  type Application,
  type Env,
  type Locale,
} from './_shared';

interface Row {
  id: string;
  status: string;
  locale: string;
  payload: string | null;
  created_at: string;
  expires_at: string;
}

/**
 * Second step: the applicant opens the link from their own inbox. Only here is
 * the application mailed to the League, exactly once - the row is claimed with
 * a conditional update, so a second click can never forward it again.
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.ATHLETE_APPLICATIONS;
  const token = new URL(context.request.url).searchParams.get('token') ?? '';
  if (!db || token.length < 20 || token.length > 200) {
    return resultPage('et', 'invalid');
  }

  const row = await db
    .prepare(
      `SELECT id, status, locale, payload, created_at, expires_at
         FROM athlete_applications WHERE token_hash = ?`,
    )
    .bind(await hashToken(token))
    .first<Row>();
  if (!row) return resultPage('et', 'invalid');

  const locale: Locale = row.locale === 'en' ? 'en' : 'et';
  if (row.status !== 'pending') {
    // Confirmed, or already being forwarded by a parallel click.
    return resultPage(locale, 'already');
  }
  if (row.expires_at < new Date().toISOString()) {
    return resultPage(locale, 'expired');
  }

  const verifiedAt = new Date().toISOString();
  const claim = await db
    .prepare(
      `UPDATE athlete_applications SET status = 'sending', verified_at = ?
         WHERE id = ? AND status = 'pending'`,
    )
    .bind(verifiedAt, row.id)
    .run();
  if (claim.meta.changes !== 1) {
    return resultPage(locale, 'already');
  }

  const application = JSON.parse(row.payload ?? '{}') as Application;
  const forwarded = await sendMail(
    context.env,
    applicationMail(application, row.created_at, verifiedAt),
  );
  if (!forwarded) {
    // Hand the application back so the same link can be tried again.
    await db
      .prepare(
        `UPDATE athlete_applications SET status = 'pending', verified_at = NULL WHERE id = ?`,
      )
      .bind(row.id)
      .run();
    return resultPage(locale, 'failed');
  }

  // The League has it now, so the personal data leaves the database. What
  // stays is only enough to recognise a second click on the same link.
  await db
    .prepare(`UPDATE athlete_applications SET status = 'confirmed', payload = NULL WHERE id = ?`)
    .bind(row.id)
    .run();

  context.waitUntil(sendMail(context.env, confirmationMail(application)));
  context.waitUntil(purgeExpired(db));
  return resultPage(locale, 'confirmed');
};
