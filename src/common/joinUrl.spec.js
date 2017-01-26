import joinUrl from 'common/joinUrl';

describe('joinUrl', function() {

	it('should join with /', function() {
		const url = joinUrl("http://example.com", "rest/api");

		expect(url).toBe("http://example.com/rest/api");
	});

	it('should not add / if path empty', function() {
		const url = joinUrl("http://example.com", "");

		expect(url).toBe("http://example.com");
	});

	it('should concatenate if ends with /', function() {
		const url = joinUrl("http://example.com/", "rest/api");

		expect(url).toBe("http://example.com/rest/api");
	});

	it('should only use 1 / if exists in urls', function() {
		const url = joinUrl("http://example.com/", "/somePath");

		expect(url).toBe("http://example.com/somePath");
	});

});
