import app from 'settings/app';
import template from 'settings/directives/alert/alert.html';

export default app.directive('brAlert', function($timeout) {
	return {
		scope: {
			visible: '=show'
		},
		templateUrl: template,
		controller: function($scope, $element, $attrs, $transclude) {
			$scope.$watch('visible', function(value) {
				if (value === true) {
					$timeout(function() {
						$scope.visible = false;
					}, 3000);
				}
			});
		}
	};
});
