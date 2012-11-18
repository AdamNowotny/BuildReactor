define(['main/ajaxRequest', 'common/joinUrl', 'signals'], function (AjaxRequest, joinUrl, Signal) {
	'use strict';

	var buildTypes = function (settings) {
		var request = new AjaxRequest(buildTypesAjaxSettings(settings));
		var finished = new Signal();
		finished.memorize = true;
		request.on.responseReceived.addOnce(function (response) {
			finished.dispatch({ response: response });
		});
		request.on.errorReceived.addOnce(function (errorInfo) {
			finished.dispatch({ error: errorInfo });
		});
		request.send();
		return finished;
	};

	var buildTypesAjaxSettings = function (settings) {
		if (settings.username) {
			return {
				url: joinUrl(settings.url, 'httpAuth/app/rest/buildTypes'),
				username: settings.username,
				password: settings.password,
			};
		} else {
			return {
				url: joinUrl(settings.url, 'guestAuth/app/rest/buildTypes')
			};
		}
	};

	var build = function (settings, buildId) {
		var finished = new Signal();
		finished.memorize = true;
		var request = new AjaxRequest(buildAjaxSettings(settings, buildId));
		request.on.responseReceived.addOnce(function (response) {
			finished.dispatch({ response: response });
		});
		request.on.errorReceived.addOnce(function (errorInfo) {
			finished.dispatch({ error: errorInfo });
		});
		request.send();
		return finished;
	};

	var buildAjaxSettings = function (settings, buildId) {
		if (settings.username) {
			var urlPath = 'httpAuth/app/rest/buildTypes/id:' + buildId + '/builds/lookupLimit:1';
			return {
				url: joinUrl(settings.url, urlPath),
				username: settings.username,
				password: settings.password,
			};
		} else {
			var url = 'guestAuth/app/rest/buildTypes/id:' + buildId + '/builds/lookupLimit:1';
			return {
				url: joinUrl(settings.url, url)
			};
		}
	};

	return {
		buildTypes: buildTypes,
		build: build
	};
});