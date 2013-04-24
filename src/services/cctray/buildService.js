define([
	'services/rxBuildService',
	'services/request',
	'jquery',
	'rx',
	'mout/object/mixIn',
	'common/joinUrl',
	'mout/array/contains'
], function (BuildService, request, $, Rx, mixIn, joinUrl, contains) {

	'use strict';

	var CCBuildService = function (settings) {
		mixIn(this, new BuildService(settings));
		this.availableBuilds = availableBuilds;
		this.updateAll = updateAll;
		this.cctrayLocation = '';
	};

	CCBuildService.settings = function () {
		return {
			typeName: 'CCTray Generic',
			baseUrl: 'cctray',
			icon: 'cctray/icon.png',
			logo: 'cctray/logo.png',
			projects: [],
			url: '',
			urlHint: 'http://cruisecontrol.instance.com/cctray.xml',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	var updateAll = function () {
		var self = this;
		return request.xml({
			url: joinUrl(this.settings.url, this.cctrayLocation),
			username: this.settings.username,
			password: this.settings.password,
			parser: parseProjects
		}).catchException(function (ex) {
			return Rx.Observable.fromArray(self.settings.projects)
				.select(function (buildId) {
					return {
						id: buildId,
						error: ex
					};
				}).toArray();
		}).selectMany(function (projects) {
			return Rx.Observable.fromArray(projects);
		}).where(function (build) {
			return contains(self.settings.projects, build.id);
		}).select(function (state) {
			return self.mixInMissingState(state);
		}).doAction(function (state) {
			return self.processBuildUpdate(state);
		}).defaultIfEmpty([]);
	};

	var parseProjects = function (projectsXml) {
		return $(projectsXml)
			.find('Project')
			.map(function (i, d) {
				return {
					id: $(d).attr('name'),
					name: $(d).attr('name'),
					group: $(d).attr('category'),
					webUrl: $(d).attr('webUrl'),
					status: $(d).attr('lastBuildStatus'),
					activity: $(d).attr('activity'),
				};
			}).map(function (i, d) {
				var state = {
					id: d.id,
					name: d.name,
					group: d.group,
					webUrl: d.webUrl,
					isRunning: d.activity === 'Building',
				};
				if (d.status in { 'Success': 1, 'Failure': 1, 'Exception': 1 }) {
					state.isBroken = d.status in { 'Failure': 1, 'Exception': 1 };
				}
				return state;
			}).toArray();
	};

	var availableBuilds = function () {
		return request.xml({
			url: joinUrl(this.settings.url, this.cctrayLocation),
			username: this.settings.username,
			password: this.settings.password,
			parser: parseAvailableBuilds
		});
	};

	function parseAvailableBuilds(projectsXml) {
		return {
			items: $(projectsXml)
				.find('Project')
				.map(function (i, project) {
					return {
						id: $(project).attr('name'),
						name: $(project).attr('name'),
						group: $(project).attr('category'),
						isDisabled: false
					};
				})
				.toArray()
		};
	}

	return CCBuildService;
});
