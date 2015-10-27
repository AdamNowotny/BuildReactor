define([
	'settings/app',
	'angular'
], function (app) {
	'use strict';

	app.directive('jsonEditor', function () {
		return {
			scope: {
				json: '='
			},
			templateUrl: 'src/settings/configuration/directives/jsonEditor/jsonEditor.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.$watch('json', function (json) {
					$scope.content = JSON.stringify(json, null, 2);
				});

				$scope.$watch('content', function (content) {
					try {
						var obj = JSON.parse(content);
						if (obj && typeof obj === "object" && obj !== null) {
							$scope.saveEnabled = true;
							$scope.error = null;
				            return;
				        }
						$scope.saveEnabled = false;
						$scope.error = 'JSON validation error';
					} catch (ex) {
						$scope.saveEnabled = false;
						$scope.error = (ex || {}).message;
					}
				});

				$scope.save = function() {
					$scope.$emit('jsonEditor.changed', JSON.parse($scope.content));
				};
				
			}
		};
	});
});
