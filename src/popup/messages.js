define([
	'common/chromeApi',
	'rx',
	'rx.binding'
], function (chromeApi, Rx) {

	'use strict';

	var init = function () {
		var port = chromeApi.connect({ name: 'state' });
		port.onMessage.addListener(function (message) {
			activeProjects.onNext(message);
		});
	};

	var activeProjects = new Rx.BehaviorSubject([]);

	return {
		init: init,
		activeProjects: activeProjects
	};
});