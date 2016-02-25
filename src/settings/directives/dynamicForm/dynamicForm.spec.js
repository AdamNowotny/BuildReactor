import angular from 'angular';

define([
	'settings/directives/dynamicForm/dynamicForm',
	'settings/directives/dynamicForm/dynamicForm.html'
], function(sidebar) {
	'use strict';

	describe('dynamicForm', function() {

		var scope;
		var element;

		beforeEach(angular.mock.module('settings', 'src/settings/directives/dynamicForm/dynamicForm.html'));

		beforeEach(angular.mock.inject(function($compile, $rootScope) {
			element = $compile('<section dynamic-form service="service" config="config"></section>')($rootScope);
			$rootScope.$digest();
			scope = element.isolateScope();
		}));

		it('should add missing fields to config', function() {
			scope.service = {
				defaultConfig: {
					url: '',
					username: 'guest'
				}
			};
			scope.config = {
				url: 'http://localhost/'
			};

			scope.$digest();

			expect(scope.config.url).toBe('http://localhost/');
			expect(scope.config.username).toBe('guest');
		});

		it('should emit dynamicForm.changed on config change', function() {
			scope.config = {
				url: ''
			};
			var events = [];
			scope.$on('dynamicForm.changed', function(event, config) {
				events.push(config);
			});

			scope.$digest();

			expect(events.length).toBe(1);
			expect(events[0]).toEqual(scope.config);
		});

	});

});
