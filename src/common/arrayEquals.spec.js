define(['common/arrayEquals'], function (arrayEquals) {
	'use strict';
	
	describe('arrayEquals', function () {

		it('should return true when arrays equal', function () {
			expect(arrayEquals([1, 2], [1, 2])).toBe(true);
		});

		it('should return false when arrays are different', function () {
			expect(arrayEquals([1, 2], [1, 3])).toBe(false);
		});

		it('should return true when arrays undefined', function () {
			expect(arrayEquals(undefined, undefined)).toBe(true);
		});

	});

});
