import 'angular-legacy-sortablejs-maintained';
import app from 'settings/app';
import core from 'common/core';
import template from 'settings/directives/sidebar/sidebar.html';

export default app.directive('sidebar', () => {
    return {
        scope: {
            services: '=',
            configs: '=',
            currentService: '=',
            currentConfig: '=',
            view: '='
        },
        templateUrl: template,
        controller($scope, $element, $attrs, $transclude) {

            $scope.sortableConfig = {
                onUpdate: (data) => core.setOrder(data.models.map((service) => service.name)),
                forceFallback: true
            };

            $scope.$watch('services', (services) => {
                $scope.serviceIcons = {};
                (services || []).forEach((service) => {
                    $scope.serviceIcons[service.baseUrl] = service.icon;
                });
            });
        }
    };
});
