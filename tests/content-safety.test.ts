import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { site } from '../src/data/site';

function textFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    if (statSync(path).isDirectory()) return textFiles(path);
    return /\.(astro|ts|json|md|mjs|css)$/.test(name) ? [path] : [];
  });
}

describe('official content guardrails', () => {
  it('keeps verified registry identity in central data', () => {
    expect(site.registryCode).toBe('80672860');
    expect(site.legalName.et).toBe('Eesti Apneaspordi Liit');
    expect(site.legalName.en).toBe('Estonian Apnea Sports League');
  });

  it('keeps the confirmed Facebook page URL in one central place', () => {
    const files = textFiles(join(process.cwd(), 'src'));
    const pattern = /facebook\.com\/apneasport(?:\.ee)?/i;
    const offenders = files.filter(
      (path) =>
        pattern.test(readFileSync(path, 'utf8')) && !path.endsWith(join('src', 'data', 'site.ts')),
    );

    // The URL is approved for publication, but it must stay in src/data/site.ts
    // so a single edit changes it everywhere, and the env override must survive.
    expect(offenders).toEqual([]);
    expect(readFileSync(join(process.cwd(), 'src', 'data', 'site.ts'), 'utf8')).toMatch(pattern);
    expect(files.map((path) => readFileSync(path, 'utf8')).join('\n')).toContain(
      'PUBLIC_FACEBOOK_PAGE_URL',
    );
  });
});
