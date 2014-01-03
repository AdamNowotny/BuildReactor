define(['rx'], function (Rx) {

	'use strict';

	var load = function (settings) {
		var subject = new Rx.AsyncSubject();
		require(['core/services/' + settings.baseUrl + '/buildService'], function (BuildService) {
			var service = new BuildService(settings);
			subject.onNext(service);
			subject.onCompleted();
		});
		return subject;
	};

	return {
		load: load
	};
});