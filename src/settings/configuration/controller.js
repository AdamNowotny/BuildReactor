define([
    'settings/app',
    'common/core',
    'angular',
    'settings/configuration/directives/jsonEditor/jsonEditor'
], function(app, core, angular) {
    'use strict';

    app.controller('ConfigurationCtrl', function($scope, $http) {

        $scope.includePasswords = false;

        core.configurations.subscribe(function(config) {
            $scope.$evalAsync(function() {
                $scope.config = config;
            });
        });

        $scope.$on('jsonEditor.changed', function(event, json) {
            $scope.saving = true;
            core.saveConfig(json);
        });

        $scope.showLocalConfig = function() {
            var displayConfig = angular.copy($scope.config);
            if (!$scope.includePasswords) {
                displayConfig.forEach(function(serviceConfig) {
                    delete serviceConfig.username;
                    delete serviceConfig.password;
                });
            }
            $scope.displayConfig = displayConfig;
        };

        $scope.showFromUrl = function(url) {
            $http({
              method: 'GET',
              url: url
            }).then(function successCallback(response) {
                $scope.displayConfig = response.data;
                $scope.urlError = null;
            }, function errorCallback(response) {
                response = response || {};
                $scope.urlError = response.statusText || 'Request failed. Status = ' + response.status;
            });
        };
    });
});
