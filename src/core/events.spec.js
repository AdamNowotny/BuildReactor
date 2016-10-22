define([
	'core/events',
	'core/services/serviceController',
	'rx',
	'rx.testing'
], function(events, serviceController, Rx) {
	'use strict';

	var onNext = Rx.ReactiveTest.onNext;
	var scheduler;

	beforeEach(function() {
		scheduler = new Rx.TestScheduler();
	});

	describe('events', function() {

		it('should publish on serviceController.events', function() {
			scheduler.scheduleAbsolute(300, function() {
				serviceController.events.onNext({
					eventName: 'eventName',
					details: {
						serviceName: 'service',
						group: 'group',
						name: 'build',
						serviceIcon: 'icon.png'
					}
				});
			});
			var result = scheduler.startWithCreate(function() {
				return events.getByName('eventName');
			});

			expect(result.messages).toHaveEqualElements(onNext(300, {
				eventName: 'eventName',
				details: {
					serviceName: 'service',
					group: 'group',
					name: 'build',
					serviceIcon: 'icon.png'
				}
			}));
		});

		it('should only publish on subscribed events', function() {
			scheduler.scheduleAbsolute(300, function() {
				serviceController.events.onNext({
					eventName: 'eventName',
					details: {
						serviceName: 'service',
						group: 'group',
						name: 'build',
						serviceIcon: 'icon.png'
					}
				});
			});
			var result = scheduler.startWithCreate(function() {
				return events.getByName('otherEventName');
			});

			expect(result.messages).toHaveEqualElements();

		});
	});
});
