import 'common/directives/buildGroup/buildGroup';
import 'rx/dist/rx.coincidence';
import 'rx/dist/rx.binding';
import Rx from 'rx';
import ngModule from 'common/directives/module';
import templateUrl from 'common/directives/service/service.html';

ngModule.directive('service', function() {
    return {
        restrict: 'E',
        scope: {
            service: '=serviceInfo'
        },
        templateUrl,
        replace: true,
        controller($scope, $element, $attrs, $transclude) {
            $scope.$watch('service', function(service) {
                const items = $scope.service ? $scope.service.items : [];
                let groups = [];
                Rx.Observable.fromArray(items).select(function(build) {
                        build.group = build.group || '';
                        return build;
                    }).groupBy(function(build) {
                        return build.group;
                    }).selectMany(function(groupBy) {
                        return groupBy
                            .toArray()
                            .select(function(items) {
                                return {
                                    name: groupBy.key,
                                    items: items
                                };
                            });
                    })
                    .toArray().subscribe(function(d) {
                        groups = d;
                    });
                $scope.groups = groups;
            });
        }
    };
});
