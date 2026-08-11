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

    it('formats builds from less than a minute ago as just now', () => {
        expect(formatAge('2024-07-23T09:59:45.000Z', NOW)).toBe('just now');
    });
});
