define([
	'common-ui/directives/module',
	'rx',
	'angular',
	'rx.binding',
	'rx.coincidence',
	'common-ui/directives/buildGroup/buildGroup'
], function (module, Rx, angular) {

	'use strict';

	module.directive('service', function () {
		return {
			restrict: 'E',
			scope: {
				service: '=serviceInfo'
			},
			templateUrl: 'src/common-ui/directives/service/service.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.$watch('service', function (service) {
					var items = $scope.service ? $scope.service.items : [];
					var groups = [];
					Rx.Observable.fromArray(items).select(function (build) {
						build.group = build.group || '';
						return build;
					}).groupBy(function (build) {
						return build.group;
					}).selectMany(function (groupBy) {
						return groupBy
							.toArray()
					        .select(function (items) {
					        	return {
					        		name: groupBy.key,
					        		items: items
					        	};
					        });
					})
					.toArray().subscribe(function (d) {
						groups = d;
					});
					$scope.groups = groups;
				});
			}
		};
	});
});
