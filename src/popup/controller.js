import app from 'popup/app';
import core from 'common/core';

export default app.controller('PopupCtrl', ($scope) => {
    $scope.navbarStyle = 'navbar-inverse';
    core.views.subscribe((config) => {
        $scope.$evalAsync(() => {
            $scope.viewConfig = config;
            $scope.navbarStyle = (config.theme === 'light') ? 'navbar-default' : 'navbar-inverse';
        });
    });

    core.activeProjects.subscribe((services) => {
        $scope.$evalAsync(() => {
            $scope.services = services;
        });
    });

});
