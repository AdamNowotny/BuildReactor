define([
	'services/buildServiceBase',
	'services/request',
	'services/bamboo/bambooPlan',
	'mout/object/mixIn',
	'common/joinUrl',
	'common/sortBy',
	'rx'
], function (BuildServiceBase, request, BambooPlan, mixIn, joinUrl, sortBy, Rx) {

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
		return allProjects(self)
			.selectMany(function (project) {
				return allProjectPlans(self, project);
			})
			.select(function (plan) {
				return {
					id: plan.key,
					name: plan.shortName,
					group: plan.projectName,
					isDisabled: !plan.enabled
				};
			})
			.toArray()
			.select(function (plans) {
				sortBy('id', plans);
				return {
					items: plans
				};
			});
	};

	var projectsFromIndex = function (self, startIndex) {
		return request.json({
			url: joinUrl(self.settings.url, 'rest/api/latest/project?expand=projects.project.plans.plan&start-index=' + startIndex),
			username: self.settings.username,
			password: self.settings.password,
			authCookie: 'JSESSIONID'
		});
	};

	var projectPlansFromIndex = function (self, projectKey, startIndex) {
		return request.json({
			url: joinUrl(self.settings.url, 'rest/api/latest/project/' + projectKey + '?expand=plans.plan&start-index=' + startIndex),
			username: self.settings.username,
			password: self.settings.password,
			authCookie: 'JSESSIONID'
		});
	};

	var allProjects = function (self) {
		return projectsFromIndex(self, 0).selectMany(function (response) {
			var result = Rx.Observable.returnValue(response);
			var pageSize = response.projects['max-result'];
			var totalSize = response.projects['size'];
			var index = pageSize;
			while (index < totalSize) {
				result = result.concat(projectsFromIndex(self, index));
				index += pageSize;
			}
			return result;
		}).selectMany(function (projectResponse) {
			return Rx.Observable.fromArray(projectResponse.projects.project);
		});
	};

	var allProjectPlans = function (self, project) {
		var result = Rx.Observable.fromArray(project.plans.plan);
		var pageSize = project.plans['max-result'];
		var totalSize = project.plans['size'];
		var index = pageSize;
		var pageIndexes = [];
		while (index < totalSize) {
			pageIndexes.push(index);
			index += pageSize;
		}
		var morePlans = Rx.Observable.fromArray(pageIndexes).selectMany(function (index) {
			return projectPlansFromIndex(self, project.key, index);
		}).selectMany(function (response) {
			return Rx.Observable.fromArray(response.plans.plan);
		});
		return Rx.Observable.fromArray(project.plans.plan).concat(morePlans);
	};

	return BambooBuildService;
});