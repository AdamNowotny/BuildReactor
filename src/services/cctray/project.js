define(['signals'], function (signals) {

	'use strict';
	
	var projectStatus = {
		unknown: 'Unknown',
		success: 'Success',
		failure: 'Failure',
		building: 'Building'
	};

	function parseStatus(status) {
		switch (status) {
		case 'Success':
			return projectStatus.success;
		case 'Failure':
			return projectStatus.failure;
		case 'Exception':
			return projectStatus.failure;
		case 'Building':
			return projectStatus.building;
		default:
			return projectStatus.unknown;
		}
	}

	function project() {

		var status = projectStatus.unknown,
			projectName,
			category,
			url,
			failed = new signals.Signal(),
			fixed = new signals.Signal();

		function projectInstance() { }

		projectInstance.failed = failed;
		
		projectInstance.fixed = fixed;

		projectInstance.update = function (newProjectInfo) {
			var that = this;

			function initialize() {
				if (status === projectStatus.failure) {
					failed.dispatch(that);
				}
			}

			var oldStatus = status;
			projectName = newProjectInfo.name;
			category = newProjectInfo.category;
			status = parseStatus(newProjectInfo.status);
			url = newProjectInfo.url;
			if (oldStatus === projectStatus.unknown) {
				initialize();
			} else {
				if (oldStatus === projectStatus.success && status === projectStatus.failure) {
					failed.dispatch(this);
				}
				if ((oldStatus === projectStatus.failure) && status === projectStatus.success) {
					fixed.dispatch(this);
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