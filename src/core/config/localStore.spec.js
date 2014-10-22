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
			spyOn(localStorage, 'getItem').andCallFake(function (key) {
				expect(key).toBe('key');
				return '{ "field": "value" }';
			});

			var result = localStore.getItem('key');

			expect(result.field).toBe('value');
		});

		it('should store settings', function () {
			localStore.setItem('key', { field: 'value2' });

			expect(mockLocalStorage).toHaveBeenCalledWith('key', '{"field":"value2"}');
		});

	});
});