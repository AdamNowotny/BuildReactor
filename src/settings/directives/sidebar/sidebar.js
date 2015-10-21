define([
	'settings/app',
	'common-ui/core',
	'htmlSortable'
], function (app, core) {
	'use strict';

	app.directive('sidebar', function ($location) {
		return {
			scope: {
				services: '=',
				configs: '=',
				currentService: '=',
				currentConfig: '=',
				view: '='
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.sortableCallback = function (startModel, destModel, start, end) {
					var items = destModel.map(function (service) {
						return service.name;
					});
					core.setOrder(items);
				};

				$scope.getServiceIcon = function (typeName) {
					if (typeName) {
						var service = $scope.services.filter(function (service) {
							return service.typeName === typeName;
						})[0];
						return '/src/core/services/' + service.icon;
					}
					return '';
				};
			}
		};
	});
});
