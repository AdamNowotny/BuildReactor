import Rx from 'rx';

let events = new Rx.Subject();

const getByName = function(name) {
	return events.where((event) => event.eventName === name);
};

const push = function(event) {
	events.onNext(event);
};

const reset = () => {
	events.onCompleted();
	events.dispose();
	events = new Rx.Subject();
};

export default {
	all: events,
	getByName,
	push,
	reset
};
