define(['signals'], function (signals) {

	function project() {

		var status,
			projectName,
			category,
			buildFailed = new signals.Signal(),
			buildFixed = new signals.Signal();

		function projectInstance() { }

		projectInstance.buildFailed = buildFailed;
		
		projectInstance.buildFixed = buildFixed;

		projectInstance.update = function (newProjectInfo) {
			var oldStatus = status;
			projectName = newProjectInfo.name;
			category = newProjectInfo.category;
			status = newProjectInfo.status;
			if (!oldStatus && newProjectInfo.status !== 'Success') {
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

		projectInstance.category = function () {
			return category;
		};
		
		return projectInstance;
	}

	return project;

});