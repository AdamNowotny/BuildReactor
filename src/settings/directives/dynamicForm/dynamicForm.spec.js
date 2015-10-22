define([
	'settings/directives/dynamicForm/dynamicForm',
	'settings/directives/dynamicForm/dynamicForm.html'
], function (sidebar) {
	'use strict';

	describe('dynamicForm', function () {

		var scope;
		var element;

		beforeEach(module('settings', 'src/settings/directives/dynamicForm/dynamicForm.html'));

		beforeEach(inject(function ($compile, $rootScope) {
			element = $compile('<section dynamic-form service="service" config="config"></section>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should emit dynamicForm.changed on config change', function() {
			scope.config = {
				url: ''
			};
			var events = [];
			scope.$on('dynamicForm.changed', function (event, config) {
				events.push(config);
			});

			scope.$digest();

			expect(events.length).toBe(1);
			expect(events[0]).toEqual(scope.config);
		});

	});

});
