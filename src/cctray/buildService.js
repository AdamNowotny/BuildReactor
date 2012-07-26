define([
		'jquery',
		'signals',
		'cctray/ccRequest',
		'cctray/project',
		'timer',
		'amdUtils/string/interpolate',
		'amdUtils/array/contains'
	], function ($, signals, ccRequest, project, Timer, interpolate, contains) {

		'use strict';

		var CCBuildService = function (settings) {
			if (!settings.name) {
				throw { name: 'ArgumentInvalid', message: 'settings.name not set' };
			}
			this.settings = settings;
			this.name = settings.name;
			this.projects = {};
			this.on = {
				errorThrown: new signals.Signal(),
				updating: new signals.Signal(),
				updated: new signals.Signal(),
				brokenBuild: new signals.Signal(),
				fixedBuild: new signals.Signal()
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
							status: $(d).attr('lastBuildStatus')
						};
					})
					.each(function createOrUpdate(i, d) {
						var projectInstance = self.projects[d.name];
						if (!projectInstance) {
							projectInstance = project();
							projectInstance.failed.add(self.onBuildFailed, self);
							projectInstance.fixed.add(self.onBuildFixed, self);
							self.projects[d.name] = projectInstance;
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
				url: project.url,
				icon: this.settings.icon
			};
			this.on.brokenBuild.dispatch(buildEvent);
		};

		CCBuildService.prototype.onBuildFixed = function (project) {
			var buildEvent = {
				serviceName: this.name,
				buildName: project.projectName(),
				group: project.category(),
				url: project.url,
				icon: this.settings.icon
			};
			this.on.fixedBuild.dispatch(buildEvent);
		};

		return CCBuildService;
	});