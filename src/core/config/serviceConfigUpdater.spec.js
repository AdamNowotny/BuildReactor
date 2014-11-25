define([
	'core/config/serviceConfigUpdater',
	'text!core/config/config-v1.fixture.json',
	'text!core/config/config-v2.fixture.json'
], function (updater, config1Text, config2Text) {
	'use strict';

	describe('core/config/serviceConfigUpdater', function () {

		var config1, config2;

		beforeEach(function () {
			config1 = JSON.parse(config1Text).services;
			config2 = JSON.parse(config2Text).services;
		});

		it('should return empty array by default', function () {
			var updated = updater.update(undefined);

			expect(updated).toEqual([]);
		});

		it('should update ThoughtWorks GO to GoCD', function () {
			var config = updater.update(config1);

			expect(config[0].typeName).toEqual(config2[0].typeName);
		});
	});

});