define([
	'common/directives/module',
	'common/sortBy',
	'rx',
	'common/core'
], function (module, sortBy, Rx, core) {

	'use strict';

	module.directive('builds', function ($timeout) {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'src/common/directives/builds.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				function createModel(state) {
					return state.map(function (serviceState) {
						sortBy('group', serviceState.items);
						return {
							name: serviceState.name,
							groups: getGroups(serviceState.items)
						};
					});
				}

				function getGroups(rows) {
					var model = [];
					Rx.Observable.fromArray(rows).groupBy(function (item) {
						return item.group || '';
					}).subscribe(function (group) {
						var groupModel = {
							name: group.key,
							items: []
						};
						model.push(groupModel);
						group.subscribe(function (item) {
							groupModel.items.push(item);
						});
					});
					return model;
				}

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
					var classes = tag.type ? 'label-' + tag.type : 'label-inverse';
					return classes;
				};

				$scope.start = function () {
					$scope.services = [];
					core.activeProjects.subscribe(function (services) {
						$timeout(function () {
							$scope.services = services ? createModel(services) : [];
						});
					});
				};
			},
			link: function (scope, element, attrs, controller) {
				scope.start();
			}
		};
	});
});