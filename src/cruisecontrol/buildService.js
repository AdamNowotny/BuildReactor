define([
		'signals',
		'./ccRequest',
		'./projectFactory',
		'../timer',
		'amdUtils/string/interpolate'
    ], function (signals, ccRequest, projectFactory, Timer, interpolate) {

		var CCBuildService = function (settings) {
			Contract.expectString(settings.name, 'settings.name not defined');
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
		    Contract.expectNumber(this.settings.updateInterval, 'Update interval not set');
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
		    var self = this;
			var request = ccRequest.projects(this.settings);
			request.responseReceived.addOnce(function (projectsResponse) {
			    processResponse(projectsResponse);
			    self.updateFinished.dispatch();
			}, this);
			request.errorReceived.addOnce(function (errorInfo) {
			    self.errorThrown.dispatch(errorInfo);
			    self.updateFinished.dispatch();
			}, this);

			function processResponse(responseJson) {
			    for (var i = 0; i < responseJson.Project.length; i++) {
			        var projectInfo = responseJson.Project[i];
			        if (self.settings.projects.indexOf(projectInfo.name) < 0) continue;
			        if (self.projects[projectInfo.name]) {
			            self.projects[projectInfo.name].update(projectInfo);
                    } else {
                        var newProject = projectFactory.create(projectInfo);
			            newProject.buildFailed.add(self.onBuildFailed, self);
			            newProject.buildFixed.add(self.onBuildFixed, self);
			            self.projects[projectInfo.name] = newProject;
                    }
				}

			}
		};

		CCBuildService.prototype.onBuildFailed = function (plan) {
			var buildEvent = {
				message: interpolate('Build failed - {{0}}', [plan.projectName]),
				details: plan.name,
				url: plan.url
			};
			this.buildFailed.dispatch(buildEvent);
		};

		CCBuildService.prototype.onBuildFixed = function (plan) {
			var buildEvent = {
				message: interpolate('Build fixed - {{0}}', [plan.projectName]),
				details: plan.name,
				url: plan.url
			};
			this.buildFixed.dispatch(buildEvent);
		};

		return CCBuildService;
	});