define([
	'main/notificationController',
	'main/serviceController',
	'rx',
	'rx.testing'
], function (notificationController, serviceController, Rx) {

	'use strict';
	
	describe('notificationController', function () {

		var mockBadgeText;
		var mockBadgeColor;
		var mockNotification;
		var subscription;
		var scheduler;

		beforeEach(function () {
			scheduler = new Rx.TestScheduler();
			mockNotification = {
				show: jasmine.createSpy(),
				cancel: jasmine.createSpy().andCallFake(function () {
					this.onclose();
				})
			};
			spyOn(window.webkitNotifications, 'createNotification').andReturn(mockNotification);
			subscription = notificationController.init({ timeout: 5000, scheduler: scheduler });
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
				'src/services/icon.png', 'build (group)', 'Broken'
			);
		});

		it('should show who broke the build when changes available', function () {
			serviceController.events.onNext({ eventName: 'buildBroken', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png',
				changes: [{ name: 'Adam' }, { name: 'Some User' }]
			}});

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/services/icon.png', 'build (group)', 'Broken by Adam, Some User'
			);
		});

		it('should not show message when build fails but is disabled', function () {
			serviceController.events.onNext({ eventName: 'buildBroken', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png',
				isDisabled: true
			}});

			expect(window.webkitNotifications.createNotification).not.toHaveBeenCalled();
		});

		it('should show message if build fixed', function () {
			serviceController.events.onNext({ eventName: 'buildFixed', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png'
			}});

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/services/icon.png', 'build (group)', 'Fixed'
			);
		});

		it('should show who fixed the build when changes available', function () {
			serviceController.events.onNext({ eventName: 'buildFixed', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png',
				changes: [{ name: 'Adam' }, { name: 'Some User' }]
			}});

			expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
				'src/services/icon.png', 'build (group)', 'Fixed by Adam, Some User'
			);
		});

		it('should not show message if build fixed but is disabled', function () {
			serviceController.events.onNext({ eventName: 'buildFixed', details: {
				serviceName: 'service',
				group: 'group',
				name: 'build',
				serviceIcon: 'icon.png',
				isDisabled: true
			}});

			expect(window.webkitNotifications.createNotification).not.toHaveBeenCalled();
		});

		it('should close notifications about fixed builds after 5 seconds', function () {
			serviceController.events.onNext({ eventName: 'buildFixed', details: {} });

			scheduler.advanceBy(3000);
			mockNotification.ondisplay();
			
			scheduler.advanceBy(3000);
			expect(mockNotification.cancel).not.toHaveBeenCalled();
			scheduler.advanceBy(5000);
			expect(mockNotification.cancel).toHaveBeenCalled();
		});

		it('should not close notifications about failed builds', function () {
			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			expect(mockNotification.cancel).not.toHaveBeenCalled();
		});

		it('should close notifications about failed builds after 5 seconds if initializing', function () {
			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });

			mockNotification.ondisplay();
			scheduler.advanceBy(5000);

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