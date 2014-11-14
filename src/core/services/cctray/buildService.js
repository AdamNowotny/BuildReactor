define([
	'core/services/buildServiceBase',
	'core/services/request',
	'jquery',
	'rx',
	'mout/object/mixIn',
	'common/joinUrl',
	'mout/array/contains'
], function (BuildServiceBase, request, $, Rx, mixIn, joinUrl, contains) {

	'use strict';

	var CCBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings));
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
			urlHint: 'URL, e.g. http://cruisecontrol.instance.com/cctray.xml',
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
				var status = $(d).attr('lastBuildStatus');
				var breakers = $(d).find('message[kind=Breakers]').attr('text');
				var state = {
					id: $(d).attr('name'),
					name: $(d).attr('name'),
					group: $(d).attr('category'),
					webUrl: $(d).attr('webUrl'),
					isRunning: $(d).attr('activity') === 'Building',
					tags: [],
					changes: !breakers ? [] : breakers.split(', ').map(function (breaker) {
						return { name: breaker };
					})
				};
				if (status in { 'Success': 1, 'Failure': 1, 'Exception': 1 }) {
					state.isBroken = status in { 'Failure': 1, 'Exception': 1 };
				} else {
					state.tags.push({ name : 'Unknown', description : 'Status [' + status + '] is unknown'});
					delete state.isBroken;
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
