define([
	'core/config/version2Updater',
	'text!core/config/config-v1.fixture.json',
	'text!core/config/config-v2.fixture.json'
], function (updater, config1Text, config2Text) {
	'use strict';

	describe('core/config/version2Updater', function () {

		var config1, config2;

		beforeEach(function () {
			config1 = JSON.parse(config1Text);
			config2 = JSON.parse(config2Text);
		});

		it('should update version counter', function () {
			var version = updater.update(config1).version;

			expect(version).toEqual(config2.version);
		});

		it('should update ThoughtWorks GO to GoCD', function () {
			var config = updater.update(config1);

			expect(config.services[0].typeName).toEqual(config2.services[0].typeName);
		});
	});

});