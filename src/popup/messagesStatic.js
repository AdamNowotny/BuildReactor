define(['rx', 'rx.time'], function (Rx) {

	'use strict';

	var activeProjects = JSON.parse('[{"name":"OpenMRS","items":[{"name":"Application Release Test","group":"Functional Tests","isBroken":false,"url":null,"isBuilding":true},{"name":"Performance Test","group":"Functional Tests","isBroken":true,"url":"http://ci.openmrs.org/browse/FUNC-PERF-4","isBuilding":true}]}]');

	return {
		init: function () {},
		currentState: Rx.Observable.returnValue(activeProjects)
	};
});