define(function () {

	'use strict';
	
	var MockBuildEventBuilder = function () {
		var failedBuildsCount = 0;
		var serviceName = 'Service name';
		var buildName = 'Build name';
		var group = 'Project name';

		this.create = function () {
			return {
				serviceName: serviceName,
				buildName: buildName,
				group: group,
				url: 'http://example.com/project/build/100',
				state: {
					failedBuildsCount: failedBuildsCount
				}
			};
		};

		this.withFailedBuilds = function (amount) {
			failedBuildsCount = amount;
			return this;
		};

		this.withServiceName = function (value) {
			serviceName = value;
			return this;
		};

		this.withBuildName = function (value) {
			buildName = value;
			return this;
		};

		this.withGroup = function (value) {
			group = value;
			return this;
		};
	};

	return MockBuildEventBuilder;
});