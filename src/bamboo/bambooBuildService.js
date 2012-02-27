define([
		'./bambooRequest',
		'./bambooPlan',
		'../timer',
		'signals'
	], function (BambooRequest, BambooPlan, Timer, signals) {

		var BambooBuildService = function (settings) {
			Contract.expectString(settings.name, 'settings.name not defined');
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

		BambooBuildService.prototype.initialize = function () {
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

			function initializeFrom(projectsResponse) {
				for (var i = 0; i < projectsResponse.projects.project.length; i++) {
					var responseProject = projectsResponse.projects.project[i];
					initializeFromProject(responseProject);
				}

				function initializeFromProject(project) {
					for (var j = 0; j < project.plans.plan.length; j++) {
						var responsePlan = project.plans.plan[j];
						if (self.settings.plans.indexOf(responsePlan.key) < 0) continue;
						initializePlan(responsePlan);
					}
				}

				function initializePlan(responsePlan) {
					if (!responsePlan.enabled) return;
					var plan = new BambooPlan(self.settings);
					plan.buildFailed.add(self.onBuildFailed, self);
					plan.buildFixed.add(self.onBuildFixed, self);
					plan.errorThrown.add(self.onPlanError, self);
					self.plans[responsePlan.key] = plan;
					self.plansCount++;
					plan.initialize(responsePlan);
				}

			}
		};

		BambooBuildService.prototype.onBuildFailed = function (plan) {
			var buildEvent = {
				message: 'Build failed - {0}'.format(plan.projectName),
				details: plan.name,
				url: plan.url
			};
			this.buildFailed.dispatch(buildEvent);
		};

		BambooBuildService.prototype.onBuildFixed = function (plan) {
			var buildEvent = {
				message: 'Build fixed - {0}'.format(plan.projectName),
				details: plan.name,
				url: plan.url
			};
			this.buildFixed.dispatch(buildEvent);
		};

		BambooBuildService.prototype.onPlanError = function (ajaxError) {
			this.errorThrown.dispatch(ajaxError);
		};

		BambooBuildService.prototype.start = function () {
			Contract.expectNumber(this.settings.updateInterval, 'Update interval not set');
			this.timer = new Timer();
			this.timer.elapsed.add(this.update, this);
			this.scheduleUpdate = function () {
				console.log('BambooBuildService: Next check scheduled in {0} seconds'.format(this.settings.updateInterval));
				this.timer.start(this.settings.updateInterval);
			};
			this.updateFinished.add(this.scheduleUpdate, this);
			this.update();
		};

		BambooBuildService.prototype.update = function () {
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

		BambooBuildService.prototype.stop = function () {
			this.updateFinished.remove(this.scheduleUpdate, this);
			this.timer.elapsed.remove(this.update, this);
			this.isInitialized = false;
		};

		BambooBuildService.prototype.planUpdate = function () {
			var plansUpdated = 0;
			for (var planKey in this.plans) {
				this.plans[planKey].update().addOnce(function () {
					plansUpdated++;
					if (plansUpdated == this.plansCount) {
						this.updateFinished.dispatch();
					}
				}, this);
			}
		};

		return BambooBuildService;
	});