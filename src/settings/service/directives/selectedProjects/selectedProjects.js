import 'html5sortable/src/html.sortable.angular';
import app from 'settings/app';
import core from 'common/core';
import template from 'settings/service/directives/selectedProjects/selectedProjects.html';

export default app.directive('selectedProjects', function() {
	return {
		scope: {
			projects: '=',
			serviceName: '@'
		},
		templateUrl: template,
		controller: function($scope, $element, $attrs, $transclude) {

			$scope.sortableCallback = function(startModel, destModel, start, end) {
				core.setBuildOrder($scope.serviceName, destModel);
			};
		}
	};
});
