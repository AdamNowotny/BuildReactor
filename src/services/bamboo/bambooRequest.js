define([
		'signals',
		'main/ajaxRequest',
		'common/joinUrl',
		'amdUtils/string/interpolate'
	], function (signals, AjaxRequest, joinUrl, interpolate) {

		'use strict';
		
		var BambooRequest = function (settings) {
			if (!(this instanceof BambooRequest)) {
				return new BambooRequest(settings);
			}
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
				ajaxSettings.data = { os_authType: 'basic' };
			}
			return ajaxSettings;
		}

		BambooRequest.prototype.send = function (urlPath) {
			var ajaxSettings = createAjaxRequestSettings(this.settings, urlPath);
			var request = new AjaxRequest(ajaxSettings);
			request.on.responseReceived.addOnce(function (response) {
				this.on.responseReceived.dispatch(response);
			}, this);
			request.on.errorReceived.addOnce(function (ajaxError) {
				this.on.errorReceived.dispatch(ajaxError);
			}, this);
			request.send();
		};

		BambooRequest.prototype.projects = function () {
			this.send('project?expand=projects.project.plans.plan');
		};

		BambooRequest.prototype.latestPlanResult = function (planKey) {
			var urlPath = interpolate('result/{{0}}/latest?expand=changes', [planKey]);
			this.send(urlPath);
		};

		BambooRequest.prototype.plan = function (planKey) {
			var urlPath = interpolate('plan/{{0}}', [planKey]);
			this.send(urlPath);
		};

		return BambooRequest;
	});