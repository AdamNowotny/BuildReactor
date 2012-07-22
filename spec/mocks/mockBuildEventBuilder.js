define(function () {

	var MockBuildEventBuilder = function () {
		var failedBuildsCount = 0;
		var buildName = 'Build name';
		var group = 'Project name';

		this.create = function () {
			return {
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

	};

	return MockBuildEventBuilder;
});