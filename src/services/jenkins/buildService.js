define([
	'services/buildService',
	'services/jenkins/jenkinsBuild',
	'jquery',
	'services/request',
	'common/joinUrl'
], function (BuildService, JenkinsBuild, $, request, joinUrl) {

	'use strict';

	var JenkinsBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = JenkinsBuild;
	};

	JenkinsBuildService.settings = function () {
		return {
			typeName: 'Jenkins',
			baseUrl: 'jenkins',
			icon: 'jenkins/icon.png',
			logo: 'jenkins/logo.png',
			projects: [],
			url: '',
			urlHint: 'http://ci.jenkins-ci.org/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	JenkinsBuildService.prototype.availableBuilds = function () {
		return request.json({
			url: joinUrl(this.settings.url, 'api/json?depth=1'),
			username: this.settings.username,
			password: this.settings.password,
			parser: parseAvailableBuilds
		});
	};

	function parseAvailableBuilds(apiJson) {
		return {
			items: apiJson.jobs.map(function (job, index) {
				return {
					id: job.name,
					name: job.displayName,
					group: null,
					enabled: job.buildable
				};
			}),
			primaryView: apiJson.primaryView.name,
			views: apiJson.views.map(function (view, index) {
				return {
					name: view.name,
					items: view.jobs.map(function (job, index) {
						return job.name;
					})
				};
			})
		};
	}

	return JenkinsBuildService;
});
