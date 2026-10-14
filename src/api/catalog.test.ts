import { toNurse, toService } from './catalog';

jest.mock('@/lib/config', () => ({ config: { apiBaseUrl: 'http://api.test', requestTimeoutMs: 5000, platformUtcOffset: '+04:00', defaultCurrency: 'AED' } }));

describe('catalogue mapping', () => {
  it('takes ids, price and picture from the backend and editorial text from the bundled content', () => {
    const s = toService({
      id: 'srv-1',
      name: 'Elderly Care',
      slug: 'elderly-care',
      description: 'desc',
      category: 'ELDERLY_CARE',
      minDurationMinutes: 1440,
      maxDurationMinutes: 14 * 1440,
      sortOrder: 1,
      imageUrl: '/api/v1/media/abc',
      baseRatesMinor: { daily: 38000 },
    });
    expect(s.id).toBe('srv-1');
    expect(s.dailyRateSample).toBe(380);
    expect(s.image).toBe('http://api.test/api/v1/media/abc');
    expect(s.title.ar).not.toBe(''); // Arabic title comes from the bundled website content by slug
    expect(s.minDays).toBe(1);
    expect(s.maxDays).toBe(14);
  });

  it('works for a backend service the bundled content has never heard of', () => {
    const s = toService({
      id: 'srv-9',
      name: 'Physio At Home',
      slug: 'physio-at-home',
      description: 'Rehabilitation exercises',
      category: 'POST_SURGERY',
      minDurationMinutes: 1440,
      maxDurationMinutes: 1440,
      sortOrder: 5,
      imageUrl: null,
      baseRatesMinor: { daily: null },
    });
    expect(s.title).toEqual({ en: 'Physio At Home', ar: 'Physio At Home' });
    expect(s.category).toBe('recovery');
    expect(s.dailyRateSample).toBeNull();
    expect(s.image).toBe('');
  });

  it('never borrows a sample portrait for a real nurse record without a photo', () => {
    const n = toNurse({
      id: 'nurse-1',
      serviceIds: ['srv-1'],
      dailyRateMinor: 42000,
      displayName: 'Layla H.',
      imageUrl: null,
      bio: null,
      yearsOfExperience: 9,
      specializations: ['Elderly care'],
      languages: ['arabic'],
      gender: 'FEMALE',
      averageRating: 4.8,
      totalReviews: 3,
      city: 'Dubai',
    });
    expect(n.id).toBe('nurse-1');
    expect(n.portrait).toBe('');
    expect(n.dailyRateSample).toBe(420);
    expect(n.gender).toBe('female');
  });
});
