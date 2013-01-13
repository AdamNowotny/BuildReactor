define([
	'jquery',
	'signals',
	'./bambooRequest',
	'./bambooPlan',
	'mout/string/interpolate',
	'mout/object/values',
	'services/buildService'
], function ($, Signal, BambooRequest, BambooPlan, interpolate, values, BuildService) {

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
			urlHint: 'https://ci.openmrs.org/'
		};
	};

	BambooBuildService.prototype.projects = function (selectedPlans) {
		var receivedProjects = new Signal();
		receivedProjects.memorize = true;
		var plansRequest = new BambooRequest(this.settings);
		plansRequest.on.responseReceived.addOnce(function (response) {
			var templateData = createTemplateData(response, selectedPlans);
			receivedProjects.dispatch({ projects: templateData });
		});
		plansRequest.on.errorReceived.addOnce(function (ajaxError) {
			receivedProjects.dispatch({ error: ajaxError });
		});
		plansRequest.projects();
		return receivedProjects;
	};

	var createTemplateData = function (response, selectedPlans) {
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
					enabled: plan.enabled,
					selected: selectedPlans.indexOf(plan.key) > -1
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