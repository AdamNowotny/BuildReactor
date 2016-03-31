define([
	'core/config/serviceConfigUpdater',
	'raw!core/config/config-v1.fixture.json',
	'raw!core/config/config-v2.fixture.json',
	'raw!core/config/config-v3.fixture.json'
], function(updater, config1Text, config2Text, config3Text) {
	'use strict';

	describe('core/config/serviceConfigUpdater', function() {

		var config1, config2, config3;

		beforeEach(function() {
			config1 = JSON.parse(config1Text).services;
			config2 = JSON.parse(config2Text).services;
			config3 = JSON.parse(config3Text).services;
		});

		it('should return empty array by default', function() {
			var updated = updater.update(undefined);

			expect(updated).toEqual([]);
		});

		it('should fix config by returning empty array if not array', function() {
			var updated = updater.update({});

			expect(updated).toEqual([]);
		});

		it('should fix config by returning empty array if not array of objects', function() {
			var updated = updater.update(["a", "b"]);

			expect(updated).toEqual([]);
		});

		it('should remove fields that dont belong to service instance', function() {
			var config = updater.update([{
				typeName: "GoCD",
				baseUrl: "go",
				icon: "go/icon.png",
				logo: "go/logo.png",
				branch: 'refs/heads/master',
				projects: [
					"ansible :: SetupAgents",
					"ansible :: UpdateServers"
				],
				url: "http://ci.sample.com:8153/go",
				urlHint: "URL, e.g. http://example-go.thoughtworks.com/",
				username: "",
				password: "",
				updateInterval: 60,
				name: "GoCD sample",
				disabled: false
			}]);

			expect(config).toEqual([{
				baseUrl: "go",
				projects: [
					"ansible :: SetupAgents",
					"ansible :: UpdateServers"
				],
				url: "http://ci.sample.com:8153/go",
				branch: 'refs/heads/master',
				username: "",
				password: "",
				updateInterval: 60,
				name: "GoCD sample",
				disabled: false
			}]);
		});

	});

});
