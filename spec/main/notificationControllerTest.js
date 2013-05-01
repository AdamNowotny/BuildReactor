define([
	'main/notificationController',
	'main/serviceController',
	'common/timer'
], function (notificationController, serviceController, Timer) {

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
		var subscription;

		beforeEach(function () {
			spyOn(window.webkitNotifications, 'createNotification').andReturn(mockNotification);
			spyOn(mockNotification, 'cancel');
			spyOn(mockNotification, 'show');
			spyOn(mockNotification, 'onclick');
			subscription = notificationController();
		});

		afterEach(function () {
			subscription.dispose();
		});

		it('should show message when build fails', function () {
			serviceController.events.onNext({ eventName: 'buildBroken', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png'
			}});

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/services/icon.png', 'Build failed - service',  'build (group)'
			);
		});

		it('should show message if build fixed', function () {
			serviceController.events.onNext({ eventName: 'buildFixed', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png'
			}});

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/services/icon.png', 'Build fixed - service', 'build (group)'
			);
		});

		it('should close notifications about fixed builds after 5 seconds', function () {
			spyOn(Timer.prototype, 'start').andCallFake(function (value) {
				expect(value).toBe(timeout);
				this.on.elapsed.dispatch();
			});

			serviceController.events.onNext({ eventName: 'buildFixed', details: {} });

			expect(Timer.prototype.start).toHaveBeenCalledWith(timeout);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not close notifications about failed builds', function () {
			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

		it('should close notifications about failed builds if initializing', function () {
			var timeout = notificationController.notificationTimeoutInSec();
			spyOn(Timer.prototype, 'start').andCallFake(function (value) {
				expect(value).toBe(timeout);
				this.on.elapsed.dispatch();
			});

			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });

			expect(Timer.prototype.start).toHaveBeenCalledWith(timeout);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should show url when notification clicked', function () {
			spyOn(chrome.tabs, 'create');

			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });
			mockNotification.onclick();
			
			expect(chrome.tabs.create).toHaveBeenCalled();
		});

		it('should hide notification when url shown', function () {
			spyOn(chrome.tabs, 'create').andCallFake(function (obj, callback) {
				callback();
			});

			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });
			mockNotification.onclick();

			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should hide notifications about failed build if already fixed', function () {
			serviceController.events.onNext({ eventName: 'buildBroken', details: { serviceName: '1'} });
			serviceController.events.onNext({ eventName: 'buildFixed', details: { serviceName: '1'} });

			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not hide notifications about failed build if another fixed', function () {
			serviceController.events.onNext({ eventName: 'buildBroken', details: {
				serviceName: 'service 1'
			} });
			serviceController.events.onNext({ eventName: 'buildFixed', details: {
				serviceName: 'service 2'
			} });

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

	});
});