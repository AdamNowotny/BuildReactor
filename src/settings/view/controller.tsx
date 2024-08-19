import angular from 'angular';
import app from 'settings/app';
import core from 'common/core';
import DashboardTheme from 'dashboard/components/dashboardTheme/dashboardTheme';
import { createRoot } from 'react-dom/client';
import React from 'react';

export default app.controller('ViewSettingsCtrl', function ($scope) {
    const settingsDashboard = document.getElementById('settings-dashboard');
    if (settingsDashboard) {
        createRoot(settingsDashboard).render(<DashboardTheme popup={false} />);
    }

    core.views.subscribe(function (config) {
        $scope.$evalAsync(function () {
            $scope.viewConfig = config;
        });
    });

    $scope.save = function (config) {
        if (config.columns < 0) {
            config.columns = 0;
        }
        if (config.columns > 20) {
            config.columns = 20;
        }
        core.setViews(angular.copy(config));
    };

    $scope.setField = function (name, value) {
        const changed = $scope.viewConfig[name] !== value;
        if (changed) {
            $scope.viewConfig[name] = value;
            core.setViews(angular.copy($scope.viewConfig));
        }
    };

    $scope.setTheme = function (theme) {
        const changed = $scope.viewConfig.theme !== theme;
        if (changed) {
            $scope.viewConfig.theme = theme;
            core.setViews(angular.copy($scope.viewConfig));
        }
    };
});
