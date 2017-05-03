import 'common/directives/buildGroup/buildGroup';
import 'rx/dist/rx.coincidence';
import 'rx/dist/rx.binding';
import Rx from 'rx';
import ngModule from 'common/directives/module';
import templateUrl from 'common/directives/service/service.html';

ngModule.directive('service', () => ({
    restrict: 'E',
    scope: {
        service: '=serviceInfo',
        viewConfig: '='
    },
    templateUrl,
    replace: true,
    controller($scope, $element, $attrs, $transclude) {
        let rxSubscription;
        $scope.$watch('service', (service) => {
            const items = $scope.service ? $scope.service.items : [];
            let groups = [];
            if (rxSubscription) {
                rxSubscription.dispose();
            }
            rxSubscription = Rx.Observable.fromArray(items)
                .select((build) => {
                    build.group = build.group || '';
                    return build;
                })
                .groupBy((build) => build.group)
                .selectMany((groupBy) => groupBy
                    .toArray()
                    .select((groupedItems) => ({
                        name: groupBy.key,
                        items: groupedItems
                    }))
                )
                .toArray().subscribe((d) => {
                    groups = d;
                });
            $scope.groups = groups;
        });
    }
}));
