define([
		'src/settings/serviceSettings',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals'
	], function (serviceSettings, MockSettingsBuilder, jasmineSignals) {
		describe('serviceSettings', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			var clearedSpy;
			var settings;

			beforeEach(function () {
				clearedSpy = spyOnSignal(serviceSettings.cleared);
				load();
			});

			var createSettings = function(name) {
				var mockSettings = new MockSettingsBuilder().withName(name).create();
				return mockSettings;
			};
			
			var load = function () {
				var mockSettings1 = createSettings('service 1');
				var mockSettings2 = createSettings('service 2');
				var mockSettings3 = createSettings('service 3');
				settings = [mockSettings1, mockSettings2, mockSettings3];
				serviceSettings.load(settings);
			};

			it('should get all', function () {
				expect(serviceSettings.getAll()).toBe(settings);
			});

			it('should clear', function () {
				serviceSettings.clear();

				expect(serviceSettings.getAll().length).toBe(0);
			});

			it('should add', function () {
				serviceSettings.add(createSettings('service name'));

				expect(serviceSettings.getAll().length).toBe(4);
			});

			it('should remove', function () {
				serviceSettings.remove(settings[2]);
				serviceSettings.remove(settings[1]);

				expect(serviceSettings.getAll().length).toBe(1);
			});

			it('should dispatch cleared if all settings removed', function () {
				serviceSettings.remove(settings[2]);
				serviceSettings.remove(settings[1]);
				serviceSettings.remove(settings[0]);

				expect(clearedSpy).toHaveBeenDispatched();
			});

			it('should get settings by index', function () {
				var serviceInfo = serviceSettings.getByIndex(1);

				expect(serviceInfo.name).toBe('service 2');
			});

		});
	});