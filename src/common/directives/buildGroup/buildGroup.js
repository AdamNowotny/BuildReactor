import 'common/directives/build/build';
import module from 'common/directives/module';
import templateUrl from 'common/directives/buildGroup/buildGroup.html';

module.directive('buildGroup', () => ({
    restrict: 'E',
    scope: {
        name: '=',
        items: '=',
        viewConfig: '='
    },
    templateUrl,
    controller($scope, $element, $attrs, $transclude) {

        $scope.fullWidth = '100%';
        $scope.itemWidth = '100%';

        $scope.$watch('viewConfig', (config) => recalculateWidths(config, $scope.items));

        $scope.$watch('items', (items) => recalculateWidths($scope.viewConfig, items));

        const recalculateWidths = (config, items) => {
            if (config && items) {
                $scope.fullWidth = calculateFullWidth(config, $scope.items);
                $scope.itemWidth = calculateWidth(config, $scope.items);
            }
        };

        const calculateWidth = function(config, items) {
            const width = 100 / Math.min(items.length, config.columns);
            return `${width}%`;
        };

        const calculateFullWidth = function(config, items) {
            if (config.fullWidthGroups) {
                return '100%';
            }
            const columnWidth = 100 / config.columns;
            const allColumnsWidth = columnWidth * Math.min(items.length, config.columns);
            return `${allColumnsWidth}%`;
        };

    }
}));
