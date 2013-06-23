define(['rx', 'rx.time'], function (Rx) {

	'use strict';

	var activeProjects = [
		{
			name: "OpenMRS",
			items: [
				{
					name: "Reset Latest Demo DB",
					group: "Demo Sites",
					isBroken: false,
					url: null,
					isRunning: true
				}, {
					name: "OpenMRS Core",
					group: "JUnit",
					isBroken: false,
					url: null,
					isRunning: false
				}
			]
		}, {
			name: 'Jenkins',
			items: [
				{
					name: "infra_main_svn_to_git",
					isBroken: false,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false,
					isDisabled: true
				}, {
					name: "infra_plugin-compat-tester",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false
				}, {
					name: "jenkins_lts_branch",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false,
					tags: [{ name: 'Unstable', type: 'warning' }]
				}, {
					name: "model-ruby-project",
					isBroken: false,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false
				}
			]
		}
	];

	return {
		init: function () {},
		activeProjects: Rx.Observable.returnValue(activeProjects)
	};
});