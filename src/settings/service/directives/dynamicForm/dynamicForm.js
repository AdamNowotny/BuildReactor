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
                if ($scope.service.fields && $scope.service.fields.length) {
                    $scope.service.fields
                        .filter((field) => field.help)
                        .forEach((field) => {
                            field.help = $sce.trustAsHtml(field.help);
                        });
                } else {
                    $scope.service.fields = createFieldsFromConfig($scope.config);
                }
            }
        });
    }
}));

const createFieldsFromConfig = (config) => {
    const fields = [];
    if (config.hasOwnProperty('url')) {
        fields.push({ type: 'url' });
    }
    if (config.hasOwnProperty('username')) {
        fields.push({ type: 'username' });
    }
    if (config.hasOwnProperty('password')) {
        fields.push({ type: 'password' });
    }
    if (config.hasOwnProperty('token')) {
        fields.push({ type: 'token' });
    }
    if (config.hasOwnProperty('branch')) {
        fields.push({ type: 'branch' });
    }
    return fields;
};
