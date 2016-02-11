define([
	'core/services/buildServiceBase',
	'core/services/travis/travisBuild',
	'core/services/request',
	'mout/object/mixIn'
], function (BuildServiceBase, TravisBuild, request, mixIn) {

	'use strict';

	var TravisBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings, TravisBuildService.settings()));
		this.Build = TravisBuild;
		this.availableBuilds = availableBuilds;
	};

	TravisBuildService.settings = function () {
		return {
			typeName: 'Travis',
			baseUrl: 'travis',
			icon: 'core/services/travis/icon.png',
			logo: 'core/services/travis/logo.png',
			defaultConfig: {
				baseUrl: 'travis',
				name: '',
				projects: [],
				username: '',
				updateInterval: 60
			}
		};
	};

	var availableBuilds = function () {
		return request.json({
			url: 'https://api.travis-ci.org/repos/',
			data: { 'owner_name': this.settings.username },
			parser: function (response) {
				return {
					items: response.map(function (repo) {
						return {
							id: repo.slug,
							name: repo.slug.split('/')[1],
							group: repo.slug.split('/')[0],
							isDisabled: false
						};
					})
				};
			}
		});
	};

	return TravisBuildService;
});