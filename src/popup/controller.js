define([
	'popup/app',
	'common-ui/core'
], function (app, core) {
	'use strict';

	app.controller('PopupCtrl', function ($scope) {

		$scope.navbarStyle = 'navbar-inverse';
		
		core.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.viewConfig = config;
				$scope.navbarStyle = (config.theme === 'light') ? 'navbar-default' : 'navbar-inverse';
			});
		});

	});
});
