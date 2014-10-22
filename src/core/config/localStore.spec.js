define([
	'core/config/localStore'
], function (localStore) {

	'use strict';
	
	describe('localStore', function () {

		var mockLocalStorage;

		beforeEach(function () {
			mockLocalStorage = spyOn(localStorage, 'setItem');
		});

		it('should get all settings from local storage', function () {
			spyOn(localStorage, 'getItem').andReturn('{ "field": "value" }');

			var result = localStore.getAll();

			expect(result.field).toBe('value');
		});

		it('should store settings', function () {
			localStore.store({ field: 'value2' });

			expect(mockLocalStorage).toHaveBeenCalled();
		});

	});
});