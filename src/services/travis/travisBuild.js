define([
	'services/request',
	'rx'
], function (request, Rx) {
	'use strict';

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
			url: 'https://api.travis-ci.org/' + this.id
		}).selectMany(function (response) {
			if (response.last_build_result === null) {
				return updateResponseWithLastKnownBuildResult(response, self);
			}
			return Rx.Observable.returnValue(response);
		}).select(function (response) {
			return createBuildInfo(self, response);
		});
	};

	var createBuildInfo = function (build, buildResponse) {
		return {
			id: build.id,
			name: build.name,
			group: build.group,
			webUrl: 'https://travis-ci.org/' + build.id + '/builds/' + buildResponse.last_build_id,
			isBroken: buildResponse.last_build_result !== 0,
			isRunning: buildResponse.last_build_finished_at === null && !!buildResponse.last_build_started_at
		};
	};

	var updateResponseWithLastKnownBuildResult = function (response, build) {
		return request.json({
			url: 'http://api.travis-ci.org/' + build.id + '/builds',
			data: { number: response.last_build_number - 1 }
		}).select(function (buildResult) {
			response.last_build_result = buildResult[0].result;
			return response;
		});
	};

	return TravisBuild;
});