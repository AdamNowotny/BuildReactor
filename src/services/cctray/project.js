define(['signals'], function (signals) {

	'use strict';
	
	var projectStatus = {
		unknown: 'Unknown',
		success: 'Success',
		failure: 'Failure'
	};

	function parseStatus(status) {
		switch (status) {
		case 'Success':
			return projectStatus.success;
		case 'Failure':
			return projectStatus.failure;
		case 'Exception':
			return projectStatus.failure;
		default:
			return projectStatus.unknown;
		}
	}

	function project() {

		var status = projectStatus.unknown,
			activity = 'Sleeping',
			projectName,
			category,
			url,
			failed = new signals.Signal(),
			fixed = new signals.Signal(),
			started = new signals.Signal(),
			finished = new signals.Signal();

		function projectInstance() { }

		projectInstance.failed = failed;
		projectInstance.fixed = fixed;
		projectInstance.started = started;
		projectInstance.finished = finished;

		projectInstance.update = function (newProjectInfo) {
			var that = this;

			function initialize() {
				if (status === projectStatus.failure) {
					failed.dispatch(that);
				}
				if (activity === 'Building') {
					started.dispatch(that);
				}
			}

			var oldStatus = status;
			var oldActivity = activity;
			projectName = newProjectInfo.name;
			category = newProjectInfo.category;
			status = parseStatus(newProjectInfo.status);
			url = newProjectInfo.url;
			activity = newProjectInfo.activity;
			if (oldStatus === projectStatus.unknown) {
				initialize();
			} else {
				if (oldStatus === projectStatus.success && status === projectStatus.failure) {
					failed.dispatch(this);
				}
				if ((oldStatus === projectStatus.failure) && status === projectStatus.success) {
					fixed.dispatch(this);
				}
				if (oldActivity === 'Sleeping' && activity === 'Building') {
					started.dispatch(this);
				}
				if (oldActivity === 'Building' && activity === 'Sleeping') {
					finished.dispatch(this);
				}
			}
			return projectInstance;
		};

		projectInstance.url = function () {
			return url;
		};

		projectInstance.status = function () {
			return status;
		};

		projectInstance.projectName = function () {
			return projectName;
		};

		projectInstance.category = function () {
			return category;
		};
		
		return projectInstance;
	}

	return project;

});