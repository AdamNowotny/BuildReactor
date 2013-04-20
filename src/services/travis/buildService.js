define([
	'services/rxBuildService',
	'services/travis/travisBuild',
	'services/request',
	'jquery'
], function (BuildService, TravisBuild, request, $) {

	'use strict';

	var TravisBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = TravisBuild;
		this.availableBuilds = availableBuilds;
	};

	TravisBuildService.settings = function () {
		return {
			typeName: 'Travis',
			baseUrl: 'travis',
			icon: 'travis/icon.png',
			logo: 'travis/logo.png',
			projects: [],
			username: ''
		};
	};

	var availableBuilds = function () {
		return request.json({
			url: 'https://api.travis-ci.org/repos/',
			data: { 'owner_name': this.settings.username },
			parser: function parse(response) {
				return {
					items: response.map(function (repo) {
						return {
							id: repo.slug,
							name: repo.slug,
							group: null,
							enabled: true
						};
					})
				};
			}
		});
	};

	return TravisBuildService;
});