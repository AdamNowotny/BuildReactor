define([
	'settings/app',
	'common/core',
	'rx'
], function (app, core) {
	'use strict';

	app.controller('ServiceSettingsCtrl', function ($scope, $routeParams) {

		$scope.show = function () {
			var settings;
			$scope.$emit('dynamicForm.showClicked', settings);
		};

		$scope.save = function () {
			$scope.$emit('dynamicForm.saveClicked');
		};

	});
});