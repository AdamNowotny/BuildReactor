define([
	'main/notificationController',
	'main/serviceController',
	'common/resourceFinder',
	'common/timer',
	'spec/mocks/mockBuildEvent'
], function (notificationController, serviceController, resourceFinder, Timer, mockBuildEvent) {

	'use strict';
	
	describe('NotificationController', function () {

		var mockBadgeText;
		var mockBadgeColor;
		var mockNotification = {
			show: function () { },
			cancel: function () { },
			onclick: function () { }
		};
		var timeout = notificationController.notificationTimeoutInSec();

		beforeEach(function () {
			spyOn(window.webkitNotifications, 'createNotification').andReturn(mockNotification);
			spyOn(mockNotification, 'cancel');
			spyOn(resourceFinder, 'icon').andCallFake(function (url) {
				return 'prefix/' + url;
			});
			notificationController();
		});

		afterEach(function () {
			serviceController.on.startedAll.removeAll();
			serviceController.on.brokenBuild.removeAll();
			serviceController.on.fixedBuild.removeAll();
		});

		it('should show message when build fails', function () {
			var buildEvent = mockBuildEvent.serviceName('service').group('group').buildName('build').icon('icon.png')();

			serviceController.on.brokenBuild.dispatch(buildEvent);

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'prefix/icon.png', 'Build failed - service',  'build (group)'
			);
		});

		it('should show message if build fixed', function () {
			var buildEvent = mockBuildEvent.serviceName('service').group('group').buildName('build').icon('icon.png')();

			serviceController.on.fixedBuild.dispatch(buildEvent);

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'prefix/icon.png', 'Build fixed - service', 'build (group)'
			);
		});

		it('should close notifications about fixed builds after 5 seconds', function () {
			spyOn(Timer.prototype, 'start').andCallFake(function (value) {
				expect(value).toBe(timeout);
				this.on.elapsed.dispatch();
			});

			serviceController.on.fixedBuild.dispatch(mockBuildEvent());

			expect(Timer.prototype.start).toHaveBeenCalledWith(timeout);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not close notifications about failed builds', function () {
			serviceController.on.startedAll.dispatch();
			serviceController.on.brokenBuild.dispatch(mockBuildEvent());

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

		it('should close notifications about failed builds if initializing', function () {
			var timeout = notificationController.notificationTimeoutInSec();
			spyOn(Timer.prototype, 'start').andCallFake(function (value) {
				expect(value).toBe(timeout);
				this.on.elapsed.dispatch();
			});

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());

			expect(Timer.prototype.start).toHaveBeenCalledWith(timeout);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should show url when notification clicked', function () {
			spyOn(chrome.tabs, 'create');
			var buildEvent = mockBuildEvent.url('http://example.com/')();

			serviceController.on.brokenBuild.dispatch(buildEvent);
			mockNotification.onclick();

			expect(chrome.tabs.create).toHaveBeenCalled();
		});

		it('should hide notification when url shown', function () {
			spyOn(chrome.tabs, 'create').andCallFake(function (obj, callback) {
				callback();
			});

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());
			mockNotification.onclick();

			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should hide notifications about failed build if already fixed', function () {
			var brokenBuild = mockBuildEvent();
			var fixedBuild = mockBuildEvent();

			serviceController.on.brokenBuild.dispatch(brokenBuild);
			serviceController.on.fixedBuild.dispatch(fixedBuild);

			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not hide notifications about failed build if another fixed', function () {
			var brokenBuild = mockBuildEvent.serviceName('service 1')();
			var fixedBuild = mockBuildEvent.serviceName('service 2')();

			serviceController.on.brokenBuild.dispatch(brokenBuild);
			serviceController.on.fixedBuild.dispatch(fixedBuild);

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

	});
});