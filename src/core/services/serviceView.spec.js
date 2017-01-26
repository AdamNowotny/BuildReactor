import Rx from 'rx/dist/rx.testing';
import events from 'core/events';
import serviceView from 'core/services/serviceView';
import sinon from 'sinon';

describe('core/services/serviceView', () => {

	const eventsSubject = new Rx.Subject();

	beforeEach(() => {
		sinon.stub(events, 'getByName');
		sinon.stub(events, 'push');
		events.getByName.returns(eventsSubject);
		serviceView.init();
		events.push.reset();
	});

	afterEach(() => {
		serviceView.dispose();
        events.push.restore();
        events.getByName.restore();
    });

	it('should update state on serviceUpdated', () => {
		eventsSubject.onNext({
			eventName: 'serviceUpdated',
			source: 'service1',
			details: [{ id: 'abc' }]
		});

		sinon.assert.calledOnce(events.push);
		sinon.assert.calledWith(events.push, {
			eventName: 'stateUpdated',
			source: 'serviceView',
			details: [{
				name: 'service1',
				items: [{ id: 'abc' }]
			}]
		});
	});

});
