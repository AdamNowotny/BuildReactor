define(['signals'], function (signals) {

	function project() {

		var status,
			projectName,
			buildFailed = new signals.Signal(),
			buildFixed = new signals.Signal();

		function projectInstance() { }

		projectInstance.buildFailed = buildFailed;
		
		projectInstance.buildFixed = buildFixed;

		projectInstance.update = function (newProjectInfo) {
			var oldStatus = status;
			projectName = newProjectInfo.name;
			status = newProjectInfo.status;
			if (!oldStatus && newProjectInfo.status !== 'Success') {
				console.log('cc build failed', projectName);
				buildFailed.dispatch(this);
			}
			if (oldStatus === 'Success' && newProjectInfo.status !== 'Success') {
				buildFailed.dispatch(this);
			}
			if (oldStatus && oldStatus !== 'Success' && newProjectInfo.status === 'Success') {
				buildFixed.dispatch(this);
			}
			return projectInstance;
		};

		projectInstance.status = function () {
			return status;
		};

		projectInstance.projectName = function () {
			return projectName;
		};

		return projectInstance;
	}

	return project;

});