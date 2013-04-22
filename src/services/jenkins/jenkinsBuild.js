define([
	'services/request',
	'rx',
	'common/joinUrl'
], function (request, Rx, joinUrl) {
	'use strict';

	var JenkinsBuild = function (id, settings) {
		this.id = id;
		this.settings = settings;
		this.update = update;
	};

	var update = function () {
		var self = this;
		return job(self).zip(lastCompletedBuild(self), function (jobResponse, lastCompletedResponse) {
			return {
				id: self.id,
				name: self.id,
				webUrl: jobResponse.lastBuild.url,
				isBroken: lastCompletedResponse.result !== 'SUCCESS',
				isRunning: jobResponse.lastBuild.number !== jobResponse.lastCompletedBuild.number,
				isDisabled: !jobResponse.buildable
			};
		});
	};

	var job = function (self) {
		return request.json({
			url: joinUrl(self.settings.url, 'job/' + self.id + '/api/json'),
			username: self.settings.username,
			password: self.settings.password
		});
	};

	var lastCompletedBuild = function (self) {
		return request.json({
			url: joinUrl(self.settings.url, 'job/' + self.id + '/lastCompletedBuild/api/json'),
			username: self.settings.username,
			password: self.settings.password
		});
	};

	return JenkinsBuild;
});