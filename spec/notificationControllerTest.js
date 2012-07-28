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
			serviceController.on.startedAll.removeAll();
			serviceController.on.brokenBuild.removeAll();
			serviceController.on.fixedBuild.removeAll();
		});

		it('should show message when build fails', function () {
			notificationController();
			var buildEvent = mockBuildEvent.withServiceName('service').withGroup('group').withBuildName('build')();

			serviceController.on.brokenBuild.dispatch(buildEvent);

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/icon.png', 'Build failed - service',  'build (group)'
			);
		});

		it('should show message if build fixed', function () {
			notificationController();
			var buildEvent = mockBuildEvent.withServiceName('service').withGroup('group').withBuildName('build')();

			serviceController.on.fixedBuild.dispatch(buildEvent);

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/icon.png', 'Build fixed - service', 'build (group)'
			);
		});

		it('should close notifications about fixed builds after 5 seconds', function () {
			notificationController();
			spyOn(mockNotification, 'cancel');
			spyOn(Timer.prototype, 'start').andCallFake(function (timeout) {
				expect(timeout).toBe(5);
				this.on.elapsed.dispatch();
			});

			serviceController.on.fixedBuild.dispatch(mockBuildEvent());

			expect(Timer.prototype.start).toHaveBeenCalledWith(5);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not close notifications about failed builds', function () {
			notificationController();
			spyOn(mockNotification, 'cancel');

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

	});
});