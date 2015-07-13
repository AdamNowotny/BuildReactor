define([
	'settings/viewSettings/controller',
	'common-ui/core',
	'angularMocks'
], function (sidebar, core) {
	'use strict';

	describe('settings/viewSettings/controller', function () {

		var scope;
		var controller;

		beforeEach(function () {
			spyOn(core, 'setViews');
		});

		beforeEach(module('settings'));

		beforeEach(inject(function ($controller, $compile, $rootScope) {
			scope = $rootScope.$new();
			controller = $controller('ViewSettingsCtrl', { $scope: scope });
		}));

		it('should set config on scope', function() {
			var viewConfig = { columns: 4 };
			
			core.views.onNext(viewConfig);
			scope.$digest();
			
			expect(scope.config).toEqual(viewConfig);
		});

		it('should save view config', function() {
			var viewConfig = { columns: 4 };
			
			scope.save(viewConfig);

			expect(core.setViews).toHaveBeenCalledWith(viewConfig);
		});

		it('should set minumun number of columns to 0', function() {
			var viewConfig = { columns: -1 };
			
			scope.save(viewConfig);

			expect(core.setViews).toHaveBeenCalledWith({ columns: 0 });
		});

		it('should set maximum number of columns to 20', function() {
			var viewConfig = { columns: 21 };
			
			scope.save(viewConfig);

			expect(core.setViews).toHaveBeenCalledWith({ columns: 20 });
		});

		it('should save when column width set', function() {
			scope.config = { fullWidthGroups: true };

			scope.setFixedWidth(true);

			expect(core.setViews).toHaveBeenCalledWith({ fullWidthGroups: false });
		});

		it('should not save when column width already set', function() {
			scope.config = { columns: 4, fullWidthGroups: true };
			
			scope.setFixedWidth(false);

			expect(core.setViews).not.toHaveBeenCalled();
		});

		it('should set services on scope', function() {
			var projects = [{ name: '' }];
			
			core.activeProjects.onNext(projects);
			scope.$digest();
			
			expect(scope.services).toEqual(projects);
		});

		describe('singleGroupRows', function () {

			it('should save when singleGroupRows set', function() {
				scope.config = { singleGroupRows: true };

				scope.setSingleGroupRows(false);

				expect(core.setViews).toHaveBeenCalledWith({ singleGroupRows: false });
			});

			it('should not save when already set', function() {
				scope.config = { singleGroupRows: false };
				
				scope.setSingleGroupRows(false);

				expect(core.setViews).not.toHaveBeenCalled();
			});

		});

		describe('showCommits', function () {

			it('should save when showCommits set', function() {
				scope.config = { showCommits: true };

				scope.setShowCommits(false);

				expect(core.setViews).toHaveBeenCalledWith({ showCommits: false });
			});

			it('should not save when already set', function() {
				scope.config = { showCommits: false };
				
				scope.setShowCommits(false);

				expect(core.setViews).not.toHaveBeenCalled();
			});

		});

		describe('theme', function () {

			it('should save when theme set', function() {
				scope.config = { theme: 'dark' };

				scope.setTheme('light');

				expect(core.setViews).toHaveBeenCalledWith({ theme: 'light' });
			});

			it('should not save when already set', function() {
				scope.config = { theme: 'dark' };

				scope.setTheme('dark');

				expect(core.setViews).not.toHaveBeenCalled();
			});

		});

	});

});
