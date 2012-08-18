define([
		'signals',
		'bamboo/bambooRequest',
		'bamboo/bambooPlan',
		'timer',
		'amdUtils/string/interpolate'
	], function (signals, BambooRequest, BambooPlan, Timer, interpolate) {

		'use strict';

		var BuildService = function (settings) {
			if (!settings.name) {
				throw { name: 'ArgumentInvalid', message: 'settings.name not set' };
			}
			this.isInitialized = false;
			this.settings = settings;
			this.name = settings.name;
			this.plans = {};
			this.plansCount = 0;
			this.on = {
				errorThrown: new signals.Signal(),
				updating: new signals.Signal(),
				updated: new signals.Signal(),
				brokenBuild: new signals.Signal(),
				fixedBuild: new signals.Signal()
			};
		};

		BuildService.settings = function () {
			return {
				typeName: 'Atlassian Bamboo',
				baseUrl: 'bamboo',
				icon: 'bamboo/icon.png'
			};
		};

		BuildService.prototype.start = function () {
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

		BuildService.prototype.stop = function () {
			this.on.updated.remove(this.scheduleUpdate, this);
			this.timer.on.elapsed.remove(this.update, this);
			this.isInitialized = false;
		};

		BuildService.prototype.initialize = function () {
			
			function initializeFrom(projectsResponse) {
				for (var i = 0; i < projectsResponse.projects.project.length; i++) {
					var responseProject = projectsResponse.projects.project[i];
					initializeFromProject(responseProject);
				}
			}
			function initializeFromProject(project) {
				for (var j = 0; j < project.plans.plan.length; j++) {
					var responsePlan = project.plans.plan[j];
					if (self.settings.projects.indexOf(responsePlan.key) < 0) {
						continue;
					}
					initializePlan(responsePlan);
				}
			}

			function initializePlan(responsePlan) {
				if (!responsePlan.enabled) { return; }
				var plan = new BambooPlan(self.settings);
				plan.on.failed.add(self.onBuildFailed, self);
				plan.on.fixed.add(self.onBuildFixed, self);
				plan.on.errorThrown.add(self.onPlanError, self);
				self.plans[responsePlan.key] = plan;
				self.plansCount++;
				plan.initialize(responsePlan);
			}

			var initializeFinished = new signals.Signal();
			initializeFinished.memorize = true;
			var self = this;
			this.plans = {};
			this.plansCount = 0;
			var initRequest = new BambooRequest(this.settings);
			initRequest.on.responseReceived.addOnce(function (projectsResponse) {
				initializeFrom(projectsResponse);
				initializeFinished.dispatch(true, projectsResponse);
			}, this);
			initRequest.on.errorReceived.addOnce(function (errorInfo) {
				initializeFinished.dispatch(false, errorInfo);
			}, this);
			initRequest.projects();
			return initializeFinished;
		};

		BuildService.prototype.update = function () {
			this.on.updating.dispatch();
			if (this.isInitialized) {
				this.planUpdate();
			} else {
				this.initialize().addOnce(function (success, result) {
					if (success) {
						this.isInitialized = true;
						this.planUpdate();
					} else {
						// login invalid ?
						this.on.errorThrown.dispatch(result);
						this.on.updated.dispatch();
					}
				}, this);
			}
		};

		BuildService.prototype.planUpdate = function () {
			
			function planFinished() {
				plansToUpdate--;
				signalIfUpdated();
			}

			function signalIfUpdated() {
				if (plansToUpdate === 0) {
					self.on.updated.dispatch();
				}
			}
			
			var plansToUpdate = this.plansCount;
			var self = this;
			signalIfUpdated();
			for (var planKey in this.plans) {
				if (this.plans.hasOwnProperty(planKey)) {
					this.plans[planKey].update().addOnce(planFinished, this);
				}
			}
		};

		BuildService.prototype.onBuildFailed = function (plan) {
			var buildEvent = {
				serviceName: this.name,
				buildName: plan.name,
				group: plan.projectName,
				url: plan.url,
				icon: this.settings.icon
			};
			this.on.brokenBuild.dispatch(buildEvent);
		};

		BuildService.prototype.onBuildFixed = function (plan) {
			var buildEvent = {
				serviceName: this.name,
				buildName: plan.name,
				group: plan.projectName,
				url: plan.url,
				icon: this.settings.icon
			};
			this.on.fixedBuild.dispatch(buildEvent);
		};

		BuildService.prototype.onPlanError = function (ajaxError) {
			this.on.errorThrown.dispatch(ajaxError);
		};

		BuildService.prototype.getProjects = function (requestSettings, selectedPlans) {
			var on = {
				errorThrown: new signals.Signal(),
				receivedProjects: new signals.Signal()
			};
			var plansRequest = new BambooRequest(requestSettings);
			plansRequest.on.responseReceived.addOnce(function (response) {
				var templateData = createTemplateData(response, selectedPlans);
				on.receivedProjects.dispatch(templateData);
			});
			plansRequest.on.errorReceived.addOnce(function (ajaxError) {
				on.errorThrown.dispatch(ajaxError);
			});
			plansRequest.projects();
			return on;
		};

		var createTemplateData = function (response, selectedPlans) {
			var projects = response.projects.project;
			var items = [];
			for (var projectIndex = 0; projectIndex < projects.length; projectIndex++) {
				var project = projects[projectIndex];
				for (var planIndex = 0; planIndex < project.plans.plan.length; planIndex++) {
					var plan = project.plans.plan[planIndex];
					var item = {
						id: plan.key,
						name: plan.shortName,
						group: project.name,
						enabled: plan.enabled,
						selected: selectedPlans.indexOf(plan.key) > -1
					};
					items.push(item);
				}
			}
			return {
				items: items
			};
		};

		return BuildService;
	});