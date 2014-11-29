define([
	'common-ui/directives/buildGroup/buildGroup',
	'common-ui/core',
	'angularMocks',
	'common-ui/directives/buildGroup/buildGroup.html',
	'common-ui/directives/build/build.html'
], function (buildGroup, core) {
	'use strict';

	describe('buildGroup', function () {

		var scope;
		var element;
		var views;
		var viewConfig;

		beforeEach(module(
			'app.directives',
			'src/common-ui/directives/buildGroup/buildGroup.html',
			'src/common-ui/directives/build/build.html'
		));

		beforeEach(inject(function ($compile, $rootScope) {
			element = $compile('<build-group name="group.name" items="items"></build-group>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		beforeEach(function () {
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

		it('should default to 100% width without config', function() {

			expect(scope.getItemWidth(scope.items[0])).toEqual('100%');
			expect(scope.getItemWidth(scope.items[1])).toEqual('100%');
			expect(scope.getItemWidth(scope.items[2])).toEqual('100%');
		});

		it('should calculate width for fixed columns', function() {
			core.views.onNext({ columns: 4 });
			scope.$digest();
			
			expect(scope.getItemWidth(scope.items[0])).toEqual('25%');
			expect(scope.getItemWidth(scope.items[1])).toEqual('25%');
			expect(scope.getItemWidth(scope.items[2])).toEqual('25%');
		});

		it('should calculate width for full-width', function() {
			core.views.onNext({ columns: 4, fullWidthGroups: true });
			scope.$digest();
			
			expect(scope.getItemWidth(scope.items[0])).toEqual('33.333333333333336%');
			expect(scope.getItemWidth(scope.items[1])).toEqual('33.333333333333336%');
			expect(scope.getItemWidth(scope.items[2])).toEqual('33.333333333333336%');
		});

		it('should calculate width for full-width with many builds', function() {
			core.views.onNext({ columns: 2, fullWidthGroups: true });
			scope.$digest();
			
			expect(scope.getItemWidth(scope.items[0])).toEqual('50%');
			expect(scope.getItemWidth(scope.items[1])).toEqual('50%');
			expect(scope.getItemWidth(scope.items[0])).toEqual('50%');
		});

	});

});
