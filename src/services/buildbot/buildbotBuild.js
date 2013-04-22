define([
	'services/request',
	'rx',
	'common/joinUrl'
], function (request, Rx, joinUrl) {
	'use strict';

	var BuildBotBuild = function (id, settings) {
		this.id = id;
		this.settings = settings;
		this.update = update;
	};

	var update = function () {
		var self = this;
		return builder(self).zip(lastCompletedBuild(self), function (builderResponse, lastCompletedResponse) {
			return {
				id: self.id,
				name: self.id,
				group: builderResponse.category,
				webUrl: joinUrl(self.settings.url, "builders/" + self.id),
				isBroken: lastCompletedResponse.text.indexOf('failed') !== -1,
				isRunning: builderResponse.state === "building",
				isDisabled: builderResponse.state === "offline"
			};
		});
	};

	var builder = function (self) {
		return request.json({
			url: joinUrl(self.settings.url, 'json/builders/' + self.id),
			username: self.settings.username,
			password: self.settings.password
		});
	};

	var lastCompletedBuild = function (self) {
		return request.json({
			url: joinUrl(self.settings.url, 'json/builders/' + self.id + '/builds/-1'),
			username: self.settings.username,
			password: self.settings.password
		});
	};

	return BuildBotBuild;
});
