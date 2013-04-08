define([
	'services/buildService',
	'services/request',
	'services/teamcity/teamcityBuild',
	'jquery',
	'common/joinUrl'
], function (BuildService, request, Build, $, joinUrl) {

	'use strict';

	var TeamcityBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = Build;
	};

	TeamcityBuildService.settings = function () {
		return {
			typeName: 'TeamCity',
			baseUrl: 'teamcity',
			icon: 'teamcity/icon.png',
			logo: 'teamcity/logo.png',
			projects: [],
			url: '',
			urlHint: 'http://teamcity.jetbrains.com/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	TeamcityBuildService.prototype.availableBuilds = function () {
		var urlPath = ((this.settings.username) ? 'httpAuth' : 'guestAuth');
		urlPath += '/app/rest/buildTypes';
		return request.json({
			url: joinUrl(this.settings.url, urlPath),
			username: this.settings.username,
			password: this.settings.password,
			parser: parseAvailableBuilds
		});
	};

	function parseAvailableBuilds(buildTypesJson) {
		if (!buildTypesJson.buildType) {
			return { items: [] };
		} else {
			return {
				items: buildTypesJson.buildType.map(function (d, i) {
					return {
						id: d.id,
						name: d.name,
						group: d.projectName,
						enabled: true
					};
				})
			};
		}
	}

	return TeamcityBuildService;
});