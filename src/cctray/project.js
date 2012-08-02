define(['signals'], function (signals) {

	'use strict';
	
	function project() {

		var status,
			projectName,
			category,
			url,
			failed = new signals.Signal(),
			fixed = new signals.Signal();

		function projectInstance() { }

		projectInstance.failed = failed;
		
		projectInstance.fixed = fixed;

		projectInstance.update = function (newProjectInfo) {
			var oldStatus = status;
			projectName = newProjectInfo.name;
			category = newProjectInfo.category;
			status = newProjectInfo.status;
			url = newProjectInfo.url;
			if (!oldStatus && newProjectInfo.status !== 'Success') {
				failed.dispatch(this);
			}
			if (oldStatus === 'Success' && newProjectInfo.status !== 'Success') {
				failed.dispatch(this);
			}
			if (oldStatus && oldStatus !== 'Success' && newProjectInfo.status === 'Success') {
				fixed.dispatch(this);
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