define([
	'jquery',
	'signals',
	'./ccRequest',
	'./project',
	'common/timer',
	'amdUtils/string/interpolate',
	'amdUtils/array/contains',
	'amdUtils/object/values',
	'urljs',
	'services/poolingService'
], function ($, Signal, ccRequest, project, Timer, interpolate, contains, values, URL, PoolingService) {

	'use strict';

	var CCBuildService = function (settings) {
		$.extend(this, new PoolingService(settings));
		this.settings = this._createSettings(settings);
		this._selectedProjects = {};
	};

		
	CCBuildService.prototype._createSettings = function (settings) {
		var newSettings = CCBuildService.settings();
		newSettings.name = settings.name;
		newSettings.url = URL.resolve(settings.url, this.cctrayLocation());
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

	CCBuildService.prototype.update = function () {
		this.on.updating.dispatch();
		var self = this,
			request = ccRequest.projects(this.settings);
		request.responseReceived.addOnce(function (projectsResponse) {
			processResponse(projectsResponse);
			self.on.updated.dispatch();
		}, this);
		request.errorReceived.addOnce(function (errorInfo) {
			self.on.errorThrown.dispatch(errorInfo);
			self.on.updated.dispatch();
		}, this);

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
				.each(function createOrUpdate(i, d) {
					var projectInstance = self._selectedProjects[d.name];
					if (!projectInstance) {
						projectInstance = project();
						projectInstance.failed.add(self.onBuildFailed, self);
						projectInstance.fixed.add(self.onBuildFixed, self);
						projectInstance.started.add(self.onBuildStarted, self);
						projectInstance.finished.add(self.onBuildFinished, self);
						self._selectedProjects[d.name] = projectInstance;
					}
					projectInstance.update(d);
				});
		}
	};

	CCBuildService.prototype.onBuildFailed = function (project) {
		var buildEvent = {
			serviceName: this.serviceName,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.brokenBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.onBuildFixed = function (project) {
		var buildEvent = {
			serviceName: this.serviceName,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.fixedBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.onBuildStarted = function (project) {
		var buildEvent = {
			serviceName: this.serviceName,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.startedBuild.dispatch(buildEvent);
	};

	CCBuildService.prototype.onBuildFinished = function (project) {
		var buildEvent = {
			serviceName: this.serviceName,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
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
		var projectsInfo = values(this._selectedProjects).map(function (p) {
			return {
				name: p.projectName(),
				group: p.category(),
				isBroken: p.status() === 'Failure',
				url: p.url(),
				isBuilding: p.isBuilding()
			};
		});
		return {
			name: this.serviceName,
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