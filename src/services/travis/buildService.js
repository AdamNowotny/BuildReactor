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

	TravisBuildService.prototype.projects = function (selectedBuilds) {
		var completed = new Signal();
		completed.memorize = true;
		this.availableBuilds().subscribe(function (projects) {
			completed.dispatch({ projects: projects });
		}, function (error) {
			completed.dispatch({ error: error });
		});
		return completed;
	};

	TravisBuildService.prototype.availableBuilds = function () {
		var ajaxOptions = {
			url: 'https://api.travis-ci.org/repos/',
			data: {
				'owner_name': this.settings.username
			},
		};
		return request.json(ajaxOptions).select(function (response) {
			try {
				return createTemplateData(response);
			} catch (ex) {
				return Rx.Observable.throwException({ error: { name: 'ParseError', message: 'Unrecognized response'}});
			}
		});
	};

	function createTemplateData(response) {
		var items = response.data.map(function (repo) {
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