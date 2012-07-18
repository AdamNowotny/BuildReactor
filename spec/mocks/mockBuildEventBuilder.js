define(function () {

	var MockBuildEventBuilder = function () {
		var failedBuildsCount = 0;
		var message = 'Build failed';
		var details = 'Build 123 failed';

		this.create = function () {
			return {
				message: message,
				details: details,
				url: 'http://example.com/project/build/100',
				state: {
					failedBuildsCount: failedBuildsCount
				}
			};
		};

		this.withFailedBuilds = function (amount) {
			if (amount === 0) {
				message = 'Build fixed';
				details = 'Build 123 fixed';
			} else {
				message = 'Build failed';
				details = 'Build 123 failed';
			}
			failedBuildsCount = amount;
			return this;
		};

	};

	return MockBuildEventBuilder;
});