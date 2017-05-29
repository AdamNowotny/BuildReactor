import joinUrl from 'common/joinUrl';

define([
	'core/services/buildServiceBase',
	'core/services/request',
	'core/services/teamcity/teamcityBuild'
], function(BuildServiceBase, request, TravisBuild) {

	'use strict';

	var TeamcityBuildService = function(settings) {
		Object.assign(this, new BuildServiceBase(settings, TeamcityBuildService.settings()));
		this.Build = TravisBuild;
		this.availableBuilds = availableBuilds;
	};

	TeamcityBuildService.settings = function() {
		return {
			typeName: 'TeamCity',
			baseUrl: 'teamcity',
			icon: 'core/services/teamcity/icon.png',
			logo: 'core/services/teamcity/logo.png',
			fields: [
                { type: 'url', config: 'url', placeholder: 'Server URL, e.g. http://teamcity.jetbrains.com/' },
                { type: 'username' },
                { type: 'password' }
            ],
			defaultConfig: {
				baseUrl: 'teamcity',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				branch: '',
				updateInterval: 60
			}
		};
	};

	var availableBuilds = function() {
		var urlPath = ((this.settings.username) ? 'httpAuth' : 'guestAuth');
		urlPath += '/app/rest/buildTypes';
		return request.json({
			url: joinUrl(this.settings.url, urlPath),
			username: this.settings.username,
			password: this.settings.password,
			parser: function(buildTypesJson) {
				return {
					items: buildTypesJson.buildType ? buildTypesJson.buildType.map(function(d, i) {
							return {
								id: d.id,
								name: d.name,
								group: d.projectName,
								isDisabled: false
							};
						}) : []
				};
			}

		});
	};

	return TeamcityBuildService;
});
