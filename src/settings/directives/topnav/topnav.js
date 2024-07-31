import 'angular-ui-bootstrap/src/dropdown/index-nocss';
import 'settings/directives/onOffSwitch/onOffSwitch';
import 'settings/directives/topnav/removeModalCtrl';
import 'settings/directives/topnav/renameModalCtrl';
import app from 'settings/app';
import core from 'common/core';
import removeTemplate from 'settings/directives/topnav/removeModal.html';
import renameTemplate from 'settings/directives/topnav/renameModal.html';
import template from 'settings/directives/topnav/topnav.html';

export default app.directive('topnav', ($uibModal, $location) => ({
    scope: {
        service: '=currentService',
        showActions: '=',
    },
    templateUrl: template,
    controller($scope, $element, $attrs, $transclude) {
        $scope.$watch('service', selectedService => {
            $scope.isEnabled = selectedService && !selectedService.isDisabled;
        });

        $scope.$on('onOffSwitch.change', (event, isEnabled) => {
            if (!$scope.service) {
                return;
            }
            if (isEnabled) {
                core.enableService($scope.service.name);
            } else {
                core.disableService($scope.service.name);
            }
        });

        $scope.remove = function () {
            $uibModal
                .open({
                    templateUrl: removeTemplate,
                    controller: 'RemoveModalCtrl',
                    scope: $scope,
                    resolve: {
                        serviceName: () => $scope.service.name,
                    },
                })
                .result.then(serviceName => {
                    core.removeService(serviceName);
                    $location.path('#!/new').replace();
                });
        };

        $scope.rename = function () {
            $uibModal
                .open({
                    templateUrl: renameTemplate,
                    controller: 'RenameModalCtrl',
                    resolve: {
                        serviceName: () => $scope.service.name,
                    },
                })
                .result.then(serviceName => {
                    core.renameService($scope.service.name, serviceName);
                    $location.path(`#!/service/${serviceName}/`).replace();
                });
        };
    },
}));
