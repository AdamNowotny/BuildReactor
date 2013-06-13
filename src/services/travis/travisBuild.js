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
			url: 'https://api.travis-ci.org/' + this.id + '/builds'
		}).selectMany(function (response) {
			return Rx.Observable.fromArray(response)
				.take(response[0].result !== null ? 1 : 2)
				.selectMany(function (buildInfo) {
					return request.json({
						url: 'https://api.travis-ci.org/builds/' + buildInfo.id
					});
				});
		}).toArray().select(function (buildDetails) {
			return createBuildInfo(self, buildDetails[0], buildDetails[1]);
		});
	};

	var createBuildInfo = function (build, lastResponse, previousResponse) {
		return {
			id: build.id,
			name: build.name,
			group: build.group,
			webUrl: 'https://travis-ci.org/' + build.id + '/builds/' + lastResponse.id,
			isBroken: lastResponse.result !== null ?
				lastResponse.result !== 0 :
				previousResponse.result !== 0,
			isRunning: lastResponse.result === null,
			changes: lastResponse.result !== null ?
				[{ name: lastResponse.committer_name }] :
				[{ name: previousResponse.committer_name }]
		};
	};

	return TravisBuild;
});