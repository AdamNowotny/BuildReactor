define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('onOffSwitch', function ($modal) {
		return {
			scope: {
				onOff: '=onOff'
			},
			templateUrl: 'src/settings/directives/onOffSwitch/onOffSwitch.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.$watch('onOff', function (onOff) {
					$scope.switch = onOff ? 'on' : 'off';
				});

				$scope.$watch('switch', function (onOffValue) {
					$scope.onOff = (onOffValue === 'on');
				});
			}
		};
	});
});
