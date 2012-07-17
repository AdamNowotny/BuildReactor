define([
		'signals',
		'ajaxRequest'
	], function (signals, AjaxRequest) {

		'use strict';

		var send = function (settings) {
			var responseReceived = new signals.Signal(),
				errorReceived = new signals.Signal(),
				ajaxSettings = {
					url: settings.url,
					username: settings.username,
					password: settings.password,
					dataType: 'xml'
				},
				request = new AjaxRequest(ajaxSettings);
			responseReceived.memorize = true;
			errorReceived.memorize = true;
			request.responseReceived.addOnce(function (response) {
				responseReceived.dispatch(response);
			}, this);
			request.errorReceived.addOnce(function (ajaxError) {
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
					message: 'settings.url not set'
				};
			}
			return send(settings);
		}

		return {
			projects: projects
		};
	});