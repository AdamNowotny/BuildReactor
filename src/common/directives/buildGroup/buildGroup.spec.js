import 'common/directives/buildGroup/buildGroup';
import angular from 'angular';

describe('buildGroup', () => {

    let scope;

    beforeEach(angular.mock.module(
        'app.directives'
    ));

    beforeEach(angular.mock.inject(($compile, $rootScope) => {
        const element = $compile('<build-group name="group.name" items="items"></build-group>')($rootScope);
        $rootScope.$digest();
        scope = element.isolateScope();
    }));

    beforeEach(() => {
        scope.items = [{
            name: 'service1',
            items: []
        }, {
            name: 'service2',
            items: []
        }, {
            name: 'service3',
            items: []
        }];
    });

    describe('itemWidth', () => {

        it('should default to 100% width without config', () => {
            expect(scope.itemWidth).toEqual('100%');
        });

        it('should calculate width for fixed columns', () => {
            scope.viewConfig = {
                columns: 4
            };
            scope.$digest();

            expect(scope.itemWidth).toEqual('33.333333333333336%');
        });

        it('should calculate width for fixed columns with many builds', () => {
            scope.viewConfig = {
                columns: 2,
                fullWidthGroups: false
            };
            scope.$digest();

            expect(scope.itemWidth).toEqual('50%');
        });

        it('should calculate width for full-width', () => {
            scope.viewConfig = {
                columns: 4,
                fullWidthGroups: true
            };
            scope.$digest();

            expect(scope.itemWidth).toEqual('33.333333333333336%');
        });

        it('should calculate width for full-width with many builds', () => {
            scope.viewConfig = {
                columns: 2,
                fullWidthGroups: true
            };
            scope.$digest();

            expect(scope.itemWidth).toEqual('50%');
        });

    });

    describe('fullWidth', () => {

        it('should default to full page width', () => {
            expect(scope.fullWidth).toEqual('100%');
        });

        it('should calculate width if builds take less than 100%', () => {
            scope.viewConfig = {
                columns: 6,
                fullWidthGroups: false
            };
            scope.$digest();

            expect(scope.fullWidth).toEqual('50%');
        });

        it('should assume full width if more builds than columns', () => {
            scope.viewConfig = {
                columns: 2,
                fullWidthGroups: false
            };
            scope.$digest();

            expect(scope.fullWidth).toEqual('100%');
        });

    });

});
