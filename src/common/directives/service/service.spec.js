import 'angular-mocks';
import angular from 'angular';

define([
	'common/directives/service/service'
], function(service) {
	'use strict';

	describe('service', function() {

		var scope;
		var element;

		beforeEach(angular.mock.module(
			'app.directives'
		));

		beforeEach(angular.mock.inject(function($compile, $rootScope) {
			element = $compile('<service service-info="service"></service>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should default to empty groups if no builds', angular.mock.inject(function($compile, $rootScope) {
			scope.service = {
				name: 'service name',
				items: []
			};

			scope.$digest();
			
			expect(scope.groups).toEqual([]);
		}));

		it('should group builds', angular.mock.inject(function($compile, $rootScope) {
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
					{ group: 'group1', name: 'build2' }
				]
			}, {
				name: 'group2',
				items: [
					{ group: 'group2', name: 'build3' }
				]
			}]);
		}));

		it('should default to empty group if not specified', angular.mock.inject(function($compile, $rootScope) {
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
