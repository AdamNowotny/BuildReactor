define([
	'services/request',
	'rx',
	'common/joinUrl'
], function (request, Rx, joinUrl) {
	'use strict';

	var TeamcityBuild = function (id, settings) {
		this.id = id;
		this.settings = settings;
		this.update = update;
	};

	var update = function () {
		var self = this;
		return buildRequest(self).zip(buildRunningRequest(self), function (buildResponse, buildRunningResponse) {
			return {
				id: self.id,
				name: buildResponse.buildType.name,
				group: buildResponse.buildType.projectName,
				webUrl: buildResponse.webUrl,
				isBroken: buildResponse.status !== 'SUCCESS',
				isRunning: buildRunningResponse.running
			};
		});
	};

	var buildRequest = function (self) {
		var urlPath = '/app/rest/buildTypes/id:' + self.id + '/builds/count:1';
		return sendRequest(self.settings, urlPath);
	};

	var buildRunningRequest = function (self) {
		var urlPath = '/app/rest/buildTypes/id:' + self.id + '/builds/running:any';
		return sendRequest(self.settings, urlPath);
	};

	var sendRequest = function (settings, urlPath) {
		var authUrl = settings.username ? 'httpAuth' : 'guestAuth';
		return request.json({
			url: joinUrl(settings.url, authUrl + urlPath),
			username: settings.username,
			password: settings.password
		});
	};

	return TeamcityBuild;
});