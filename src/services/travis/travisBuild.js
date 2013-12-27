define([
	'services/request',
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
		}).selectMany(function (response) {
			return Rx.Observable.fromArray(response)
				.take(isRunning(response[0]) ? 2 : 1)
				.selectMany(function (buildInfo) {
					return request.json({
						url: 'https://api.travis-ci.org/builds/' + buildInfo.id
					});
				});
		}).toArray().select(function (buildDetails) {
			return createBuildInfo(self, buildDetails[0], buildDetails[1]);
		});
	};

	var isRunning = function (build) {
		return build.state === STATE.STARTED || build.state === STATE.CREATED;
	};

	var isBroken = function (build) {
		return build.result === RESULT.FAILURE || isErrored(build);
	};

	var isErrored = function (build) {
		return build.state === STATE.FINISHED &&
			build.result === RESULT.ERRORED;
	};

	var createBuildInfo = function (build, lastResponse, previousResponse) {
		var response = {
			id: build.id,
			name: build.name,
			group: build.group,
			webUrl: 'https://travis-ci.org/' + build.id + '/builds/' + lastResponse.id,
			isBroken: isRunning(lastResponse) ?
				isBroken(previousResponse) :
				isBroken(lastResponse),
			isRunning: isRunning(lastResponse),
			changes: isRunning(lastResponse) ?
				[{ name: previousResponse.committer_name }] :
				[{ name: lastResponse.committer_name }]
		};
		return response;
	};

	return TravisBuild;
});