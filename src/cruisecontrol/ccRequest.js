define([
		'signals',
		'../ajaxRequest',
		'amdUtils/string/endsWith'
	], function (signals, AjaxRequest, endsWith) {

	    var send = function (settings) {
	        var responseReceived = new signals.Signal();
	        var errorReceived = new signals.Signal();
	        var ajaxSettings = {
		        url: settings.url,
		        username: settings.username,
		        password: settings.password,
		        dataType: 'xml'
		    };
			var request = new AjaxRequest(ajaxSettings);
			request.responseReceived.addOnce(function(response) {
				responseReceived.dispatch(response);
			}, this);
			request.errorReceived.addOnce(function(ajaxError) {
				errorReceived.dispatch(ajaxError);
			}, this);
			request.send();
			return {
			    responseReceived: responseReceived,
			    errorReceived: errorReceived
			};
	    };

		var projects = function(settings) {
			if (!(settings && settings.url && settings.url != '')) {
			    throw {
			        message: 'settings.url-input not set'
			    };
			}
			return send(settings);
		};

		return {
			projects: projects
		};
	});