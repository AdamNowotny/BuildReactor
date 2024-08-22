import angular from 'angular';
import core from 'common/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'settings/add/controller';
import app from 'settings/app';
import 'settings/configuration/controller';
import 'settings/directives/sidebar/sidebar';
import 'settings/notifications/controller';
import 'settings/service/controller';
import 'settings/view/controller';
import Layout from './layout';

export default app.controller('SettingsCtrl', ($scope, $route) => {
    const app = document.getElementById('app');
    let root;
    if (app) {
        root = createRoot(app);
        root.render(<Layout service={$scope.config} />);
    }
    $scope.serviceId = null;
    $scope.serviceTypeId = null;

    const update = function () {
        if ($scope.view === 'service') {
            updateForExistingService();
        } else if ($scope.view === 'new') {
            updateForNewService();
        }
        root.render(<Layout service={$scope.config} />);
    };

    const updateForExistingService = function () {
        if ($scope.serviceTypes && $scope.serviceConfigs && $scope.serviceId) {
            $scope.config = find($scope.serviceConfigs, 'name', $scope.serviceId) || {};
            $scope.service = find($scope.serviceTypes, 'baseUrl', $scope.config.baseUrl);
        }
    };

    const updateForNewService = function () {
        if ($scope.serviceTypes && $scope.serviceId && $scope.serviceTypeId) {
            $scope.service = find($scope.serviceTypes, 'baseUrl', $scope.serviceTypeId);
            $scope.config = angular.copy($scope.service.defaultConfig);
            $scope.config.name = $scope.serviceId;
        } else {
            $scope.config = null;
            $scope.service = null;
        }
    };

    var find = function (list, field, value) {
        var item = list.filter(function (item) {
            return item[field] === value;
        })[0];
        return item ? item : null;
    };

    core.configurations.subscribe(function (configs) {
        $scope.$evalAsync(function () {
            $scope.serviceConfigs = configs;
            update();
        });
    });

    core.availableServices(function (types) {
        $scope.$evalAsync(function () {
            $scope.serviceTypes = types;
            update();
        });
    });

    $scope.$on('$routeChangeSuccess', function (event, routeData) {
        $scope.serviceId = routeData.params.serviceName || null;
        $scope.serviceTypeId = routeData.params.serviceTypeId || null;
        $scope.view = $route.current.view;
        update();
    });
});
