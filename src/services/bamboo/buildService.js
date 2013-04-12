define([
	'jquery',
	'./bambooPlan',
	'services/request',
	'services/buildService',
	'common/joinUrl'
], function ($, BambooPlan, request, BuildService, joinUrl) {

	'use strict';

	var BambooBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = BambooPlan;
	};

	BambooBuildService.settings = function () {
		return {
			typeName: 'Atlassian Bamboo',
			baseUrl: 'bamboo',
			icon: 'bamboo/icon.png',
			logo: 'bamboo/logo.png',
			projects: [],
			url: '',
			urlHint: 'https://ci.openmrs.org/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	BambooBuildService.prototype.availableBuilds = function () {
		return request.json({
			url: joinUrl(this.settings.url, 'rest/api/latest/project?expand=projects.project.plans.plan'),
			username: this.settings.username,
			password: this.settings.password,
			authCookie: 'JSESSIONID',
			parser: parseAvailableBuilds
		});
	};

	var parseAvailableBuilds = function (response) {
		var projects = response.projects.project;
		var items = [];
		for (var projectIndex = 0; projectIndex < projects.length; projectIndex++) {
			var project = projects[projectIndex];
			for (var planIndex = 0; planIndex < project.plans.plan.length; planIndex++) {
				var plan = project.plans.plan[planIndex];
				var item = {
					id: plan.key,
					name: plan.shortName,
					group: project.name,
					enabled: plan.enabled
				};
				items.push(item);
			}
		}
		return {
			items: items
		};
	};

	return BambooBuildService;
});