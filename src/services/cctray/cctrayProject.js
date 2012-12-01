define(['services/build', 'signals', 'jquery'], function (Build, signals, $) {

	'use strict';
	
	var CCTrayProject = function (id, settings) {
		$.extend(this, new Build(id, settings));
	};

	var update = function (newProjectInfo) {
		var old = {
			isRunning: this.isRunning,
			isBroken: this.isBroken
		};
		this.name = newProjectInfo.name;
		this.projectName = newProjectInfo.category;
		this.webUrl = newProjectInfo.url;
		this.isRunning = (newProjectInfo.activity === 'Building');
		this.isBroken = (newProjectInfo.status in { 'Failure': 1, 'Exception': 1 });
		if (!old.isBroken && this.isBroken) {
			this.on.broken.dispatch(this);
		}
		if (old.isBroken && !this.isBroken) {
			this.on.fixed.dispatch(this);
		}
		if (!old.isRunning && this.isRunning) {
			this.on.started.dispatch(this);
		}
		if (old.isRunning && !this.isRunning) {
			this.on.finished.dispatch(this);
		}
	};

	CCTrayProject.prototype = {
		update: update
	};

	return CCTrayProject;

});