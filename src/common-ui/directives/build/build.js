define([
	'common-ui/directives/module'
], function (module) {

	'use strict';

	module.directive('build', function () {
		return {
			scope: {
				build: '=buildInfo'
			},
			templateUrl: 'src/common-ui/directives/build/build.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.getLabelClasses = function (tag) {
					var classes = tag.type ? 'label-' + tag.type : 'label-default';
					return classes;
				};

			}
		};
	});
});
