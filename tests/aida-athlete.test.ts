import { describe, expect, it } from 'vitest';
import {
  APPLICATION_TYPES,
  applicationMail,
  clean,
  confirmationMail,
  createToken,
  hashToken,
  maskEmail,
  validate,
  verificationMail,
  verificationUrl,
} from '../functions/api/aida-athlete/_shared';

const submitted = {
  locale: 'et',
  firstName: 'Jaan',
  lastName: 'Tamm',
  dateOfBirth: '1990-05-17',
  email: 'jaan.tamm@example.com',
  phone: '+372 5111 2222',
  aidaProfile: '',
  applicationType: 'activate',
  consents: {
    citizen: true,
    dataProcessing: true,
    publishResults: true,
    publishStatus: true,
  },
} satisfies Record<string, unknown>;

describe('athlete application, server side', () => {
  it('accepts a complete application', () => {
    const application = validate({ ...submitted });

    expect(application?.firstName).toBe('Jaan');
    expect(application?.applicationType).toBe('activate');
  });

  it('refuses an application that is missing any consent', () => {
    for (const key of ['citizen', 'dataProcessing', 'publishResults', 'publishStatus']) {
      const consents = { ...submitted.consents, [key]: false };

      expect(validate({ ...submitted, consents })).toBeNull();
    }
    expect(validate({ ...submitted, consents: {} })).toBeNull();
  });

  it('refuses an unknown application type, and knows exactly three', () => {
    expect(Object.keys(APPLICATION_TYPES)).toEqual(['activate', 'renew', 'removal']);
    expect(validate({ ...submitted, applicationType: 'free-membership' })).toBeNull();
    expect(validate({ ...submitted, applicationType: '' })).toBeNull();
  });

  it('refuses malformed contact details', () => {
    expect(validate({ ...submitted, email: 'jaan.tamm' })).toBeNull();
    expect(validate({ ...submitted, email: 'jaan tamm@example.com' })).toBeNull();
    expect(validate({ ...submitted, phone: '12' })).toBeNull();
    expect(validate({ ...submitted, phone: 'call me' })).toBeNull();
    expect(validate({ ...submitted, firstName: '   ' })).toBeNull();
  });

  it('refuses a birth date that is missing, malformed or in the future', () => {
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

    expect(validate({ ...submitted, dateOfBirth: '' })).toBeNull();
    expect(validate({ ...submitted, dateOfBirth: '17.05.1990' })).toBeNull();
    expect(validate({ ...submitted, dateOfBirth: '1990-02-31' })).toBeNull();
    expect(validate({ ...submitted, dateOfBirth: tomorrow })).toBeNull();
  });

  it('strips control characters, so no field can smuggle a mail header', () => {
    expect(clean('Jaan\r\nBcc: someone@example.com', 80)).toBe('Jaan  Bcc: someone@example.com');
    expect(clean('  Tamm  ', 80)).toBe('Tamm');
    expect(clean('x'.repeat(200), 80)).toHaveLength(80);
    expect(clean(42, 80)).toBe('');

    const injected = validate({ ...submitted, firstName: 'Jaan\nBcc: someone@example.com' });
    expect(injected?.firstName).not.toContain('\n');
  });

  it('always reports Estonia as citizenship, whatever the request claims', () => {
    const application = validate({ ...submitted, citizenship: 'Latvia' });
    const body: string = applicationMail(
      application!,
      '2026-08-21T09:00:00.000Z',
      '2026-08-21T10:00:00.000Z',
    ).text;

    expect(body).toContain('Kodakondsus / Citizenship: Estonia');
    expect(body).not.toContain('Latvia');
    expect(body).toContain('Application language: ET');
    expect(body).toContain('Submitted at: 2026-08-21T09:00:00.000Z');
  });

  it('never lets the mail body break into extra lines from one field', () => {
    const application = validate({
      ...submitted,
      aidaProfile: 'https://example.org\nBcc: someone@example.com',
    });
    const lines: string[] = applicationMail(
      application!,
      '2026-08-21T09:00:00.000Z',
      '2026-08-21T10:00:00.000Z',
    ).text.split('\n');

    expect(lines.filter((line) => line.startsWith('AIDA profile'))).toHaveLength(1);
    expect(lines.some((line) => line.startsWith('Bcc:'))).toBe(false);
  });

  it('mails the League only with the verification stamped on top', () => {
    const application = validate({ ...submitted })!;
    const mail = applicationMail(
      application,
      '2026-08-21T09:00:00.000Z',
      '2026-08-21T10:00:00.000Z',
    );

    expect(mail.to).toBe('estonia@apneasport.ee');
    expect(mail.subject).toBe('AIDA Estonia athlete status application - Jaan Tamm');
    expect(mail.text.startsWith('Email verified: YES')).toBe(true);
    expect(mail.text).toContain('Verified at: 2026-08-21T10:00:00.000Z');
    expect(mail.text).toContain('Submitted at: 2026-08-21T09:00:00.000Z');
    expect(mail.text).toContain('Email verified at: 2026-08-21T10:00:00.000Z');
  });

  it('writes the confirmation mail to the applicant in their own language', () => {
    const et = verificationMail(
      validate({ ...submitted })!,
      'https://apneasport.ee/verify?token=x',
    );
    const en = verificationMail(
      validate({ ...submitted, locale: 'en' })!,
      'https://apneasport.ee/verify?token=x',
    );

    expect(et.to).toBe('jaan.tamm@example.com');
    expect(et.subject).toBe('Kinnita oma AIDA Estonia sportlasstaatuse avaldus');
    expect(et.text).toContain('Tere, Jaan');
    expect(et.text).toContain('Kinnituslink kehtib 24 tundi.');
    expect(et.text).toContain('https://apneasport.ee/verify?token=x');
    expect(et.html).toContain('KINNITAN AVALDUSE');
    expect(en.subject).toBe('Confirm your AIDA Estonia athlete status application');
    expect(en.text).toContain('Hello Jaan,');
    expect(en.html).toContain('CONFIRM APPLICATION');
    // The mail carries no personal detail beyond the greeting and the link.
    expect(et.text).not.toContain('1990-05-17');
    expect(et.text).not.toContain('+372');
  });

  it('keeps the applicant receipt short and localized', () => {
    expect(confirmationMail(validate({ ...submitted })!).subject).toBe(
      'AIDA Estonia avaldus on kinnitatud',
    );
    expect(confirmationMail(validate({ ...submitted, locale: 'en' })!).subject).toBe(
      'Your AIDA Estonia application has been confirmed',
    );
  });

  it('builds a verification link that carries nothing but the token', () => {
    const url = new URL(verificationUrl('https://apneasport.ee/api/aida-athlete/apply', 'abc123'));

    expect(url.origin).toBe('https://apneasport.ee');
    expect(url.pathname).toBe('/api/aida-athlete/verify');
    expect([...url.searchParams.keys()]).toEqual(['token']);
    expect(url.searchParams.get('token')).toBe('abc123');
  });

  it('creates long, unique, URL safe tokens and stores only their hash', async () => {
    const tokens = Array.from({ length: 50 }, () => createToken());

    expect(new Set(tokens).size).toBe(tokens.length);
    for (const token of tokens) {
      expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    }
    const hash = await hashToken(tokens[0]!);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain(tokens[0]!);
    expect(await hashToken(tokens[0]!)).toBe(hash);
    expect(await hashToken(tokens[1]!)).not.toBe(hash);
  });

  it('masks the address shown back on the waiting screen', () => {
    expect(maskEmail('jaan.tamm@example.com')).toBe('ja***@example.com');
    expect(maskEmail('broken-address')).toBe('');
  });
});
