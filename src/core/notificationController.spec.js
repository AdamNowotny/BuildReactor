/* global chrome: false */
define([
	'core/notificationController',
	'core/events',
	'common/chromeApi',
	'rx',
	'rx.testing'
], function (notificationController, events, chromeApi, Rx) {

	'use strict';
	
	describe('notificationController', function () {

		var buildBrokenEvents, buildFixedEvents;
		var servicesInitializingEvents, servicesInitializedEvents;
		var passwordExpiredEvents;
		var mockNotification;
		var scheduler;

		beforeEach(function () {
			buildBrokenEvents = new Rx.Subject();
			buildFixedEvents = new Rx.Subject();
			servicesInitializingEvents = new Rx.Subject();
			servicesInitializedEvents = new Rx.Subject();
			passwordExpiredEvents = new Rx.Subject();
			spyOn(events, 'getByName').andCallFake(function (name) {
				switch (name) {
					case 'buildBroken':
						return buildBrokenEvents;
					case 'buildFixed':
						return buildFixedEvents;
					case 'servicesInitializing':
						return servicesInitializingEvents;
					case 'servicesInitialized':
						return servicesInitializedEvents;
					case 'passwordExpired':
						return passwordExpiredEvents;
				}
			});
			scheduler = new Rx.TestScheduler();
			mockNotification = {
				close: jasmine.createSpy(),
				onshow: jasmine.createSpy(),
				onclick: jasmine.createSpy()
			};
			spyOn(window, 'Notification').andReturn(mockNotification);
			spyOn(chromeApi, 'isDashboardActive').andReturn(Rx.Observable.returnValue(false));
			notificationController.init({ timeout: 5000, scheduler: scheduler });
		});

		describe('build broken', function () {

			it('should show message when build fails', function () {
				buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png'
				}});

				expect(window.Notification).toHaveBeenCalledWith(
					'build (service)', {
						icon: 'src/core/services/test/icon.png',
						body: 'Broken',
						tag: 'service_build'
					}
				);
			});

			it('should show who broke the build when changes available', function () {
				buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png',
					changes: [{ name: 'User 1' }, { name: 'User 2' }]
				}});

				expect(window.Notification).toHaveBeenCalledWith(
					'build (service)', {
						icon: 'src/core/services/test/icon.png',
						body: 'Broken by User 1, User 2',
						tag: 'service_build'
					}
				);
			});

			it('should show max 4 users who broke the build', function () {
				buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png',
					changes: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) {
						return { name: 'User ' + d };
					})
				}});

				expect(window.Notification).toHaveBeenCalledWith(
					'build (service)', {
						icon: 'src/core/services/test/icon.png',
						body: 'Broken by User 1, User 2, User 3, User 4, ...',
						tag: 'service_build'
					}
				);
			});

			it('should not show message when build fails but is disabled', function () {
				buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png',
					isDisabled: true
				}});

				expect(window.Notification).not.toHaveBeenCalled();
			});

			it('should not close notifications about failed builds', function () {
				buildBrokenEvents.onNext({ eventName: 'buildFixed', details: {} });
				mockNotification.onshow();

				expect(mockNotification.close).not.toHaveBeenCalled();
			});

		});

		describe('build fixed', function () {

			it('should show message if build fixed', function () {
				buildFixedEvents.onNext({ eventName: 'buildFixed', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png'
				}});

				expect(window.Notification).toHaveBeenCalledWith(
					'build (service)', {
						icon: 'src/core/services/test/icon.png',
						body: 'Fixed',
						tag: 'service_build'
					}
				);
			});

			it('should show who fixed the build when changes available', function () {
				buildFixedEvents.onNext({ eventName: 'buildFixed', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png',
					changes: [{ name: 'User 1' }, { name: 'User 2' }]
				}});

				expect(window.Notification).toHaveBeenCalledWith(
					'build (service)', {
						icon: 'src/core/services/test/icon.png',
						body: 'Fixed by User 1, User 2',
						tag: 'service_build'
					}
				);
			});

			it('should not show message if build fixed but is disabled', function () {
				buildFixedEvents.onNext({ eventName: 'buildFixed', details: {
					serviceName: 'service',
					name: 'build',
					isDisabled: true
				}});

				expect(window.Notification).not.toHaveBeenCalled();
			});

			it('should close notifications about fixed builds after 5 seconds', function () {
				buildFixedEvents.onNext({ eventName: 'buildFixed', details: {} });

				scheduler.advanceBy(3000);
				mockNotification.onshow();
				
				scheduler.advanceBy(3000);
				expect(mockNotification.close).not.toHaveBeenCalled();
				scheduler.advanceBy(5000);
				expect(mockNotification.close).toHaveBeenCalled();
			});

		});

		describe('unstable', function () {

			it('should show message when unstable build fails', function () {
				buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png',
					tags: [{ name: 'Unstable' }]
				}});

				expect(window.Notification).toHaveBeenCalledWith(
					'build (service)', {
						icon: 'src/core/services/test/icon.png',
						body: 'Unstable, broken',
						tag: 'service_build'
					}
				);
			});

			it('should close notifications about unstable builds after 5 seconds', function () {
				buildBrokenEvents.onNext({
					eventName: 'buildBroken',
					details: {
						tags: [{ name: 'Unstable' }]
					}
				});

				mockNotification.onshow();
				
				scheduler.advanceBy(5000);
				expect(mockNotification.close).toHaveBeenCalled();
			});

		});

		it('should show message when password expired', function () {
			passwordExpiredEvents.onNext({
				eventName: 'passwordExpired',
				details: {
					serviceName: 'service',
					name: 'build',
					serviceIcon: 'test/icon.png'
				},
				source: 'service'
			});


			expect(window.Notification).toHaveBeenCalledWith(
				'service', {
					icon: 'src/core/services/test/icon.png',
					body: 'Password expired. Service has been disabled.',
					tag: 'service_disabled'
				}
			);
		});

		it('should not show buildBroken notifications when initializing', function () {
			servicesInitializingEvents.onNext({ eventName: 'servicesInitializing' });
			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {} });

			scheduler.advanceBy(5000);

			expect(window.Notification).not.toHaveBeenCalled();
		});

		it('should show notifications after initialized', function () {
			servicesInitializingEvents.onNext({ eventName: 'servicesInitializing' });
			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {} });
			buildFixedEvents.onNext({ eventName: 'buildFixed', details: {} });
			servicesInitializedEvents.onNext({ eventName: 'servicesInitialized', details: {} });
			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {} });
			buildFixedEvents.onNext({ eventName: 'buildFixed', details: {} });

			scheduler.advanceBy(5000);

			expect(window.Notification.callCount).toBe(2);
		});

		it('should not show any notifications when dashboard active', function () {
			chromeApi.isDashboardActive.andReturn(Rx.Observable.returnValue(true));
			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {} });
			buildFixedEvents.onNext({ eventName: 'buildFixed', details: {} });

			scheduler.advanceBy(5000);

			expect(window.Notification).not.toHaveBeenCalled();
		});

		it('should show url when notification clicked', function () {
			spyOn(chrome.tabs, 'create');

			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {} });
			mockNotification.onclick();
			
			expect(chrome.tabs.create).toHaveBeenCalled();
		});

		it('should hide notification when url shown', function () {
			spyOn(chrome.tabs, 'create').andCallFake(function (obj, callback) {
				callback();
			});

			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {} });
			mockNotification.onclick();

			expect(mockNotification.close).toHaveBeenCalled();
		});

		it('should hide notifications about failed build if already fixed', function () {
			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: { serviceName: '1'} });
			buildFixedEvents.onNext({ eventName: 'buildFixed', details: { serviceName: '1'} });

			expect(mockNotification.close).toHaveBeenCalled();
		});

		it('should not hide notifications about all failed builds if one fixed', function () {
			buildBrokenEvents.onNext({ eventName: 'buildBroken', details: {
				serviceName: 'service 1'
			} });
			buildFixedEvents.onNext({ eventName: 'buildFixed', details: {
				serviceName: 'service 2'
			} });

			expect(mockNotification.close).not.toHaveBeenCalled();
		});
		
	});
});