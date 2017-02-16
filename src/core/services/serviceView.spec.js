import Rx from 'rx/dist/rx.testing';
import events from 'core/events';
import serviceView from 'core/services/serviceView';
import sinon from 'sinon';

describe('core/services/serviceView', () => {

	const serviceUpdatedSubject = new Rx.Subject();
	const serviceUpdateFailedSubject = new Rx.Subject();
	const servicesInitializingSubject = new Rx.Subject();

	beforeEach(() => {
		sinon.stub(events, 'getByName');
		sinon.stub(events, 'push');
		events.getByName.onCall(0).returns(serviceUpdatedSubject);
		events.getByName.onCall(1).returns(serviceUpdateFailedSubject);
		events.getByName.onCall(2).returns(servicesInitializingSubject);
		serviceView.init();
		events.push.reset();
	});

	afterEach(() => {
		serviceView.dispose();
        events.push.restore();
        events.getByName.restore();
    });

	it('should update state on serviceUpdated', () => {
		serviceUpdatedSubject.onNext({
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

	it('should mark builds as offline on serviceUpdateFailed', () => {
		serviceUpdatedSubject.onNext({
			eventName: 'serviceUpdated',
			source: 'service1',
			details: [{ id: 'abc' }]
		});
		serviceUpdateFailedSubject.onNext({
			eventName: 'serviceUpdateFailed',
			source: 'service1',
			details: null
		});

		sinon.assert.calledWith(events.push, {
			eventName: 'stateUpdated',
			source: 'serviceView',
			details: [{
				name: 'service1',
				items: [{
					id: 'abc', error: { message: 'Service update failed' }
				}]
			}]
		});
	});

	it('should reset state on servicesInitializing', () => {
		servicesInitializingSubject.onNext({
			eventName: 'servicesInitializing',
			source: 'serviceController',
			details: [{
				name: 'service1',
				projects: ['project1', 'project2']
			}]
		});

		sinon.assert.calledOnce(events.push);
		sinon.assert.calledWith(events.push, {
			eventName: 'stateUpdated',
			source: 'serviceView',
			details: [{
				name: 'service1',
				items: [
					{
						id: 'project1',
						name: 'project1',
						group: null,
						webUrl: null,
						isBroken: false,
						isRunning: false,
						isDisabled: false,
						tags: [],
						changes: []
					},
					{
						id: 'project2',
						name: 'project2',
						group: null,
						webUrl: null,
						isBroken: false,
						isRunning: false,
						isDisabled: false,
						tags: [],
						changes: []
					}
				]
			}]
		});
	});

});
