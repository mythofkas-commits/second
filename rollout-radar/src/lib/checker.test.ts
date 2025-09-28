import { describe, expect, it } from 'vitest';
import { evaluateCheck } from './checker';

describe('evaluateCheck', () => {
  const baseRequirements = [
    { osName: 'iOS', osMin: '18' },
  ];

  it('returns LIKELY when live and requirements met', () => {
    const result = evaluateCheck({
      osName: 'iOS',
      osVersion: '18.1',
      appVersion: undefined,
      availability: 'LIVE',
      requirements: baseRequirements,
    });
    expect(result.status).toBe('LIKELY');
    expect(result.reasons).toHaveLength(0);
  });

  it('returns STAGED when availability staged', () => {
    const result = evaluateCheck({
      osName: 'iOS',
      availability: 'STAGED',
      requirements: baseRequirements,
    });
    expect(result.status).toBe('STAGED');
  });

  it('returns NOT_YET when availability not live', () => {
    const result = evaluateCheck({
      osName: 'iOS',
      availability: 'NOT_LIVE',
      requirements: baseRequirements,
    });
    expect(result.status).toBe('NOT_YET');
  });

  it('returns NOT_YET with reason when requirements missing', () => {
    const result = evaluateCheck({
      osName: 'iOS',
      osVersion: '17',
      availability: 'UNKNOWN',
      requirements: baseRequirements,
    });
    expect(result.status).toBe('NOT_YET');
    expect(result.reasons.some((reason) => reason.includes('Requires'))).toBe(true);
  });
});
