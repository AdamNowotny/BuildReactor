define([
	'common-ui/directives/module',
	'common-ui/directives/build/build'
], function (module) {

	'use strict';

	module.directive('service', function () {
		return {
			scope: {
				service: '=serviceInfo'
			},
			templateUrl: 'src/common-ui/directives/service/service.html',
			controller: function ($scope, $element, $attrs, $transclude) {

			}
		};
	});
});
