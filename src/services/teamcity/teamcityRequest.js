define(['main/ajaxRequest', 'common/joinUrl', 'signals'], function (AjaxRequest, joinUrl, Signal) {
	'use strict';

	var build = function (settings, buildId) {
		var completed = new Signal();
		completed.memorize = true;
		var request = new AjaxRequest(buildAjaxSettings(settings, buildId));
		request.on.responseReceived.addOnce(function (response) {
			completed.dispatch({ response: response });
		});
		request.on.errorReceived.addOnce(function (errorInfo) {
			completed.dispatch({ error: errorInfo });
		});
		request.send();
		return completed;
	};

	var buildAjaxSettings = function (settings, buildId) {
		var urlPath = ((settings.username) ? 'httpAuth' : 'guestAuth');
		urlPath += '/app/rest/buildTypes/id:' + buildId + '/builds/count:1';
		return createAjaxSettings(settings, urlPath);
	};

	var buildRunningAjaxSettings = function (settings, buildId) {
		var urlPath = ((settings.username) ? 'httpAuth' : 'guestAuth');
		urlPath += '/app/rest/buildTypes/id:' + buildId + '/builds/running:any';
		return createAjaxSettings(settings, urlPath);
	};

	var buildRunning = function (settings, buildId) {
		var completed = new Signal();
		completed.memorize = true;
		var request = new AjaxRequest(buildRunningAjaxSettings(settings, buildId));
		request.on.responseReceived.addOnce(function (response) {
			completed.dispatch({ response: response });
		});
		request.on.errorReceived.addOnce(function (errorInfo) {
			completed.dispatch({ error: errorInfo });
		});
		request.send();
		return completed;
	};

	var createAjaxSettings = function (settings, urlPath) {
		if (settings.username) {
			return {
				url: joinUrl(settings.url, urlPath),
				username: settings.username,
				password: settings.password,
			};
		} else {
			return {
				url: joinUrl(settings.url, urlPath)
			};
		}
	};

	return {
		build: build,
		buildRunning: buildRunning
	};
});