define([
	'core/services/request',
	'rx'
], function (request, Rx) {
	'use strict';

	var RESULT = { SUCCESS: 0, FAILURE: 1, ERRORED: null, UNKNOWN: null };
	var STATE = { STARTED: 'started', FINISHED: 'finished', CREATED: 'created' };

	var TravisBuild = function (id, settings) {
		this.id = id;
		var nameAndGroup = id.split('/');
		this.name = nameAndGroup[1];
		this.group = nameAndGroup[0];
		this.update = update;
	};

	var update = function () {
		var self = this;
		return request.json({
			url: 'https://api.travis-ci.org/repositories/' + this.id + '/builds.json'
		}).selectMany(function (builds) {
			if (isRunning(builds[0])) {
				return Rx.Observable.zip(
					getBuildDetails(builds[0].id),
					getBuildDetails(builds[1].id),
					function (runningBuild, previousBuild) {
						return createRunningBuild(self, runningBuild, previousBuild);
					});
			} else {
				return getBuildDetails(builds[0].id)
					.map(function (buildDetails) {
						return createBuild(self, buildDetails);
					});
			}
		});
	};

	var getBuildDetails = function (buildId) {
		return request.json({
			url: 'https://api.travis-ci.org/builds/' + buildId
		});
	};

	var isRunning = function (build) {
		return build.state === STATE.STARTED || build.state === STATE.CREATED;
	};

	var isBroken = function (build) {
		return build.result === RESULT.FAILURE || isErrored(build);
	};

	var isErrored = function (build) {
		return build.state === STATE.FINISHED
			&& build.result === RESULT.ERRORED;
	};

	var createBuild = function (self, response) {
		var result = {
			id: self.id,
			name: self.name,
			group: self.group,
			webUrl: 'https://travis-ci.org/' + self.id + '/builds/' + response.id,
			isBroken: isBroken(response),
			isRunning: false,
			changes: [{
				name: response.committer_name,
				message: response.message
			}]
		};
		return result;
	};

	var createRunningBuild = function (self, runningBuild, previousBuild) {
		var result = {
			id: self.id,
			name: self.name,
			group: self.group,
			webUrl: 'https://travis-ci.org/' + self.id + '/builds/' + runningBuild.id,
			isBroken: isBroken(previousBuild),
			isRunning: true,
			changes: [{
				name: runningBuild.committer_name,
				message: runningBuild.message
			}]
		};
		return result;
	};

	return TravisBuild;
});