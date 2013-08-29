/* global chrome: false */
define([
	'main/notificationController',
	'main/serviceController',
	'common/chromeApi',
	'rx',
	'rx.testing'
], function (notificationController, serviceController, chromeApi, Rx) {

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
			spyOn(chromeApi, 'isDashboardActive').andReturn(Rx.Observable.returnValue(false));
			subscription = notificationController.init({ timeout: 5000, scheduler: scheduler });
		});

		afterEach(function () {
			subscription.dispose();
		});

		describe('build broken', function () {

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

			it('should show max 4 users who broke the build', function () {
				serviceController.events.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					group: 'group',
					name: 'build',
					serviceIcon: 'icon.png',
					changes: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) {
						return { name: 'User' + d };
					})
				}});

				expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
					'src/services/icon.png', 'build (group)', 'Broken by User1, User2, User3, User4, ...'
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

			it('should not close notifications about failed builds', function () {
				serviceController.events.onNext({ eventName: 'buildFixed', details: {} });
				mockNotification.ondisplay();

				expect(mockNotification.cancel).not.toHaveBeenCalled();
			});

		});

		describe('build fixed', function () {

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

		});

		describe('unstable', function () {

			it('should show message when unstable build fails', function () {
				serviceController.events.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					group: 'group',
					name: 'build',
					serviceIcon: 'icon.png',
					tags: [{ name: 'Unstable' }]
				}});

				expect(window.webkitNotifications.createNotification).toHaveBeenCalledWith(
					'src/services/icon.png', 'build (group)', 'Unstable, broken'
				);
			});

			it('should close notifications about unstable builds after 5 seconds', function () {
				serviceController.events.onNext({
					eventName: 'buildBroken',
					details: {
						tags: [{ name: 'Unstable' }]
					}
				});

				mockNotification.ondisplay();
				
				scheduler.advanceBy(5000);
				expect(mockNotification.cancel).toHaveBeenCalled();
			});

		});

		it('should not show buildBroken notifications when initializing', function () {
			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });

			scheduler.advanceBy(5000);

			expect(mockNotification.show).not.toHaveBeenCalled();
		});

		it('should show notifications after initialized', function () {
			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });
			serviceController.events.onNext({ eventName: 'buildFixed', details: {} });
			serviceController.events.onNext({ eventName: 'servicesInitialized', details: {} });
			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });
			serviceController.events.onNext({ eventName: 'buildFixed', details: {} });

			scheduler.advanceBy(5000);

			expect(mockNotification.show.callCount).toBe(2);
		});

		it('should not show any notifications when dashboard active', function () {
			chromeApi.isDashboardActive.andReturn(Rx.Observable.returnValue(true));
			serviceController.events.onNext({ eventName: 'buildBroken', details: {} });
			serviceController.events.onNext({ eventName: 'buildFixed', details: {} });

			scheduler.advanceBy(5000);

			expect(mockNotification.show).not.toHaveBeenCalled();
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

		it('should not hide notifications about all failed builds if one fixed', function () {
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