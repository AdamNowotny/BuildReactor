define([
	'core/services/request',
	'rx',
	'common/joinUrl'
], function(request, Rx, joinUrl) {
	'use strict';

	var TeamcityBuild = function(id, settings) {
		this.id = id;
		this.settings = settings;
		this.update = update;
	};

	var update = function() {
		var self = this;
		return buildListRequest(self).selectMany(function(buildListResponse) {
			if (buildListResponse.count === 0) {
				throw {
					name: 'NotFoundError',
					message: 'No build for branch [' + self.settings.branch + ']'
				};
			}
			var isRunning = Boolean(buildListResponse.build[0].running);
			var lastCompleted = buildListResponse.build[isRunning ? 1 : 0];
			return buildDetailsRequest(self, lastCompleted.href).selectMany(function(buildDetailsResponse) {
				var state = createState(self.id, buildDetailsResponse);
				var result = Rx.Observable.returnValue(state);
				return result.zip(changesRequest(self, buildDetailsResponse.changes.href), function(state, changes) {
					state.changes = changes;
					return state;
				});
			}).select(function(state) {
				state.isRunning = isRunning;
				if (isRunning) {
					state.webUrl = buildListResponse.build[0].webUrl;
				}
				return state;
			});
		});
	};

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

	var buildListRequest = function(self) {
		var urlPath = self.settings.username ? 'httpAuth' : 'guestAuth';
		urlPath += '/app/rest/builds?locator=buildType:' + self.id + ',running:any';
		urlPath += self.settings.branch ? ',branch:(' + self.settings.branch + ')' : '';
		return sendRequest(self, urlPath);
	};

	var buildDetailsRequest = function(self, href) {
		return sendRequest(self, href);
	};

	var changesRequest = function(self, urlPath) {
		return sendRequest(self, urlPath).selectMany(function(changesResponse) {
			return Rx.Observable.fromArray(changesResponse.change || []).selectMany(function(change) {
				return sendRequest(self, change.href);
			});
		}).select(function(changeResponse) {
			return {
				name: changeResponse.username,
				message: changeResponse.comment.split('\n')[0]
			};
		}).toArray();
	};

	var sendRequest = function(self, urlPath) {
		return request.json({
			url: joinUrl(self.settings.url, urlPath),
			username: self.settings.username,
			password: self.settings.password
		});
	};

	return TeamcityBuild;
});
