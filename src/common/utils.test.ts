import { describe, expect, it, vi } from 'vitest';
import { joinUrl } from './utils';

vi.mock('common/logger');

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
