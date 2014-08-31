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

				$scope.changeService = function (serviceName) {
					$location.path('/service/' + serviceName);
				};

				$scope.sortableCallback = function (startModel, destModel, start, end) {
					var items = destModel.map(function (service) {
						return service.name;
					});
					core.setOrder(items);
				};

			}
		};
	});
});
