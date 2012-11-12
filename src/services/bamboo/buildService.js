define([
	'jquery',
	'signals',
	'./bambooRequest',
	'./bambooPlan',
	'amdUtils/string/interpolate',
	'amdUtils/object/values',
	'services/poolingService'
], function ($, Signal, BambooRequest, BambooPlan, interpolate, values, PoolingService) {

	'use strict';

	var BambooBuildService = function (settings) {
		$.extend(this, new PoolingService(settings));
		this.plans = {};
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
			receivedProjects.dispatch({
				projects: templateData
			});
		});
		plansRequest.on.errorReceived.addOnce(function (ajaxError) {
			receivedProjects.dispatch({
				error: ajaxError
			});
		});
		plansRequest.projects();
		return receivedProjects;
	};

	BambooBuildService.prototype.activeProjects = function () {
		var projectsInfo = values(this.plans).map(function (p) {
			return {
				name: p.name,
				group: p.projectName,
				isBroken: p.state === 'Failed',
				url: p.url,
				isBuilding: p.isBuilding
			};
		});
		return {
			name: this.name,
			items: projectsInfo
		};
	};

	BambooBuildService.prototype.update = function () {
		this.on.updating.dispatch();
		this.updateAllPlans().addOnce(function () {
			this.on.updated.dispatch();
		}, this);
	};

	BambooBuildService.prototype.updateAllPlans = function () {
		
		function planFinished() {
			remaining--;
			if (remaining === 0) {
				completed.dispatch();
			}
		}

		var self = this;
		var completed = new Signal();
		completed.memorize = true;
		var remaining = this.settings.projects.length;
		if (remaining === 0) {
			completed.dispatch();
		} else {
			this.settings.projects.forEach(function (planKey) {
				if (!self.plans.hasOwnProperty(planKey)) {
					var plan = new BambooPlan(self.settings, planKey);
					plan.on.failed.add(onBuildFailed, self);
					plan.on.fixed.add(onBuildFixed, self);
					plan.on.started.add(onBuildStarted, self);
					plan.on.finished.add(onBuildFinished, self);
					plan.on.errorThrown.add(onPlanError, self);
					self.plans[planKey] = plan;
				}
				self.plans[planKey].update().addOnce(planFinished, this);
			});
		}
		return completed;
	};

	var onBuildFailed = function (plan) {
		var buildEvent = {
			serviceName: this.name,
			buildName: plan.name,
			group: plan.projectName,
			url: plan.url,
			icon: this.settings.icon
		};
		this.on.brokenBuild.dispatch(buildEvent);
	};

	var onBuildFixed = function (plan) {
		var buildEvent = {
			serviceName: this.name,
			buildName: plan.name,
			group: plan.projectName,
			url: plan.url,
			icon: this.settings.icon
		};
		this.on.fixedBuild.dispatch(buildEvent);
	};

	var onBuildStarted = function (plan) {
		var buildEvent = {
			serviceName: this.name,
			buildName: plan.name,
			group: plan.projectName,
			url: plan.url,
			icon: this.settings.icon
		};
		this.on.startedBuild.dispatch(buildEvent);
	};

	var onBuildFinished = function (plan) {
		var buildEvent = {
			serviceName: this.name,
			buildName: plan.name,
			group: plan.projectName,
			url: plan.url,
			icon: this.settings.icon
		};
		this.on.finishedBuild.dispatch(buildEvent);
	};

	var onPlanError = function (ajaxError) {
		this.on.errorThrown.dispatch(ajaxError);
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