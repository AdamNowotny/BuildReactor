import app from 'settings/app';
import template from 'settings/add/directives/thumbnails/thumbnails.html';

export default app.directive('thumbnails', function() {
	return {
		scope: {
			serviceTypes: '=',
			selected: '='
		},
		templateUrl: template,
		controller($scope, $element, $attrs, $transclude) {
			$scope.select = function(serviceTypeId) {
				$scope.selected = serviceTypeId;
				$scope.$emit('thumbnails.selected', serviceTypeId);
			};
		}
	};
});
