import 'common/directives/service/service';
import module from 'common/directives/module';
import templateUrl from 'common/directives/buildList/buildList.html';

module.directive('buildList', () => ({
    restrict: 'E',
    scope: {
        services: '=',
        viewConfig: '='
    },
    templateUrl
}));
