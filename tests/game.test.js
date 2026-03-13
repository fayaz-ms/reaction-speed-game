import { describe, it, expect } from 'vitest';
import { getRandomDelay, formatTime, getRating, calculateAverage } from '../src/lib/utils';

describe('getRandomDelay', () => {
  it('returns a number between 2000 and 5000 by default', () => {
    for (let i = 0; i < 50; i++) {
      const delay = getRandomDelay();
      expect(delay).toBeGreaterThanOrEqual(2000);
      expect(delay).toBeLessThanOrEqual(5000);
    }
  });

  it('respects custom min and max', () => {
    for (let i = 0; i < 50; i++) {
      const delay = getRandomDelay(1000, 2000);
      expect(delay).toBeGreaterThanOrEqual(1000);
      expect(delay).toBeLessThanOrEqual(2000);
    }
  });
});

describe('formatTime', () => {
  it('formats milliseconds below 1000', () => {
    expect(formatTime(250)).toBe('250ms');
    expect(formatTime(1)).toBe('1ms');
    expect(formatTime(999)).toBe('999ms');
  });

  it('formats times at or above 1000ms in seconds', () => {
    expect(formatTime(1000)).toBe('1.00s');
    expect(formatTime(1500)).toBe('1.50s');
    expect(formatTime(2345)).toBe('2.35s');
  });
});

describe('getRating', () => {
  it('returns Incredible for under 200ms', () => {
    expect(getRating(150).label).toBe('Incredible!');
  });

  it('returns Amazing for 200-249ms', () => {
    expect(getRating(230).label).toBe('Amazing!');
  });

  it('returns Great for 250-299ms', () => {
    expect(getRating(280).label).toBe('Great!');
  });

  it('returns Good for 300-399ms', () => {
    expect(getRating(350).label).toBe('Good');
  });

  it('returns Average for 400-499ms', () => {
    expect(getRating(450).label).toBe('Average');
  });

  it('returns Keep Practicing for 500ms+', () => {
    expect(getRating(600).label).toBe('Keep Practicing');
  });
});

describe('calculateAverage', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAverage([])).toBe(0);
  });

  it('calculates the correct average', () => {
    expect(calculateAverage([200, 300, 400])).toBe(300);
  });

  it('rounds to nearest integer', () => {
    expect(calculateAverage([201, 302])).toBe(252);
  });
});
