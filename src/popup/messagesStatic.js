define(['rx', 'rx.time'], function (Rx) {

	'use strict';

	var activeProjects = [
		{
			name: "OpenMRS",
			items: [
				{
					name: "Failed offline",
					group: "Offline",
					isBroken: true,
					url: null,
					isBuilding: true,
					error: {
						message: "Ajax error",
						httpStatus: 500
					}
				}, {
					name: "Success offline",
					group: "Offline",
					isBroken: false,
					url: null,
					isBuilding: true,
					error: {
						message: "Ajax error",
						httpStatus: 500
					}
				}, {
					name: "Success",
					group: "Normal",
					isBroken: false,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isBuilding: true,
					tags: [{ name: 'Offline', description: 'Ajax error (500)' }]
				}, {
					name: "Failed",
					group: "Normal",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isBuilding: true,
					tags: [{ name: 'Unstable', type: 'warning' }]
				}, {
					name: "Success",
					group: "Disabled",
					isBroken: false,
					isDisabled: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isBuilding: true
				}, {
					name: "Failed",
					group: "Disabled",
					isBroken: true,
					isDisabled: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isBuilding: true
				}
			]
		}
	];

	return {
		init: function () {},
		activeProjects: Rx.Observable.returnValue(activeProjects)
	};
});