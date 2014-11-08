define([
	'settings/directives/sidebar/sidebar',
	'common/core',
	'angular',
	'angularMocks',
	'settings/directives/sidebar/sidebar.html'
], function (sidebar, core, angular, mocks) {
	'use strict';

	describe('sidebar', function () {

		var scope;
		var element;

		beforeEach(function () {
			spyOn(core, 'setOrder');
		});

		beforeEach(module('settings', 'src/settings/directives/sidebar/sidebar.html'));

		beforeEach(inject(function ($compile, $rootScope) {
			element = $compile('<section sidebar services="services" selected="selected" new="false"></section>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should call setOrder when order changed', inject(function($compile, $rootScope) {
			var service1 = { name: 'name1'};
			var service2 = { name: 'name2'};
			scope.services = [{ name: 'name1'}, { name: 'name2' }];

			var model = [service2, service1];
			scope.sortableCallback(model, model, 0, 1);
			
			expect(core.setOrder).toHaveBeenCalled();
		}));

	});

});
