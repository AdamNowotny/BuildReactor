define([
		'signals',
		'../ajaxRequest',
        'xml2json'
	], function (signals, AjaxRequest) {

	    var send = function (settings) {
	        var responseReceived = new signals.Signal();
	        var errorReceived = new signals.Signal();
	        responseReceived.memorize = true;
	        errorReceived.memorize = true;
	        var ajaxSettings = {
		        url: settings.url,
		        username: settings.username,
		        password: settings.password,
		        dataType: 'xml'
		    };
			var request = new AjaxRequest(ajaxSettings);
			request.responseReceived.addOnce(function (response) {
			    var responseJson = $.xml2json(response);
				responseReceived.dispatch(responseJson);
			}, this);
			request.errorReceived.addOnce(function(ajaxError) {
			    var errorJson = $.xml2json(ajaxError);
			    errorReceived.dispatch(errorJson);
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