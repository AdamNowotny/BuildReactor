require([
	'jasmineSignals',
	'services/cruisecontrol.rb/buildService',
	'services/cctray/buildService'
], function (jasmineSignals, BuildService, CCTrayBuildService) {

	'use strict';

	describe('services/cruisecontrol.rb/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl.rb',
				baseUrl: 'cruisecontrol.rb',
				icon: 'cruisecontrol.rb/icon.png',
				url: 'http://example.com/',
				name: 'CC.rb instance'
			};
			ccBuildInfo = {
				serviceName: 'service name',
				buildName: 'build name',
				group: 'group name',
				url: 'http://example.com/link',
				icon: 'ci/icon.png'
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('CruiseControl.rb');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol.rb');
			expect(defaultSettings.icon).toBe('cruisecontrol.rb/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol.rb/logo.png');
			expect(defaultSettings.urlHint).toBe('http://cruisecontrolrb.thoughtworks.com/');
		});

		it('should modify url used to get projects', function () {
			spyOn(CCTrayBuildService.prototype, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/XmlStatusReport.aspx');
			});

			var service = new BuildService(settings);
			service.projects([ 'A', 'B' ]);

			expect(CCTrayBuildService.prototype.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			spyOn(CCTrayBuildService.prototype, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/XmlStatusReport.aspx');
			});

			var service = new BuildService(settings);
			service.start();

			expect(CCTrayBuildService.prototype.start).toHaveBeenCalled();
		});

	});

});