define([
		'signals',
		'main/ajaxRequest',
		'common/joinUrl',
		'mout/string/interpolate'
	], function (signals, AjaxRequest, joinUrl, interpolate) {

		'use strict';
		
		var unauthorizedStatusCode = 401;

		var BambooRequest = function (settings) {
			if (!(settings && settings.url && settings.url !== '')) {
				throw {
					name: 'ArgumentInvalid',
					message: 'settings.url not set'
				};
			}
			this.settings = settings;
			this.on = {
				responseReceived: new signals.Signal(),
				errorReceived: new signals.Signal()
			};
		};

		function createAjaxRequestSettings(settings, urlPath) {
			var url = joinUrl(settings.url, 'rest/api/latest/' + urlPath);
			var ajaxSettings =  { url: url };
			if (settings.username && settings.username.trim() !== '') {
				ajaxSettings.username = settings.username;
				ajaxSettings.password = settings.password;
			}
			return ajaxSettings;
		}

		BambooRequest.prototype.send = function (urlPath) {
			var callCount = 0;
			var ajaxSettings = createAjaxRequestSettings(this.settings, urlPath);
			var request = new AjaxRequest(ajaxSettings);
			request.on.responseReceived.addOnce(function (response) {
				this.on.responseReceived.dispatch(response);
			}, this);
			request.on.errorReceived.add(function (ajaxError) {
				if (ajaxError.httpStatus === unauthorizedStatusCode && callCount === 1) {
					removeSessionCookie(ajaxSettings.url);
					callCount++;
					request.send();
				} else {
					this.on.errorReceived.dispatch(ajaxError);
				}
			}, this);
			callCount++;
			request.send();
		};

		BambooRequest.prototype.latestPlanResult = function (planKey) {
			var urlPath = interpolate('result/{{0}}/latest?expand=changes', [planKey]);
			this.send(urlPath);
		};

		BambooRequest.prototype.plan = function (planKey) {
			var urlPath = interpolate('plan/{{0}}', [planKey]);
			this.send(urlPath);
		};

		function removeSessionCookie(url) {
			chrome.cookies.remove({ url: url, name: 'JSESSIONID' });
		}

		return BambooRequest;
	});