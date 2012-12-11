define([
		'signals',
		'main/ajaxRequest',
		'common/joinUrl'
	], function (signals, AjaxRequest, joinUrl) {

		'use strict';

		var send = function (settings) {
			var responseReceived = new signals.Signal(),
				errorReceived = new signals.Signal(),
				ajaxSettings = {
					url: settings.url,
					username: settings.username,
					password: settings.password
				},
				request = new AjaxRequest(ajaxSettings);
			responseReceived.memorize = true;
			errorReceived.memorize = true;
			request.on.responseReceived.addOnce(function (response) {
				responseReceived.dispatch(response);
			}, this);
			request.on.errorReceived.addOnce(function (ajaxError) {
				errorReceived.dispatch(ajaxError);
			}, this);
			request.send();
			return {
				responseReceived: responseReceived,
				errorReceived: errorReceived
			};
		};

		function projects(settings) {
			if (!(settings && settings.url && settings.url !== '')) {
				throw {
					name: 'ArgumentInvalid',
					message: 'settings.url not set'
				};
			}
			settings.url = joinUrl(settings.url, 'api/json?pretty=true&depth=1');
			return send(settings);
		}

		return {
			projects: projects
		};
	});