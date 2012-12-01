define([
	'jquery',
	'signals',
	'./ccRequest',
	'./cctrayProject',
	'amdUtils/array/contains',
	'amdUtils/object/values',
	'common/joinUrl',
	'services/poolingService'
], function ($, Signal, ccRequest, CCTrayProject, contains, values, joinUrl, PoolingService) {

	'use strict';

	var CCBuildService = function (settings) {
		$.extend(this, new PoolingService(settings));
		this.name = settings.name;
		this.builds = {};
		$.extend(this.on, {
			errorThrown: new Signal(),
			brokenBuild: new Signal(),
			fixedBuild: new Signal(),
			startedBuild: new Signal(),
			finishedBuild: new Signal()
		});
		this.defaultSettings = CCBuildService.settings;
		this.settings = this._createSettings(settings);
	};

		
	CCBuildService.prototype._createSettings = function (settings) {
		var newSettings = this.defaultSettings();
		newSettings.name = settings.name;
		newSettings.url = joinUrl(settings.url, this.cctrayLocation());
		newSettings.updateInterval = settings.updateInterval;
		newSettings.projects = settings.projects;
		newSettings.icon = settings.icon;
		newSettings.logo = settings.logo;
		newSettings.username = settings.username;
		newSettings.password = settings.password;
		return newSettings;
	};

	CCBuildService.prototype.cctrayLocation = function () {
		return '';
	};

	CCBuildService.settings = function () {
		return {
			typeName: 'CCTray Generic',
			baseUrl: 'cctray',
			icon: 'cctray/icon.png',
			logo: 'cctray/logo.png',
			projects: [],
			urlHint: 'http://cruisecontrol.instance.com/cctray.xml'
		};
	};

	CCBuildService.prototype.updateAll = function () {
		function processResponse(projects) {
			$(projects)
				.find('Project')
				.filter(function selectedProjects(i, d) {
					return contains(self.settings.projects, $(d).attr('name'));
				})
				.map(function projectInfo(i, d) {
					var name = $(d).attr('name');
					return {
						name: name,
						category: $(d).attr('category'),
						status: $(d).attr('lastBuildStatus'),
						url: $(d).attr('webUrl'),
						activity: $(d).attr('activity')
					};
				})
				.each(function createOrUpdate(index, projectInfo) {
					var project = self.builds[projectInfo.name];
					if (!project) {
						project = new CCTrayProject(projectInfo.name, self.settings);
						project.on.broken.add(self.onBuildBroken, self);
						project.on.fixed.add(self.onBuildFixed, self);
						project.on.started.add(self.onBuildStarted, self);
						project.on.finished.add(self.onBuildFinished, self);
						self.builds[projectInfo.name] = project;
					}
					project.update(projectInfo);
				});
		}

		var completed = new Signal();
		completed.memorize = true;
		var self = this,
			request = ccRequest.projects(this.settings);
		request.responseReceived.addOnce(function (projectsResponse) {
			processResponse(projectsResponse);
			completed.dispatch();
		}, this);
		request.errorReceived.addOnce(function (errorInfo) {
			self.on.errorThrown.dispatch(errorInfo);
			completed.dispatch();
		}, this);
		return completed;
	};

	CCBuildService.prototype.onBuildBroken = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.name,
			group: project.projectName,
			url: project.webUrl,
			icon: this.settings.icon
		};
		this.on.brokenBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.onBuildFixed = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.name,
			group: project.projectName,
			url: project.webUrl,
			icon: this.settings.icon
		};
		this.on.fixedBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.onBuildStarted = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.name,
			group: project.projectName,
			url: project.webUrl,
			icon: this.settings.icon
		};
		this.on.startedBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.onBuildFinished = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.name,
			group: project.projectName,
			url: project.webUrl,
			icon: this.settings.icon
		};
		this.on.finishedBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.projects = function (selectedPlans) {
		var receivedProjects = new Signal();
		receivedProjects.memorize = true;
		var plansRequest = ccRequest.projects(this.settings);
		plansRequest.responseReceived.addOnce(function (response) {
			var templateData = createTemplateData(response, selectedPlans);
			receivedProjects.dispatch({
				projects: templateData
			});
		});
		plansRequest.errorReceived.addOnce(function (ajaxError) {
			receivedProjects.dispatch({
				error: ajaxError
			});
		});
		return receivedProjects;
	};

	CCBuildService.prototype.activeProjects = function () {
		var projectsInfo = values(this.builds).map(function (p) {
			return {
				name: p.name,
				group: p.projectName,
				isBroken: p.isBroken,
				url: p.webUrl,
				isBuilding: p.isRunning
			};
		});
		return {
			name: this.name,
			items: projectsInfo
		};
	};

	function createTemplateData(projectsXml, selectedProjects) {
		
		function createItem(i, d) {
			var item = $(d),
				projectName = item.attr('name');
			return {
				id: projectName,
				name: projectName,
				group: item.attr('category'),
				enabled: true,
				selected: selectedProjects.indexOf(projectName) > -1
			};
		}

		return {
			items: $(projectsXml)
				.find('Project')
				.map(createItem)
				.toArray()
		};
	}

	return CCBuildService;
});