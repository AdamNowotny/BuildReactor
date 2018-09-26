import 'angular-legacy-sortablejs-maintained';
import app from 'settings/app';
import core from 'common/core';
import template from 'settings/service/directives/selectedProjects/selectedProjects.html';

export default app.directive('selectedProjects', () => ({
    scope: {
        projects: '=',
        serviceName: '@'
    },
    templateUrl: template,
    controller($scope, $element, $attrs, $transclude) {

        $scope.sortableConfig = {
            onUpdate: (data) => core.setBuildOrder($scope.serviceName, data.models),
            handle: '.handle',
            forceFallback: true
        };

    }
}));
