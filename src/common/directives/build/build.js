import 'angular-ui-bootstrap/src/tooltip/index-nocss.js';
import module from 'common/directives/module';
import templateUrl from 'common/directives/build/build.html';

module.directive('build', ($interval) => ({
    restrict: 'E',
    scope: {
        build: '=buildInfo',
        viewConfig: '='
    },
    templateUrl,
    controller($scope, $element, $attrs, $transclude) {

        const commentChangeInterval = 7000;
        let intervalPromise;
        $scope.changeIndex = 0;

        const changesLength = $scope.build && $scope.build.changes ? $scope.build.changes.length : 0;
        if (changesLength > 1) {
            intervalPromise = $interval(() => {
                $scope.changeIndex = ($scope.changeIndex + 1) % changesLength;
            }, commentChangeInterval);
        }

        $scope.$on('$destroy', function() {
            if (intervalPromise) {
                $interval.cancel(intervalPromise);
            }
        });

        $scope.getLabelClasses = (tag) => {
            const tagType = tag.type || 'default';
            return `label-${tagType}`;
        };

        $scope.$watch('viewConfig', (config = {}) => {
            $scope.commitsVisible = true;
            if ($scope.build && !config.showCommitsWhenGreen) {
                $scope.commitsVisible = Boolean(
                    $scope.build.isBroken ||
                    $scope.build.isRunning ||
                    $scope.build.isWaiting);
            }
        });

    }
}));
