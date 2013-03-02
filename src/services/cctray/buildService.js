define([
	'jquery',
	'signals',
	'./ccRequest',
	'./cctrayProject',
	'mout/array/contains',
	'common/joinUrl',
	'services/buildService'
], function ($, Signal, ccRequest, CCTrayProject, contains, joinUrl, BuildService) {

	'use strict';

	var CCBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = CCTrayProject;
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
			urlHint: 'http://cruisecontrol.instance.com/cctray.xml'
		};
	};

	var updateAll = function () {
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
						self.observeBuild(project);
						self.builds[projectInfo.name] = project;
					}
					project.update(projectInfo);
				});
		}

		var completed = new Signal();
		completed.memorize = true;
		var self = this;
		var requestSettings = {
			url: joinUrl(this.settings.url, this.cctrayLocation),
			username: this.settings.username,
			password: this.settings.password
		};
		var request = ccRequest.projects(requestSettings);
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

	var projects = function (selectedPlans) {
		var completed = new Signal();
		completed.memorize = true;
		var requestSettings = {
			url: joinUrl(this.settings.url, this.cctrayLocation),
			username: this.settings.username,
			password: this.settings.password
		};
		var plansRequest = ccRequest.projects(requestSettings);
		plansRequest.responseReceived.addOnce(function (response) {
			var templateData = createTemplateData(response, selectedPlans);
			completed.dispatch({ projects: templateData });
		});
		plansRequest.errorReceived.addOnce(function (ajaxError) {
			completed.dispatch({ error: ajaxError });
		});
		return completed;
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

	CCBuildService.prototype = {
		projects: projects
	};

	return CCBuildService;
});
