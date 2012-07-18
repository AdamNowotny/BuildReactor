define([
		'notificationController',
		'serviceController',
		'timer',
		'spec/mocks/mockBuildEventBuilder'
	], function (notificationController, serviceController, Timer, MockBuildEventBuilder) {

		describe('NotificationController', function () {

			var mockBadgeText;
			var mockBadgeColor;
			var mockNotification = {
				show: function () { },
				cancel: function () { }
			};

			beforeEach(function () {
				spyOn(window.webkitNotifications, 'createNotification').andReturn(mockNotification);
				mockBadgeText = spyOn(chrome.browserAction, 'setBadgeText');
				mockBadgeColor = spyOn(chrome.browserAction, 'setBadgeBackgroundColor');
			});

			afterEach(function () {
				serviceController.servicesStarted.removeAll();
				serviceController.buildFailed.removeAll();
				serviceController.buildFixed.removeAll();
			});

			it('should show grey badge if state is unknown', function () {
				notificationController.initialize();

				expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: ' ' });
				expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: [200, 200, 200, 200] });
			});

			it('should show green badge when services are initialized and builds are fine', function () {
				notificationController.initialize();

				serviceController.servicesStarted.dispatch({ failedBuildsCount: 0 });

				expect(window.webkitNotifications.createNotification).not.toHaveBeenCalled();
				expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '\u2022' });
				expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: [0, 255, 0, 200] });
			});

			it('should show red badge when services are initialized and some builds are broken', function () {
				notificationController.initialize();

				serviceController.servicesStarted.dispatch({ failedBuildsCount: 2 });

				expect(window.webkitNotifications.createNotification).not.toHaveBeenCalled();
				expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '2' });
				expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: [255, 0, 0, 200] });
			});

			it('should show red badge with amount of failed builds when build fails', function () {
				notificationController.initialize();
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(2).create();

				serviceController.buildFailed.dispatch(buildEvent);

				expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '2' });
				expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: [255, 0, 0, 200] });
			});

			it('should show message when build fails', function () {
				notificationController.initialize();
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(2).create();

				serviceController.buildFailed.dispatch(buildEvent);

				expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
					'img/icon-128.png', buildEvent.message, buildEvent.details
				);
			});

			it('should show green badge when all builds are fixed', function () {
				notificationController.initialize();
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(0).create();

				serviceController.buildFixed.dispatch(buildEvent);

				expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '\u2022' });
				expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: [0, 255, 0, 200] });
			});

			it('should show message if build fixed', function () {
				notificationController.initialize();
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(2).create();

				serviceController.buildFixed.dispatch(buildEvent);

				expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
					'img/icon-128.png', buildEvent.message, buildEvent.details
				);
			});

			it('should show message if all builds are fixed', function () {
				notificationController.initialize();
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(0).create();

				serviceController.buildFixed.dispatch(buildEvent);

				expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
					'img/icon-128.png', 'All builds are green !', buildEvent.details
				);
			});

			it('should close notifications about fixed builds after 5 seconds', function () {
				notificationController.initialize();
				spyOn(mockNotification, 'cancel');
				spyOn(Timer.prototype, 'start').andCallFake(function (timeout) {
					expect(timeout).toBe(5);
					this.elapsed.dispatch();
				});
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(2).create();

				serviceController.buildFixed.dispatch(buildEvent);

				expect(Timer.prototype.start).toHaveBeenCalledWith(5);
				expect(mockNotification.cancel).toHaveBeenCalled();
			});

			it('should not close notifications about failed builds', function () {
				notificationController.initialize();
				spyOn(mockNotification, 'cancel');
				var buildEvent = new MockBuildEventBuilder().withFailedBuilds(2).create();

				serviceController.buildFailed.dispatch(buildEvent);

				expect(mockNotification.cancel).not.toHaveBeenCalled();
			});

			it('should show grey badge if state not up to date', function () {

			});
		});
	});