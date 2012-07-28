define(['signals', 'jquery', 'has'], function (signals, $, has) {

	'use strict';
	
	var cookieExpiredStatusCode = 401;

	var AjaxRequest = function (settings, options) {
		if (!(this instanceof AjaxRequest)) {
			return new AjaxRequest(settings);
		}
		if (!settings.url) {
			throw {
				message: 'options.url not set'
			};
		}
		this.settings = settings;
		this.options = options;
		this.on = {
			responseReceived: new signals.Signal(),
			errorReceived: new signals.Signal()
		};
		this.retry = false;
	};

	function removeCookies(url, cookieName) {
		chrome.cookies.remove({ url: url, name: cookieName });
	}
	
	AjaxRequest.prototype.send = function () {

		function onAjaxError(jqXhr, ajaxStatus, ajaxError) {
			var status = (jqXhr) ? jqXhr.status : null;
			if (!self.retry && status === cookieExpiredStatusCode) {
				removeCookies(self.settings.url, self.options.sessionCookie);
				self.retry = true;
				self.send();
			} else {
				var error = {
					httpStatus: status,
					ajaxStatus: ajaxStatus,
					message: (ajaxError) ? ajaxError : 'Ajax connection error',
					url: self.settings.url,
					settings: ajaxOptions
				};
				self.retry = false;
				self.on.errorReceived.dispatch(error);
				if (has('debug')) { self.all.errorReceived.dispatch(error); }
			}
		}
		
		function onSuccess(data, textStatus, jqXhr) {
			self.retry = false;
			self.on.responseReceived.dispatch(data);
			if (has('debug')) { self.all.responseReceived.dispatch(data); }
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
		if (this.settings.username && this.settings.username.trim() !== '') {
			ajaxOptions.username = this.settings.username;
			ajaxOptions.password = this.settings.password;
			ajaxOptions.data = { os_authType: 'basic' };
		}
		$.ajax(ajaxOptions);
	};

	if (has('debug')) {
		AjaxRequest.prototype.all = {
			responseReceived: new signals.Signal(),
			errorReceived: new signals.Signal()
		};
	}

	return AjaxRequest;
});