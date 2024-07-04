/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from 'vitest';
import { arrayEquals, joinUrl } from './utils';

describe('arrayEquals', () => {
    it('should return true when arrays equal', () => {
        expect(arrayEquals([1, 2], [1, 2])).toBe(true);
    });

    it('should return false when arrays are different', () => {
        expect(arrayEquals([1, 2], [1, 3])).toBe(false);
    });

    it('should return true when arrays undefined', () => {
        expect(arrayEquals(undefined, undefined)).toBe(true);
    });
});

describe('joinUrl', () => {
    it('should join with /', () => {
        const url = joinUrl('http://example.com', 'rest/api');

        expect(url).toBe('http://example.com/rest/api');
    });

    it('should not add / if path empty', () => {
        const url = joinUrl('http://example.com', '');

        expect(url).toBe('http://example.com');
    });

    it('should concatenate if ends with /', () => {
        const url = joinUrl('http://example.com/', 'rest/api');

        expect(url).toBe('http://example.com/rest/api');
    });

    it('should only use 1 / if exists in urls', () => {
        const url = joinUrl('http://example.com/', '/somePath');

        expect(url).toBe('http://example.com/somePath');
    });
});
