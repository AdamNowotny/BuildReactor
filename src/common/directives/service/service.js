import ngModule from 'common/directives/module';
import 'common/directives/buildGroup/buildGroup';
import templateUrl from 'common/directives/service/service.html';

define([
    'rx',
    'rx.binding',
    'rx.coincidence'
], function (Rx) {

    'use strict';

    ngModule.directive('service', function () {
        return {
            restrict: 'E',
            scope: {
                service: '=serviceInfo'
            },
            templateUrl: templateUrl,
            replace: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                $scope.$watch('service', function (service) {
                    var items = $scope.service ? $scope.service.items : [];
                    var groups = [];
                    Rx.Observable.fromArray(items).select(function (build) {
                        build.group = build.group || '';
                        return build;
                    }).groupBy(function (build) {
                        return build.group;
                    }).selectMany(function (groupBy) {
                        return groupBy
                            .toArray()
                            .select(function (items) {
                                return {
                                    name: groupBy.key,
                                    items: items
                                };
                            });
                    })
                    .toArray().subscribe(function (d) {
                        groups = d;
                    });
                    $scope.groups = groups;
                });
            }
        };
    });
});
