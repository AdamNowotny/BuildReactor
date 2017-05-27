import angular from 'angular';
import app from 'settings/app';
import template from 'settings/service/directives/dynamicForm/dynamicForm.html';

export default app.directive('dynamicForm', ($sce) => ({
    scope: {
        service: '=',
        config: '='
    },
    templateUrl: template,
    controller($scope, $element, $attrs, $transclude) {
        $scope.isDefined = angular.isDefined;

        $scope.$watchCollection('config', (config) => {
            $scope.$emit('dynamicForm.changed', angular.copy(config));
        });

        $scope.$watch('service', (service) => {
            if (service) {
                $scope.config = Object.assign(service.defaultConfig, $scope.config);
                ($scope.service.fields || [])
                    .filter((field) => field.help)
                    .forEach((field) => {
                        field.help = $sce.trustAsHtml(field.help);
                    });
            }
        });
    }
}));
