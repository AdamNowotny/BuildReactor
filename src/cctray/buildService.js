define([
		'jquery',
		'signals',
		'cctray/ccRequest',
		'cctray/projectFactory',
		'timer',
		'amdUtils/string/interpolate',
		'amdUtils/array/contains'
	], function ($, signals, ccRequest, projectFactory, Timer, interpolate, contains) {

		'use strict';

		var CCBuildService = function (settings) {
			if (!settings.name) {
				throw { name: 'ArgumentInvalid', message: 'settings.name not set' };
			}
			this.settings = settings;
			this.name = settings.name;
			this.projects = {};
			this.errorThrown = new signals.Signal();
			this.updateStarted = new signals.Signal();
			this.updateFinished = new signals.Signal();
			this.buildFailed = new signals.Signal();
			this.buildFixed = new signals.Signal();
		};

		CCBuildService.prototype.start = function () {
			if (!this.settings.updateInterval) {
				throw { name: 'ArgumentInvalid', message: 'settings.updateInterval not set' };
			}
			this.timer = new Timer();
			this.timer.elapsed.add(this.update, this);
			this.scheduleUpdate = function () {
				console.log(interpolate('{{0}}: Next check scheduled in {{1}} seconds', [ this.name, this.settings.updateInterval ]));
				this.timer.start(this.settings.updateInterval);
			};
			this.updateFinished.add(this.scheduleUpdate, this);
			this.update();
		};

		CCBuildService.prototype.stop = function () {
			this.updateFinished.remove(this.scheduleUpdate, this);
			this.timer.elapsed.remove(this.update, this);
		};

		CCBuildService.prototype.update = function () {
			this.updateStarted.dispatch();
			var self = this,
				request = ccRequest.projects(this.settings);
			request.responseReceived.addOnce(function (projectsResponse) {
				processResponse(projectsResponse);
				self.updateFinished.dispatch();
			}, this);
			request.errorReceived.addOnce(function (errorInfo) {
				self.errorThrown.dispatch(errorInfo);
				self.updateFinished.dispatch();
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
							isNew : self.projects[name] ? false : true,
							name: name,
							status: $(d).attr('lastBuildStatus')
						};
					})
					.each(function createOrUpdate(i, d) {
						if (d.isNew) {
							var newProject = projectFactory.create(d);
							newProject.buildFailed.add(self.onBuildFailed, self);
							newProject.buildFixed.add(self.onBuildFixed, self);
							self.projects[d.name] = newProject;
						} else {
							self.projects[d.name].update(d);
						}
					});
			}
		};

		CCBuildService.prototype.onBuildFailed = function (project) {
			var buildEvent = {
				message: interpolate('Build failed - {{0}}', [project.name]),
				details: project.name,
				url: project.url
			};
			this.buildFailed.dispatch(buildEvent);
		};

		CCBuildService.prototype.onBuildFixed = function (project) {
			var buildEvent = {
				message: interpolate('Build fixed - {{0}}', [project.name]),
				details: project.name,
				url: project.url
			};
			this.buildFixed.dispatch(buildEvent);
		};

		return CCBuildService;
	});