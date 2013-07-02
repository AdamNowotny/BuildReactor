define([
	'services/buildServiceBase',
	'services/request',
	'services/teamcity/teamcityBuild',
	'mout/object/mixIn',
	'common/joinUrl'
], function (BuildServiceBase, request, TravisBuild, mixIn, joinUrl) {

	'use strict';

	var TeamcityBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings));
		this.Build = TravisBuild;
		this.availableBuilds = availableBuilds;
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
			updateInterval: 60,
			branch: ''
		};
	};

	var availableBuilds = function () {
		var urlPath = ((this.settings.username) ? 'httpAuth' : 'guestAuth');
		urlPath += '/app/rest/buildTypes';
		return request.json({
			url: joinUrl(this.settings.url, urlPath),
			username: this.settings.username,
			password: this.settings.password,
			parser: function (buildTypesJson) {
				return {
					items: !buildTypesJson.buildType ? [] :
						buildTypesJson.buildType.map(function (d, i) {
							return {
								id: d.id,
								name: d.name,
								group: d.projectName,
								isDisabled: false
							};
						})
				};
			}

		});
	};

	return TeamcityBuildService;
});