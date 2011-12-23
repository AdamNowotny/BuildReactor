define(['jquery', 'signals'], function ($, signals) {

	var AjaxRequest = function (settings) {
		Contract.expectString(settings.url, 'options.url not set');
		this.settings = settings;
		this.responseReceived = new signals.Signal();
		this.errorReceived = new signals.Signal();
	};

	AjaxRequest.prototype.send = function () {
		var self = this;
		var ajaxOptions = {
			type: 'GET',
			url: this.settings.url,
			username: this.settings.username, // optional
			password: this.settings.password, // optional
			beforeSend: function(request) {
				request.setRequestHeader('Accept', 'application/json');
			},
			cache: false,
			success: onAjaxSuccess,
			error: onAjaxError,
			data: {
				os_authType: 'basic'
			},
			dataType: 'json'
		};
		$.ajax(ajaxOptions);

		function onAjaxSuccess(data, textStatus, jqXhr) {
			self.responseReceived.dispatch(data);
		}

		function onAjaxError(jqXhr, ajaxStatus, ajaxError) {
			var error = {
				httpStatus: (jqXhr) ? jqXhr.status : null,
				ajaxStatus: ajaxStatus,
				message: (ajaxError != '') ? ajaxError : 'Cannot connect to ' + self.settings.url,
				settings: ajaxOptions
			};
			self.errorReceived.dispatch(error);
		}
	};


	return AjaxRequest;
});