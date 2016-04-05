import 'html5sortable/src/html.sortable.angular';
import app from 'settings/app';
import core from 'common/core';
import template from 'settings/directives/sidebar/sidebar.html';

export default app.directive('sidebar', function() {
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
