import { addDays, daysLabel, formatCurrency, formatDate, toIsoDate } from './format';

describe('format', () => {
  it('formats AED in English and Arabic', () => {
    expect(formatCurrency(420, 'AED', 'en')).toMatch(/420/);
    expect(formatCurrency(420, 'AED', 'ar')).toMatch(/٤٢٠|420/);
  });

  it('formats date-only strings without timezone drift', () => {
    expect(formatDate('2026-10-11', 'en', { day: 'numeric', month: 'long', year: 'numeric' })).toBe('11 October 2026');
  });

  it('adds days across month boundaries', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('keeps the local calendar date', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('uses Arabic plural forms for day counts', () => {
    expect(daysLabel(1, 'ar')).toBe('يوم واحد');
    expect(daysLabel(2, 'ar')).toBe('يومان');
    expect(daysLabel(5, 'ar')).toContain('أيام');
    expect(daysLabel(14, 'ar')).toContain('يوماً');
    expect(daysLabel(1, 'en')).toBe('1 day');
    expect(daysLabel(3, 'en')).toBe('3 days');
  });
});
