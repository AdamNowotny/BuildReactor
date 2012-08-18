define(['serviceTypesRepository'], function (repository) {

	'use strict';
	
	describe('serviceTypesRepository', function () {

		it('should get all types as array', function () {
			var types = repository.getAll();

			expect(types.length).toBe(2);
		});

	});
});