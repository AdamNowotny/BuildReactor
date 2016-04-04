import 'html5sortable/src/html.sortable.angular';
import template from 'settings/directives/sidebar/sidebar.html';

define([
	'settings/app',
	'common/core'
], function(app, core) {
	'use strict';

	app.directive('sidebar', function() {
		return {
			scope: {
				services: '=',
				configs: '=',
				currentService: '=',
				currentConfig: '=',
				view: '='
			},
			templateUrl: template,
			controller: function($scope, $element, $attrs, $transclude) {
				$scope.sortableCallback = function(startModel, destModel, start, end) {
					var items = destModel.map(function(service) {
						return service.name;
					});
					core.setOrder(items);
				};

				$scope.$watch('services', function(services) {
					$scope.serviceIcons = {};
					(services || []).forEach(function(service) {
						$scope.serviceIcons[service.baseUrl] = service.icon;
					});
				});
			}
		};
	});
});
