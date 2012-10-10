define([
		'jquery',
		'signals',
		'./ccRequest',
		'./project',
		'timer',
		'amdUtils/string/interpolate',
		'amdUtils/array/contains',
		'amdUtils/object/values',
		'urljs'
	], function ($, signals, ccRequest, project, Timer, interpolate, contains, values, URL) {

		'use strict';

		var CCBuildService = function (settings) {
			this.settings = this._createSettings(settings);
			this.name = this.settings.name;
			this._selectedProjects = {};
			this.on = {
				errorThrown: new signals.Signal(),
				updating: new signals.Signal(),
				updated: new signals.Signal(),
				brokenBuild: new signals.Signal(),
				fixedBuild: new signals.Signal()
			};
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

		CCBuildService.prototype.start = function () {
			if (!this.settings.updateInterval) {
				throw { name: 'ArgumentInvalid', message: 'settings.updateInterval not set' };
			}
			this.timer = new Timer();
			this.timer.on.elapsed.add(this.update, this);
			this.scheduleUpdate = function () {
				this.timer.start(this.settings.updateInterval);
			};
			this.on.updated.add(this.scheduleUpdate, this);
			this.update();
		};

		CCBuildService.prototype.stop = function () {
			this.on.updated.remove(this.scheduleUpdate, this);
			this.timer.on.elapsed.remove(this.update, this);
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
							url: $(d).attr('webUrl')
						};
					})
					.each(function createOrUpdate(i, d) {
						var projectInstance = self._selectedProjects[d.name];
						if (!projectInstance) {
							projectInstance = project();
							projectInstance.failed.add(self.onBuildFailed, self);
							projectInstance.fixed.add(self.onBuildFixed, self);
							self._selectedProjects[d.name] = projectInstance;
						}
						projectInstance.update(d);
					});
			}
		};

		CCBuildService.prototype.onBuildFailed = function (project) {
			var buildEvent = {
				serviceName: this.name,
				buildName: project.projectName(),
				group: project.category(),
				url: project.url(),
				icon: this.settings.icon
			};
			this.on.brokenBuild.dispatch(buildEvent);
		};

		CCBuildService.prototype.onBuildFixed = function (project) {
			var buildEvent = {
				serviceName: this.name,
				buildName: project.projectName(),
				group: project.category(),
				url: project.url(),
				icon: this.settings.icon
			};
			this.on.fixedBuild.dispatch(buildEvent);
		};

		CCBuildService.prototype.projects = function (selectedPlans) {
			var on = {
				errorThrown: new signals.Signal(),
				receivedProjects: new signals.Signal()
			};
			var plansRequest = ccRequest.projects(this.settings);
			plansRequest.responseReceived.addOnce(function (response) {
				var templateData = createTemplateData(response, selectedPlans);
				on.receivedProjects.dispatch(templateData);
			});
			plansRequest.errorReceived.addOnce(function (ajaxError) {
				on.errorThrown.dispatch(ajaxError);
			});
			return on;
		};

		CCBuildService.prototype.activeProjects = function () {
			var projectsInfo = values(this._selectedProjects).map(function (p) {
				return {
					name: p.projectName(),
					group: p.category(),
					isBroken: p.status() === 'Failure',
					url: p.url()
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