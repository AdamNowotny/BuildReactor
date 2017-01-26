import Rx from 'rx/dist/rx.testing';
import events from 'core/events';

const onNext = Rx.ReactiveTest.onNext;
let scheduler;

beforeEach(() => {
	scheduler = new Rx.TestScheduler();
});

describe('events', () => {

	it('should push events', () => {
		scheduler.scheduleAbsolute(null, 300, () => {
			events.push({
				eventName: 'eventName',
				details: {
					serviceName: 'service',
					group: 'group',
					name: 'build',
					serviceIcon: 'icon.png'
				}
			});
		});
		const result = scheduler.startScheduler(() => events.getByName('eventName'));

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

	it('should only publish on subscribed events', () => {
		scheduler.scheduleAbsolute(null, 300, () => {
			events.push({
				eventName: 'eventName',
				details: {
					serviceName: 'service',
					group: 'group',
					name: 'build',
					serviceIcon: 'icon.png'
				}
			});
		});
		const result = scheduler.startScheduler(() => events.getByName('otherEventName'));

		expect(result.messages).toHaveEqualElements();

	});
});
