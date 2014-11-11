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

				$scope.userSwitch = function (oldValue) {
					var newValue = (oldValue === 'off');
					$scope.$emit('onOffSwitch.change', newValue);
				};
			}
		};
	});
});
