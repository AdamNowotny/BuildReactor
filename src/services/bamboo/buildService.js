define([
	'services/buildServiceBase',
	'services/request',
	'services/bamboo/bambooPlan',
	'mout/object/mixIn',
	'mout/array/flatten',
	'common/joinUrl',
	'rx'
], function (BuildServiceBase, request, BambooPlan, mixIn, flatten, joinUrl, Rx) {

	'use strict';

	var BambooBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings));
		this.Build = BambooPlan;
		this.availableBuilds = availableBuilds;
	};

	BambooBuildService.settings = function () {
		return {
			typeName: 'Atlassian Bamboo',
			baseUrl: 'bamboo',
			icon: 'bamboo/icon.png',
			logo: 'bamboo/logo.png',
			projects: [],
			url: '',
			urlHint: 'URL, e.g. https://ci.openmrs.org/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	var availableBuilds = function () {
		var self = this;
		return plansFromIndex(self, 0).selectMany(function (response) {
			var pageSize = response.projects['max-result'];
			var totalSize = response.projects['size'];
			var index = pageSize;
			var result = Rx.Observable.returnValue(response);
			while (index < totalSize) {
				result = result.concat(plansFromIndex(self, index));
				index += pageSize;
			}
			return result;
		}).select(parsePlans)
		.toArray()
		.select(function (plans) {
			return {
				items: flatten(plans)
			};
		});
	};

	var plansFromIndex = function (self, startIndex) {
		return request.json({
			url: joinUrl(self.settings.url, 'rest/api/latest/project?expand=projects.project.plans.plan&start-index=' + startIndex),
			username: self.settings.username,
			password: self.settings.password,
			authCookie: 'JSESSIONID'
		});
	};

	var parsePlans = function (response) {
		var plansByProject = response.projects.project.map(function (project) {
			return project.plans.plan.map(function (plan) {
				return {
					id: plan.key,
					name: plan.shortName,
					group: plan.projectName,
					isDisabled: !plan.enabled
				};
			});
		});
		return flatten(plansByProject);
	};

	return BambooBuildService;
});