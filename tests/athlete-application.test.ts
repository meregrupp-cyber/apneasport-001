import { describe, expect, it } from 'vitest';
import {
  APPLICATION_TYPES,
  clean,
  emailBody,
  validate,
} from '../functions/api/athlete-application';

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
    const body = emailBody(application!, '2026-08-21T10:00:00.000Z');

    expect(body).toContain('Kodakondsus / Citizenship: Estonia');
    expect(body).not.toContain('Latvia');
    expect(body).toContain('Application language: ET');
    expect(body).toContain('Submitted: 2026-08-21T10:00:00.000Z');
  });

  it('never lets the mail body break into extra lines from one field', () => {
    const application = validate({
      ...submitted,
      aidaProfile: 'https://example.org\nBcc: someone@example.com',
    });
    const lines = emailBody(application!, '2026-08-21T10:00:00.000Z').split('\n');

    expect(lines.filter((line) => line.startsWith('AIDA profile'))).toHaveLength(1);
    expect(lines.some((line) => line.startsWith('Bcc:'))).toBe(false);
  });
});
