import { ar } from '@/data/translationsAr';
import { en } from '@/data/translationsEn';
import { mAr } from './mobileAr';
import { mEn } from './mobileEn';

function flatten(obj: unknown, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else Object.assign(out, flatten(v, key));
  }
  return out;
}

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');

describe.each([
  ['website dictionary', en, ar],
  ['mobile dictionary', mEn, mAr],
])('%s', (_name, source, target) => {
  const a = flatten(source);
  const b = flatten(target);

  it('has an Arabic string for every English key', () => {
    expect(Object.keys(b).sort()).toEqual(Object.keys(a).sort());
  });

  it('has no empty strings', () => {
    expect(Object.entries(b).filter(([, v]) => v.trim() === '')).toEqual([]);
  });

  it('keeps the same {placeholders} in both languages', () => {
    for (const key of Object.keys(a)) expect(placeholders(b[key]!)).toBe(placeholders(a[key]!));
  });
});
