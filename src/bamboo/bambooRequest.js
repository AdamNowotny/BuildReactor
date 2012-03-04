define([
		'signals',
		'../ajaxRequest',
		'amdUtils/string/endsWith',
		'amdUtils/string/format'
	], function (signals, AjaxRequest, endsWith, format) {

		var BambooRequest = function (settings) {
			if (!(settings && settings.url && settings.url != '')) {
				throw new Error('settings.url-input not set');
			}
			this.settings = settings;
			this.responseReceived = new signals.Signal();
			this.errorReceived = new signals.Signal();
		};

		function createAjaxRequestSettings(settings, urlPath) {
			var url = settings.url;
			if (!endsWith(url, '/')) url += '/';
			url += 'rest/api/latest/' + urlPath;
			return {
				url: url,
				username: settings.username,
				password: settings.password
			};
		}

		BambooRequest.prototype.send = function (urlPath) {
			var ajaxSettings = createAjaxRequestSettings(this.settings, urlPath);
			var request = new AjaxRequest(ajaxSettings);
			request.responseReceived.addOnce(function (response) {
				this.responseReceived.dispatch(response);
			}, this);
			request.errorReceived.addOnce(function (ajaxError) {
				this.errorReceived.dispatch(ajaxError);
			}, this);
			request.send();
		};

		BambooRequest.prototype.projects = function () {
			this.send('project?expand=projects.project.plans.plan');
		};

		BambooRequest.prototype.latestPlanResult = function (planKey) {
			var urlPath = format('result/{0}/latest?expand=jiraIssues,changes.change', planKey);
			this.send(urlPath);
		};

		BambooRequest.prototype.plan = function () {
		};

		return BambooRequest;
	});