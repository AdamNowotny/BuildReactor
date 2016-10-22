import angular from 'angular';

define([
	'settings/view/controller',
	'common/core'
], function(sidebar, core) {
	'use strict';

	describe('settings/view/controller', function() {

		var scope;
		var controller;

		beforeEach(function() {
			spyOn(core, 'setViews');
		});

		beforeEach(angular.mock.module('settings'));

		beforeEach(angular.mock.inject(function($controller, $compile, $rootScope) {
			scope = $rootScope.$new();
			controller = $controller('ViewSettingsCtrl', { $scope: scope });
		}));

		it('should set viewConfig on scope', function() {
			var viewConfig = { columns: 4 };

			core.views.onNext(viewConfig);
			scope.$digest();

			expect(scope.viewConfig).toEqual(viewConfig);
		});

		it('should save view viewConfig', function() {
			var viewConfig = { columns: 4 };

			scope.save(viewConfig);

			expect(core.setViews).toHaveBeenCalledWith(viewConfig);
		});

		it('should set minimun number of columns to 0', function() {
			var viewConfig = { columns: -1 };

			scope.save(viewConfig);

			expect(core.setViews).toHaveBeenCalledWith({ columns: 0 });
		});

		it('should set maximum number of columns to 20', function() {
			var viewConfig = { columns: 21 };

			scope.save(viewConfig);

			expect(core.setViews).toHaveBeenCalledWith({ columns: 20 });
		});

		it('should save when field set', function() {
			scope.viewConfig = { fullWidthGroups: true };

			scope.setField('fullWidthGroups', false);

			expect(core.setViews).toHaveBeenCalledWith({ fullWidthGroups: false });
		});

		it('should not save when field did not change', function() {
			scope.viewConfig = { columns: 4, fullWidthGroups: true };

			scope.setField('fullWidthGroups', true);

			expect(core.setViews).not.toHaveBeenCalled();
		});

		it('should set services on scope', function() {
			var projects = [{ name: '' }];

			core.activeProjects.onNext(projects);
			scope.$digest();

			expect(scope.activeProjects).toEqual(projects);
		});

	});

});
