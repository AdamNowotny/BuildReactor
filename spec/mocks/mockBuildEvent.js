define(function () {

	'use strict';
	
	var failedBuildsCount = 0;
	var serviceName = 'Service name';
	var buildName = 'Build name';
	var group = 'Project name';
	var url = 'http://example.com/project/build/100';

	var mockBuildEvent = function () {

		return {
			serviceName: serviceName,
			buildName: buildName,
			group: group,
			url: url,
			icon: 'icon.png'
		};
	};

	mockBuildEvent.serviceName = function (value) {
		serviceName = value;
		return mockBuildEvent;
	};

	mockBuildEvent.buildName = function (value) {
		buildName = value;
		return mockBuildEvent;
	};

	mockBuildEvent.group = function (value) {
		group = value;
		return mockBuildEvent;
	};

	mockBuildEvent.url = function (value) {
		if (!arguments) { return value; }
		url = value;
		return mockBuildEvent;
	};

	return mockBuildEvent;
});