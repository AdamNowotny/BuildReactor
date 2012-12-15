define(['signals', 'jquery'], function (signals, $) {

	'use strict';
	
	var AjaxRequest = function (settings) {
		if (!(this instanceof AjaxRequest)) {
			return new AjaxRequest(settings);
		}
		if (!settings.url) {
			throw {
				message: 'settings.url not set'
			};
		}
		this.settings = settings;
		this.on = {
			responseReceived: new signals.Signal(),
			errorReceived: new signals.Signal()
		};
	};

	AjaxRequest.prototype.send = function () {

		function onAjaxError(jqXhr, ajaxStatus, ajaxError) {
			var status = (jqXhr) ? jqXhr.status : null;
			var error = {
				httpStatus: status,
				ajaxStatus: ajaxStatus,
				message: (ajaxError) ? ajaxError : 'Ajax connection error',
				url: self.settings.url,
				settings: ajaxOptions
			};
			self.on.errorReceived.dispatch(error);
		}
		
		function onSuccess(data, textStatus, jqXhr) {
			self.retry = false;
			self.on.responseReceived.dispatch(data);
		}

		var self = this,
			dataType = this.settings.dataType || 'json',
			ajaxOptions = {
				type: 'GET',
				url: this.settings.url,
				beforeSend: function (request) {
					request.setRequestHeader('Accept', 'application/' + dataType);
				},
				cache: false,
				success: onSuccess,
				error: onAjaxError,
				dataType: dataType
			};
		if (this.settings.data) {
			ajaxOptions.data = this.settings.data;
		}
		if (this.settings.username && this.settings.username.trim() !== '') {
			var credentials = this.settings.username + ':' + this.settings.password;
			var base64 = btoa(credentials);
			ajaxOptions.headers = { 'Authorization': 'Basic ' + base64 };
		}
		$.ajax(ajaxOptions);
	};

	return AjaxRequest;
});