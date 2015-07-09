define([
	'core/config/viewConfigUpdater'
], function (updater) {
	'use strict';

	describe('core/config/viewConfigUpdater', function () {

		it('should add default view configuration', function () {
			var config = updater.update(undefined);

			expect(config).toEqual({
				columns: 2,
				fullWidthGroups: true,
				singleGroupRows: false,
				showCommits: true,
				theme: 'dark'
			});
		});

		it('should not override existing view configuration', function () {
			var config = updater.update({ columns: 4 });

			expect(config.columns).toBe(4);
		});

		it('should add default singleGroupRows', function () {
			var config = updater.update({ columns: 4});

			expect(config.singleGroupRows).toBe(false);
		});

		it('should add default showCommits', function () {
			var config = updater.update({ columns: 4 });

			expect(config.showCommits).toBe(true);
		});

		it('should add default theme', function () {
			var config = updater.update({ columns: 4 });

			expect(config.theme).toBe('dark');
		});
	});

});