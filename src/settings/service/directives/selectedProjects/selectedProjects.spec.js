import angular from 'angular';

define([
	'settings/service/directives/selectedProjects/selectedProjects',
	'common/core'
], function(sidebar, core) {
	'use strict';

	describe('selectedProjects', function() {

		var scope;
		var element;

		beforeEach(angular.mock.module(
			'settings'
		));

		beforeEach(function() {
			spyOn(core, 'setBuildOrder');
		});

		beforeEach(angular.mock.inject(function($compile, $rootScope) {
			element = $compile('<section selected-projects projects="projects" service-name="service name"></section>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should call setBuildOrder when order changed', function() {
			scope.projects = ['name1', 'name2'];

			scope.sortableCallback(['name2', 'name1'], ['name2', 'name1'], 0, 1);

			expect(core.setBuildOrder).toHaveBeenCalledWith('service name', ['name2', 'name1']);
		});

	});

});
