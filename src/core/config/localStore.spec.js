define([
	'core/config/localStore',
	'core/config/version2Updater',
	'text!core/config/config-v1.fixture.json',
	'text!core/config/config-v2.fixture.json'
], function (localStore, version2Updater, config1Text, config2Text) {

	'use strict';
	
	describe('core/config/localStore', function () {

		var mockLocalStorage;
		var config1, config2;

		beforeEach(function () {
			config1 = JSON.parse(config1Text);
			config2 = JSON.parse(config2Text);
			spyOn(localStorage, 'setItem');
			spyOn(localStorage, 'getItem').andCallFake(function (key) {
				switch (key) {
				case 'version':
					return undefined;
				case 'services':
					return JSON.stringify(config1.services);
				}
			});
			spyOn(version2Updater, 'update').andReturn(config2);
		});

		it('should get all settings from local storage', function () {
			localStorage.getItem.andCallFake(function (key) {
				expect(key).toBe('key');
				return '{ "field": "value" }';
			});

			var result = localStore.getItem('key');

			expect(result.field).toBe('value');
		});

		it('should store settings', function () {
			localStore.setItem('key', { field: 'value2' });

			expect(localStorage.setItem).toHaveBeenCalledWith('key', '{"field":"value2"}');
		});

		it('should update to version 2', function () {
			version2Updater.update.andCallFake(function (config) {
				expect(config.version).toBe(1);
				expect(config.services).toEqual(config1.services);
				return config2;
			});

			localStore.update();

			expect(localStorage.setItem).toHaveBeenCalledWith('services', JSON.stringify(config2.services));
		});

		it('should update to default config if localStorage empty', function () {
			localStorage.getItem.andReturn(null);
			version2Updater.update.andCallFake(function (config) {
				expect(config).toEqual({
					version: 1,
					services: []
				});
				return config2;
			});

			localStore.update();

			expect(version2Updater.update).toHaveBeenCalled();
		});

		it('should store version', function () {
			localStore.update();

			expect(localStorage.setItem).toHaveBeenCalledWith('version', 2);
		});
	});
});