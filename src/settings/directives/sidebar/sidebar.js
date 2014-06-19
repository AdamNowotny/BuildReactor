define([
	'settings/app',
	'common/core',
	'htmlSortable'
], function (app, core) {
	'use strict';

	app.directive('sidebar', function ($location) {
		return {
			scope: {
				services: '=',
				selected: '=',
				isNew: '=new'
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				
				$scope.navigate = function (url) {
					$location.path(url);
				};

				$scope.$watchCollection('services', function (services) {
					if (services) {
						var orderItems = services.map(function (service) {
							return service.name;
						});
						orderItems && core.setOrder(orderItems);
					}
				});
			}
		};
	});
});
