define([
	'dashboard/app',
	'common/core',
	'rx',
	'common/sortBy',
	'angular'
], function (app, core, Rx, sortBy, angular) {

	'use strict';

	app.controller('DashboardCtrl', function ($scope) {

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

		$scope.services = [];
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

		core.activeProjects.subscribe(function (services) {
			$scope.services = services ? createModel(services) : [];
			$scope.$$phase || $scope.$apply();
		});
	});
});