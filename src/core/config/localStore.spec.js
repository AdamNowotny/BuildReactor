define([
	'core/config/localStore'
], function(localStore) {

	'use strict';
	
	describe('core/config/localStore', function() {

		var mockLocalStorage;

		beforeEach(function() {
			spyOn(localStorage, 'setItem');
			spyOn(localStorage, 'getItem');
		});

		it('should get all settings from local storage', function() {
			localStorage.getItem.andCallFake(function(key) {
				expect(key).toBe('key');
				return '{ "field": "value" }';
			});

			var result = localStore.getItem('key');

			expect(result.field).toBe('value');
		});

		it('should store settings', function() {
			localStore.setItem('key', { field: 'value2' });

			expect(localStorage.setItem).toHaveBeenCalledWith('key', '{"field":"value2"}');
		});

	});
});
