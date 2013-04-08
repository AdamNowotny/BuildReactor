define([
	'services/buildService',
	'services/request',
	'rx',
	'jquery',
	'signals'
], function (BuildService, request, Rx, $, Signal) {

	'use strict';

	var TravisBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		//this.Build = Build;
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

	TravisBuildService.prototype.availableBuilds = function () {
		return request.json({
			url: 'https://api.travis-ci.org/repos/',
			data: {
				'owner_name': this.settings.username
			},
			parser: parseAvailableBuilds
		});
	};

	function parseAvailableBuilds(response) {
		var items = response.map(function (repo) {
			return {
				id: repo.slug,
				name: repo.slug,
				group: null,
				enabled: true
			};
		});
		return {
			items: items
		};
	}

	return TravisBuildService;
});