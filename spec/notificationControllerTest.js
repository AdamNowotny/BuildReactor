define([
	'notificationController',
	'serviceController',
	'timer',
	'spec/mocks/mockBuildEvent'
], function (notificationController, serviceController, Timer, mockBuildEvent) {

	'use strict';
	
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

		it('should show message when build fails', function () {
			notificationController.initialize();
			var buildEvent = mockBuildEvent.withServiceName('service').withGroup('group').withBuildName('build')();

			serviceController.buildFailed.dispatch(buildEvent);

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/icon.png', 'Build failed - service',  'build (group)'
			);
		});

		it('should show message if build fixed', function () {
			notificationController.initialize();
			var buildEvent = mockBuildEvent.withServiceName('service').withGroup('group').withBuildName('build')();

			serviceController.buildFixed.dispatch(buildEvent);

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/icon.png', 'Build fixed - service', 'build (group)'
			);
		});

		it('should close notifications about fixed builds after 5 seconds', function () {
			notificationController.initialize();
			spyOn(mockNotification, 'cancel');
			spyOn(Timer.prototype, 'start').andCallFake(function (timeout) {
				expect(timeout).toBe(5);
				this.elapsed.dispatch();
			});

			serviceController.buildFixed.dispatch(mockBuildEvent());

			expect(Timer.prototype.start).toHaveBeenCalledWith(5);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not close notifications about failed builds', function () {
			notificationController.initialize();
			spyOn(mockNotification, 'cancel');

			serviceController.buildFailed.dispatch(mockBuildEvent());

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

	});
});