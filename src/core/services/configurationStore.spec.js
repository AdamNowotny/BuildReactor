define([
	'core/services/configurationStore'
], function (configurationStore) {

	'use strict';
	
	describe('configurationStore', function () {

		var mockLocalStorage;

		beforeEach(function () {
			mockLocalStorage = spyOn(localStorage, 'setItem');
		});

		it('should get all settings from local storage', function () {
			spyOn(localStorage, 'getItem').andReturn('{ "field": "value" }');

			var result = configurationStore.getAll();

			expect(result.field).toBe('value');
		});

		it('should store settings', function () {
			configurationStore.store({ field: 'value2' });

			expect(mockLocalStorage).toHaveBeenCalled();
		});

	});
});