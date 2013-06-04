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
			var state = {
				id: self.id,
				name: self.id,
				webUrl: jobResponse.lastBuild.url,
				isBroken: lastCompletedResponse.result in
					{ 'FAILURE': 1, 'UNSTABLE': 1, 'ABORTED': 1, 'NOT_BUILT': 1 },
				isRunning: jobResponse.lastBuild.number !== jobResponse.lastCompletedBuild.number,
				isDisabled: !jobResponse.buildable,
				tags: []
			};
			if (lastCompletedResponse.result === 'UNSTABLE') {
				state.tags.push({ name: 'Unstable', type: 'warning' });
			}
			if (!(lastCompletedResponse.result in
					{ 'SUCCESS': 1, 'FAILURE': 1, 'UNSTABLE': 1, 'ABORTED': 1, 'NOT_BUILT': 1 })) {
				state.tags.push({ name : 'Unknown', description : 'Result [' + lastCompletedResponse.result + '] is unknown'});
			}
			return state;
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