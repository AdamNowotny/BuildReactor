define([
		'signals',
		'main/ajaxRequest',
		'common/joinUrl'
	], function (signals, AjaxRequest, joinUrl) {

		'use strict';

		var send = function (ajaxSettings) {
			var completed = new signals.Signal();
			var request = new AjaxRequest(ajaxSettings);
			completed.memorize = true;
			request.on.responseReceived.addOnce(function (response) {
				completed.dispatch({ response: response });
			}, this);
			request.on.errorReceived.addOnce(function (ajaxError) {
				completed.dispatch({ error: ajaxError });
			}, this);
			request.send();
			return completed;
		};

		var builder = function (settings, id) {
			if (!(settings && settings.url && settings.url !== '')) {
				throw {
					name: 'ArgumentInvalid',
					message: 'settings.url not set'
				};
			}
			var ajaxSettings = {
				url: joinUrl(settings.url, 'json/builders/' + id),
				username: settings.username,
				password: settings.password
			};
			return send(ajaxSettings);
		};

		var lastCompletedBuild = function (settings, id) {
			if (!(settings && settings.url && settings.url !== '')) {
				throw {
					name: 'ArgumentInvalid',
					message: 'settings.url not set'
				};
			}
			var ajaxSettings = {
				url: joinUrl(settings.url, 'json/builders/' + id + '/builds/-1'),
				username: settings.username,
				password: settings.password
			};
			return send(ajaxSettings);
		};

		return {
			builder: builder,
			lastCompletedBuild: lastCompletedBuild
		};
	});
