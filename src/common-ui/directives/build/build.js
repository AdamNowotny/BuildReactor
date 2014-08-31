define([
	'common-ui/directives/module'
], function (module) {

	'use strict';

	module.directive('build', function () {
		return {
			scope: {
				build: '=buildInfo',
				previousBuild: '='
			},
			templateUrl: 'src/common-ui/directives/build/build.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.getItemClasses = function (item) {
					var classes = {
						broken: item.isBroken,
						building: item.isRunning,
						disabled: item.isDisabled,
						offline: item.error
					};
					if (item.tags) {
						item.tags.forEach(function (tag) {
							classes[tag] = true;
						});
					}
					return classes;
				};

				$scope.getLabelClasses = function (tag) {
					var classes = tag.type ? 'label-' + tag.type : 'label-default';
					return classes;
				};

			}
		};
	});
});
