define(['settingsStore'], function (settingsStore) {
	describe('SettingsStore', function () {

		it('should get all settings from local storage', function () {
			spyOn(localStorage, 'getItem').andReturn('{ "field": "value" }');

			var result = settingsStore.getAll();

			expect(result.field).toBe('value');
		});

		it('should store settings', function () {
			var mockLocalStorage = spyOn(localStorage, 'setItem');

			settingsStore.store({ field: 'value2' });

			expect(mockLocalStorage).toHaveBeenCalled();
		});

	});
});