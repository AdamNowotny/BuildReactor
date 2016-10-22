import angular from 'angular';

define([
	'settings/directives/sidebar/sidebar',
	'common/core'
], function(sidebar, core) {
	'use strict';

	describe('settings/directives/sidebar/sidebar', function() {

		var scope;
		var element;

		beforeEach(angular.mock.module(
			'settings'
		));

		beforeEach(function() {
			spyOn(core, 'setOrder');
		});

		beforeEach(angular.mock.inject(function($compile, $rootScope) {
			element = $compile('<section sidebar services="services" configs="[]" new="false"></section>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should call setOrder when order changed', function() {
			var service1 = { name: 'name1' };
			var service2 = { name: 'name2' };
			core.configurations.onNext([{ name: 'name1' }, { name: 'name2' }]);

			var model = [service2, service1];
			scope.sortableCallback(model, model, 0, 1);
			
			expect(core.setOrder).toHaveBeenCalled();
		});

	});

});
