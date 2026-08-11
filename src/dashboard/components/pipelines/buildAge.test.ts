import { describe, expect, it } from 'vitest';
import { formatAge } from './buildAge';

const NOW = Date.parse('2024-07-23T10:00:00.000Z');

describe('formatAge', () => {
    it('formats recent builds in minutes', () => {
        expect(formatAge('2024-07-23T09:49:00.000Z', NOW)).toBe('11 minutes ago');
    });

    it('formats older builds in days', () => {
        expect(formatAge('2024-07-15T10:00:00.000Z', NOW)).toBe('8 days ago');
    });

    it('rounds day values instead of understating recent builds', () => {
        expect(formatAge('2024-07-21T22:00:00.000Z', NOW)).toBe('2 days ago');
    });

    it('formats builds from at least a month ago in months', () => {
        expect(formatAge('2024-04-23T10:00:00.000Z', NOW)).toBe('3 months ago');
    });

    it('rounds month values instead of understating older builds', () => {
        expect(formatAge('2024-02-01T10:00:00.000Z', NOW)).toBe('6 months ago');
    });

    it('formats builds from at least a year ago in years', () => {
        expect(formatAge('2023-07-23T10:00:00.000Z', NOW)).toBe('1 year ago');
    });

    it('formats builds from less than a minute ago as just now', () => {
        expect(formatAge('2024-07-23T09:59:45.000Z', NOW)).toBe('just now');
    });
});
