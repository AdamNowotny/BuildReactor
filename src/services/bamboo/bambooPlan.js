define([
	'services/request',
	'rx',
	'common/joinUrl'
], function (request, Rx, joinUrl) {

	'use strict';

	var BambooPlan = function (id, settings) {
		this.id = id;
		this.settings = settings;
		this.update = update;
	};

	var update = function () {
		var self = this;
		return plan(self).zip(result(self), function (planResponse, resultResponse) {
			var state = {
				id: self.id,
				name: planResponse.shortName,
				group: planResponse.projectName,
				webUrl: joinUrl(self.settings.url, 'browse/' + resultResponse.key),
				isBroken: resultResponse.state === 'Failed',
				isRunning: planResponse.isBuilding,
				isWaiting: planResponse.isActive,
				isDisabled: !planResponse.enabled
			};
			if (!(resultResponse.state in { 'Successful': 1, 'Failed': 1})) {
				state.error = 'State [' + resultResponse.state + '] is unknown';
			}
			return state;
		});
	};

	var plan = function (self) {
		return request.json({
			url: joinUrl(self.settings.url, 'rest/api/latest/plan/' + self.id),
			username: self.settings.username,
			password: self.settings.password,
			authCookie: 'JSESSIONID',
		});
	};

	var result = function (self) {
		return request.json({
			url: joinUrl(self.settings.url, 'rest/api/latest/result/' + self.id + '/latest?expand=changes'),
			username: self.settings.username,
			password: self.settings.password,
			authCookie: 'JSESSIONID',
		});
	};

	return BambooPlan;
});