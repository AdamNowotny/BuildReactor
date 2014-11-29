define([
	'common-ui/directives/service/service',
	'angular',
	'angularMocks',
	'common-ui/directives/service/service.html',
	'common-ui/directives/buildGroup/buildGroup.html',
	'common-ui/directives/build/build.html'
], function (service, angular) {
	'use strict';

	describe('service', function () {

		var scope;
		var element;

		beforeEach(module(
			'app.directives',
			'src/common-ui/directives/service/service.html',
			'src/common-ui/directives/buildGroup/buildGroup.html',
			'src/common-ui/directives/build/build.html'
		));

		beforeEach(inject(function ($compile, $rootScope) {
			element = $compile('<service service-info="service"></service>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should default to empty groups if no builds', inject(function($compile, $rootScope) {
			scope.service = {
				name: 'service name',
				items: []
			};

			scope.$digest();
			
			expect(scope.groups).toEqual([]);
		}));

		it('should group builds', inject(function($compile, $rootScope) {
			scope.service = {
				name: 'service name',
				items: [
					{ group: 'group1', name: 'build1' },
					{ group: 'group1', name: 'build2' },
					{ group: 'group2', name: 'build3' }
				]
			};
			scope.$digest();
			
			expect(angular.copy(scope.groups)).toEqual([{
				name: 'group1',
				items: [
					{ group: 'group1', name: 'build1' },
					{ group: 'group1', name: 'build2' },
				]
			}, {
				name: 'group2',
				items: [
					{ group: 'group2', name: 'build3' }
				]
			}]);
		}));

		it('should default to empty group if not specified', inject(function($compile, $rootScope) {
			scope.service = {
				name: 'service name',
				items: [
					{ name: 'build1' },
					{ group: null, name: 'build2' },
					{ group: '', name: 'build3' }
				]
			};
			scope.$digest();
			
			expect(angular.copy(scope.groups)).toEqual([{
				name: '',
				items: [
					{ group: '', name: 'build1' },
					{ group: '', name: 'build2' },
					{ group: '', name: 'build3' }
				]
			}]);
		}));

	});

});
