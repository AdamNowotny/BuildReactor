define(['rx', 'rx.time'], function (Rx) {
	
	'use strict';

	function activeProjects() {
		var subject = new Rx.AsyncSubject();
		chrome.extension.sendMessage({ name: 'activeProjects' }, function (response) {
			subject.onNext(response.serviceState);
			subject.onCompleted();
		});
		return subject;
	}

	var current = Rx.Observable.interval(10000)
		.startWith(-1)
		.selectMany(activeProjects);

	return {
		current: current
	};
});