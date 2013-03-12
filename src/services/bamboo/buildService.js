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
			url: '',
			urlHint: 'https://ci.openmrs.org/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	BambooBuildService.prototype.projects = function (selectedPlans) {
		var completed = new Signal();
		completed.memorize = true;
		var plansRequest = new BambooRequest(this.settings);
		plansRequest.on.responseReceived.addOnce(function (response) {
			try {
				var templateData = createTemplateData(response, selectedPlans);
				completed.dispatch({ projects: templateData });
			} catch (ex) {
				completed.dispatch({ error: { name: 'ParseError', message: 'Unrecognized response'}});
			}
		});
		plansRequest.on.errorReceived.addOnce(function (ajaxError) {
			completed.dispatch({ error: ajaxError });
		});
		plansRequest.projects();
		return completed;
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