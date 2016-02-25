import templateUrl from 'settings/configuration/directives/jsonEditor/jsonEditor.html';

define([
    'settings/app',
    'angular'
], function(app) {
    'use strict';

    app.directive('jsonEditor', function() {
        return {
            scope: {
                json: '='
            },
            templateUrl: templateUrl,
            controller: function($scope, $element, $attrs, $transclude) {

                $scope.$watch('json', function(json) {
                    $scope.content = JSON.stringify(json, null, 2) || "";
                });

                $scope.$watch('content', function(content) {
                    try {
                        var obj = JSON.parse(content);
                        if (obj && typeof obj === "object" && obj.length > -1) {
                            showError(null);
                        } else {
                            showError('Configuration validation error');
                        }
                    } catch (ex) {
                        showError(ex.message || 'JSON Validation error');
                    }
                });

                var showError = function(message) {
                    $scope.saveEnabled = !message;
                    $scope.error = message;
                };

                $scope.save = function() {
                    $scope.$emit('jsonEditor.changed', JSON.parse($scope.content));
                };
                
            }
        };
    });
});
