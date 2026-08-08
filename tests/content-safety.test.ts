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

  it('does not hard-code an EAPSL Facebook page URL', () => {
    const content = textFiles(join(process.cwd(), 'src'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');
    expect(content).not.toMatch(/facebook\.com\/apneasport(?:\.ee)?/i);
    expect(content).toContain('PUBLIC_FACEBOOK_PAGE_URL');
  });
});
