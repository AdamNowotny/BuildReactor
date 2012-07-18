define(['signals', 'jquery'], function (signals, $) {

	var AjaxRequest = function (settings) {
		if (!settings.url) {
			throw {
				message: 'options.url not set'
			};
		}
		this.settings = settings;
		this.responseReceived = new signals.Signal();
		this.errorReceived = new signals.Signal();
	};

	AjaxRequest.prototype.send = function () {

		function onAjaxError(jqXhr, ajaxStatus, ajaxError) {
			var error = {
				httpStatus: (jqXhr) ? jqXhr.status : null,
				ajaxStatus: ajaxStatus,
				message: (ajaxError !== '') ? ajaxError : 'Ajax connection error',
				url: self.settings.url,
				settings: ajaxOptions
			};
			self.errorReceived.dispatch(error);
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
				success: function (data, textStatus, jqXhr) {
					self.responseReceived.dispatch(data);
				},
				error: onAjaxError,
				dataType: dataType
			};
		if (this.settings.username != null && this.settings.username.trim() !== '') {
			ajaxOptions.username = this.settings.username;
			ajaxOptions.password = this.settings.password;
			ajaxOptions.data = { os_authType: 'basic' };
		}
		$.ajax(ajaxOptions);

		
	};

	return AjaxRequest;
});