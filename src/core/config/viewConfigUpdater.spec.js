define([
	'core/config/viewConfigUpdater'
], function (updater) {
	'use strict';

	describe('core/config/viewConfigUpdater', function () {

		it('should add default view configuration', function () {
			var config = updater.update(undefined);

			expect(config).toEqual({ columns: 2, fullWidthGroups: true });
		});

		it('should not override existing view configuration', function () {

			var config = updater.update({ columns: 4 });

			expect(config).toEqual({ columns: 4, fullWidthGroups: true });
		});
	});

});