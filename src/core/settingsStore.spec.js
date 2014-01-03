define(['core/settingsStore', 'jasmineSignals'], function (settingsStore, spyOnSignal) {

	'use strict';
	
	describe('SettingsStore', function () {

		var mockLocalStorage;

		beforeEach(function () {
			mockLocalStorage = spyOn(localStorage, 'setItem');
		});

		it('should get all settings from local storage', function () {
			spyOn(localStorage, 'getItem').andReturn('{ "field": "value" }');

			var result = settingsStore.getAll();

			expect(result.field).toBe('value');
		});

		it('should store settings', function () {
			settingsStore.store({ field: 'value2' });

			expect(mockLocalStorage).toHaveBeenCalled();
		});

		it('should dispatch storedSettings when settings saved', function () {
			var storedSpy = spyOnSignal(settingsStore.on.storedSettings);

			settingsStore.store({ field: 'value2' });

			expect(storedSpy).toHaveBeenDispatched(1);
		});
	});
});