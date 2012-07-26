define(function () {

	'use strict';
	
	var failedBuildsCount = 0;
	var serviceName = 'Service name';
	var buildName = 'Build name';
	var group = 'Project name';

	var mockBuildEvent = function () {

		return {
			serviceName: serviceName,
			buildName: buildName,
			group: group,
			url: 'http://example.com/project/build/100',
			icon: 'icon.png'
		};
	};

	mockBuildEvent.withServiceName = function (value) {
		serviceName = value;
		return mockBuildEvent;
	};

	mockBuildEvent.withBuildName = function (value) {
		buildName = value;
		return mockBuildEvent;
	};

	mockBuildEvent.withGroup = function (value) {
		group = value;
		return mockBuildEvent;
	};

	return mockBuildEvent;
});