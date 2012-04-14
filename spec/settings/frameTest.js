define([
		'jquery',
		'src/settings/frame',
		'jasmineSignals',
		'spec/mocks/mockSettingsBuilder'
	], function ($, frame, jasmineSignals, MockSettingsBuilder) {
		describe('frame', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;
			var iframeElement;

			beforeEach(function () {
				jasmine.getFixtures().load('settings/frameFixture.html');
				frame.initialize();
				iframeElement = $('#settings-frame')[0];
			});

			var setSrc = function (url) {
				$('#settings-frame')[0].src = url;
			};

			var getSrc = function () {
				return $('#settings-frame')[0].src;
			};

			it('should show empty page', function () {
				setSrc('page1.html');

				frame.showEmpty();

				expect(getSrc()).toBe('about:blank');
			});

			it('should dispatch loaded after showing empty page', function () {
				var spyLoaded = spyOnSignal(frame.loaded);

				runs(function () {
					frame.showEmpty();
				});

				waitsFor(function () {
					return spyLoaded.count > 0;
				});
			});

			it('should show correct service settings page', function () {
				var serviceInfo = new MockSettingsBuilder()
					.withName('service name')
					.withSettingsPage('page1.html')
					.create();
				var settingsPageUrl = serviceInfo.baseUrl + "/" + serviceInfo.settingsPage;

				frame.show(serviceInfo);

				expect(getSrc()).toContain(settingsPageUrl);
			});

			it('should dispatch loaded after settings page loaded', function () {
				var serviceInfo = new MockSettingsBuilder()
					.withName('service name')
					.withSettingsPage('page1.html')
					.create();
				var spyLoaded = spyOnSignal(frame.loaded);

				runs(function () {
					frame.show(serviceInfo);
				});

				waitsFor(function () {
					return spyLoaded.count > 0;
				});
			});

			it('should not regenerate settings page if already active', function () {
				var spyJQuery = spyOn(jQuery, 'attr');
				var mockSettings = new MockSettingsBuilder().create();

				frame.show(mockSettings);
				frame.show(mockSettings);

				expect(spyJQuery.callCount).toBe(1);
			});

			it('should regenerate settings page if same service type with different settings', function () {
				var spyJQuery = spyOn(jQuery, 'attr');
				var mockSettings1 = new MockSettingsBuilder().create();
				var mockSettings2 = new MockSettingsBuilder().create();

				frame.show(mockSettings1);
				frame.show(mockSettings2);

				expect(spyJQuery.callCount).toBe(2);
			});

			it('should load settings', function () {
				var settings = new MockSettingsBuilder().create();
				runs(function () {
					frame.show(settings);
				});
				var getController = runsToGetController(settings);
				waitsFor(function () {
					return getController().getShowCalledCount() > 0;
				});
			});

			it('should dispatch saved when settings updated', function () {
				var spySaved = spyOnSignal(frame.saved);
				var settings = new MockSettingsBuilder().create();
				runs(function () {
					frame.show(settings);
				});
				var getController = runsToGetController(settings);
				runs(function () {
					getController().settingsChanged.dispatch(settings);
				});
				runs(function () {
					expect(spySaved).toHaveBeenDispatched();
				});
			});

			function runsToGetController(settings) {
				var childController;
				var controllerName = settings.baseUrl + '/' + settings.settingsController;

				// wait for RequireJS to be loaded
				waitsFor(function () {
					return iframeElement.contentWindow.require != undefined;
				});
				// get service settings controller from iframe
				runs(function () {
					iframeElement.contentWindow.require(
						[controllerName], function (serviceSettingsController) {
							childController = serviceSettingsController;
						});
				});
				waitsFor(function () {
					return childController != null;
				});
				return function () { return childController; };
			}
		});
	});