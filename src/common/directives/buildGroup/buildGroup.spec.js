import angular from 'angular';

define([
	'common/directives/buildGroup/buildGroup',
	'common/core'
], function(buildGroup, core) {
	'use strict';

	describe('buildGroup', function() {

		var scope;
		var element;

		beforeEach(angular.mock.module(
			'app.directives'
		));

		beforeEach(angular.mock.inject(function($compile, $rootScope) {
			element = $compile('<build-group name="group.name" items="items"></build-group>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		beforeEach(function() {
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

		describe('itemWidth', function() {

			it('should default to 100% width without config', function() {
				expect(scope.itemWidth).toEqual('100%');
			});

			it('should calculate width for fixed columns', function() {
				core.views.onNext({ columns: 4 });
				scope.$digest();
				
				expect(scope.itemWidth).toEqual('33.333333333333336%');
			});

			it('should calculate width for fixed columns with many builds', function() {
				core.views.onNext({ columns: 2, fullWidthGroups: false });
				scope.$digest();
				
				expect(scope.itemWidth).toEqual('50%');
			});

			it('should calculate width for full-width', function() {
				core.views.onNext({ columns: 4, fullWidthGroups: true });
				scope.$digest();
				
				expect(scope.itemWidth).toEqual('33.333333333333336%');
			});

			it('should calculate width for full-width with many builds', function() {
				core.views.onNext({ columns: 2, fullWidthGroups: true });
				scope.$digest();
				
				expect(scope.itemWidth).toEqual('50%');
			});

		});

		describe('fullWidth', function() {

			it('should default to full page width', function() {
				expect(scope.fullWidth).toEqual('100%');
			});

			it('should calculate width if builds take less than 100%', function() {
				core.views.onNext({ columns: 6, fullWidthGroups: false });
				scope.$digest();
				
				expect(scope.fullWidth).toEqual('50%');
			});

			it('should assume full width if more builds than columns', function() {
				core.views.onNext({ columns: 2, fullWidthGroups: false });
				scope.$digest();
				
				expect(scope.fullWidth).toEqual('100%');
			});

			it('should use new row if more builds then columns', function() {
				core.views.onNext({ columns: 2, fullWidthGroups: true });
				scope.$digest();
				
				expect(scope.fullWidth).toEqual('100%');
				expect(scope.isNewRow).toEqual(true);
			});

		});

	});

});
