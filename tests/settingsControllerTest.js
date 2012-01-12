define([
		'jquery',
		'src/settingsController',
		'SignalLogger',
		'mocks/mockSettingsBuilder'
	], function ($, controller, SignalLogger, MockSettingsBuilder) {
		describe('SettingsController', function () {

			var logger = new SignalLogger({
				settingsShown: controller.settingsShown
			});
			var defaultTimeout = 3000;

			beforeEach(function () {
				jasmine.getFixtures().load('optionsEmpty.html');
				logger.reset();
			});

			it('should display list of services', function () {
				var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
				var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();

				controller.show([mockSettings1, mockSettings2]);

				expect($('#service-list a').length).toBe(2);
				expect($('#service-list a').eq(0)).toHaveText('service 1');
				expect($('#service-list a').eq(1)).toHaveText('service 2');
			});

			it('should show first service settings page on load', function () {
				var mockSettings = new MockSettingsBuilder()
					.withSettingsPage('page1.html')
					.create();

				controller.show([mockSettings]);

				expect(logger.settingsShown.count).toBe(1);
				expect($('#settings-frame').attr('src')).toContain('page1.html');
			});

			it('should call show on first service settings on load', function () {
				var mockSettings = new MockSettingsBuilder()
					.withSettingsPage('serviceOptionsPage.html')
					.create();
				var childControllerGetter = null;

				runs(function () {
					controller.show([mockSettings]);
					childControllerGetter = runsToGetController(mockSettings);
				});

				// expect show to be already called on the settings controller
				waitsFor(function () {
					return childControllerGetter().getShowCalledCount() > 0;
				}, 0);
			});

			it('should not regenerate settings page if already active', function () {
				var mockSettings = new MockSettingsBuilder().create();
				controller.show([mockSettings]);

				$('#service-list a').eq(0).click();

				expect(logger.settingsShown.count).toBe(1);
			});

			it('should update service name when selected', function () {
				var mockSettings1 = new MockSettingsBuilder()
					.withName('First service')
					.create();
				controller.show([mockSettings1]);

				expect($('#service-name')).toHaveText('First service');

				var mockSettings2 = new MockSettingsBuilder()
					.withName('Second service')
					.create();
				controller.show([mockSettings2]);

				expect($('#service-name')).toHaveText('Second service');
			});

			it('should display settings of selected service', function () {
				var mockSettings1 = new MockSettingsBuilder()
					.withName('service 1')
					.withSettingsPage('page1.html')
					.create();
				var mockSettings2 = new MockSettingsBuilder()
					.withName('service 2')
					.withSettingsPage('page2.html')
					.create();

				controller.show([mockSettings1, mockSettings2]);
				expect($('#settings-frame')[0].src).toContain('page1.html');
				$('#service-list a').eq(1).click();

				expect($('#settings-frame')[0].src).toContain('page2.html');
			});

			it('should signal settingsChanged when settings saved', function () {
				var mockSettings = new MockSettingsBuilder()
					.withSettingsPage('serviceOptionsPage.html')
					.create();
				var childControllerGetter = null;
				var settingsChangedCount = 0;
				runs(function () {
					controller.show([mockSettings]);
					childControllerGetter = runsToGetController(mockSettings);
				});

				runs(function () {
					controller.settingsChanged.add(function (settings) {
						settingsChangedCount++;
					});
					childControllerGetter().saveClicked.dispatch(mockSettings);
				});
				
				waitsFor(function () {
					return settingsChangedCount == 1;
				}, 0);
			});

			it('should fail if subcontroller does not implement required API', function () {
				// TODO implement test
			});

			// returns function used to get active settings controller
			function runsToGetController(settings) {
				var childController = null;
				var iframe = $('#settings-frame')[0];

				// wait for RequireJS to be loaded
				waitsFor(function () {
					return iframe.contentWindow.require != undefined;
				}, defaultTimeout);
				// get service settings controller from iframe
				runs(function () {
					iframe.contentWindow.require(
							[settings.settingsController], function (serviceSettingsController) {
								childController = serviceSettingsController;
							});
				});
				waitsFor(function () {
					return childController != null;
				}, defaultTimeout);
				return function () { return childController; };
			};

		});
	});