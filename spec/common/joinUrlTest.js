define(['common/joinUrl'], function (joinUrl) {

	'use strict';

	describe('joinUrl', function () {

		it('should join with /', function () {
			var url = joinUrl("http://example.com", "rest/api");

			expect(url).toBe("http://example.com/rest/api");
		});

		it('should not add / if path empty', function () {
			var url = joinUrl("http://example.com", "");

			expect(url).toBe("http://example.com");
		});

		it('should concatenate if ends with /', function () {
			var url = joinUrl("http://example.com/", "rest/api");

			expect(url).toBe("http://example.com/rest/api");
		});

	});
});