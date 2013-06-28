define([
	'services/request',
	'rx',
	'common/joinUrl',
	'mout/string/makePath'
], function (request, Rx, joinUrl, makePath) {
	'use strict';

	var TeamcityBuild = function (id, settings) {
		this.id = id;
		this.settings = settings;
		this.update = update;
	};

	var update = function () {
		var self = this;
		return buildRequest(self).selectMany(function (buildResponse) {
			var state = createState(self.id, buildResponse);
			var result = Rx.Observable.returnValue(state);
			return !buildResponse.changes.count ?
				result :
				result.zip(changesRequest(self, buildResponse.changes.href), function (state, changes) {
					state.changes = changes;
					return state;
				});
		}).zip(buildRunningRequest(self), function (state, buildRunningResponse) {
			state.isRunning = !!buildRunningResponse.running;
			return state;
		});
	};

	function changesRequest(self, urlPath) {
		return urlRequest(self, urlPath).selectMany(function (changesResponse) {
			return Rx.Observable.fromArray(changesResponse.change).selectMany(function (change) {
				return urlRequest(self, change.href);
			});
		}).select(function (changeResponse) {
			return { name: changeResponse.username };
		}).toArray();
	}

	function createState(id, buildResponse) {
		var state = {
			id: id,
			name: buildResponse.buildType.name,
			group: buildResponse.buildType.projectName,
			webUrl: buildResponse.webUrl,
			isBroken: buildResponse.status in { 'FAILURE': 1, 'ERROR': 1 },
			tags: [],
			changes: []
		};
		if (!(buildResponse.status in { 'SUCCESS': 1, 'FAILURE': 1, 'ERROR': 1 })) {
			state.tags.push({ name : 'Unknown', description : 'Status [' + buildResponse.status + '] is unknown'});
			delete state.isBroken;
		}
		return state;
	}

	var urlRequest = function (self, urlPath) {
		return request.json({
			url: joinUrl(self.settings.url, urlPath),
			username: self.settings.username,
			password: self.settings.password
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