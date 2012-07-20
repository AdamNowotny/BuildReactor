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
			this.errorThrown = new signals.Signal();
			this.updateStarted = new signals.Signal();
			this.updateFinished = new signals.Signal();
			this.buildFailed = new signals.Signal();
			this.buildFixed = new signals.Signal();
		};

		BuildService.prototype.start = function () {
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

		BuildService.prototype.stop = function () {
			this.updateFinished.remove(this.scheduleUpdate, this);
			this.timer.elapsed.remove(this.update, this);
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
					if (self.settings.plans.indexOf(responsePlan.key) < 0) {
						continue;
					}
					initializePlan(responsePlan);
				}
			}

			function initializePlan(responsePlan) {
				if (!responsePlan.enabled) { return; }
				var plan = new BambooPlan(self.settings);
				plan.buildFailed.add(self.onBuildFailed, self);
				plan.buildFixed.add(self.onBuildFixed, self);
				plan.errorThrown.add(self.onPlanError, self);
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
			initRequest.responseReceived.addOnce(function (projectsResponse) {
				initializeFrom(projectsResponse);
				initializeFinished.dispatch(true, projectsResponse);
			}, this);
			initRequest.errorReceived.addOnce(function (errorInfo) {
				initializeFinished.dispatch(false, errorInfo);
			}, this);
			initRequest.projects();
			return initializeFinished;



		};

		BuildService.prototype.update = function () {
			this.updateStarted.dispatch();
			if (this.isInitialized) {
				this.planUpdate();
			} else {
				this.initialize().addOnce(function (success, result) {
					if (success) {
						this.isInitialized = true;
						this.planUpdate();
					} else {
						// login invalid ?
						this.errorThrown.dispatch(result);
						this.updateFinished.dispatch();
					}
				}, this);
			}
		};

		BuildService.prototype.planUpdate = function () {
			var plansUpdated = 0,
				self = this;
			function planFinished() {
				plansUpdated++;
				if (plansUpdated === self.plansCount) {
					self.updateFinished.dispatch();
				}
			}

			for (var planKey in this.plans) {
				if (this.plans.hasOwnProperty(planKey)) {
					this.plans[planKey].update().addOnce(planFinished, this);
				}
			}
		};

		BuildService.prototype.onBuildFailed = function (plan) {
			var buildEvent = {
				buildName: plan.name,
				group: plan.projectName,
				url: plan.url
			};
			this.buildFailed.dispatch(buildEvent);
		};

		BuildService.prototype.onBuildFixed = function (plan) {
			var buildEvent = {
				buildName: plan.name,
				group: plan.projectName,
				url: plan.url
			};
			this.buildFixed.dispatch(buildEvent);
		};

		BuildService.prototype.onPlanError = function (ajaxError) {
			this.errorThrown.dispatch(ajaxError);
		};

		return BuildService;
	});