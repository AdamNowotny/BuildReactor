define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('focusIf', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$watch(attrs.focusIf, function (value) {
					if (value === true) {
						scope.$evalAsync(function () {
							element[0].focus();
						});
					}
				});
			}
		};
	});
});
