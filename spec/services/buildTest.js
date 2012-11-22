define([
	'services/build'
], function (Build) {
	'use strict';

	describe('services/build', function () {

		it('should have id', function () {
			var build = new Build('build_id');

			expect(build.id).toBe('build_id');
		});

		it('should require id', function () {
			expect(function () {
				var build = new Build();
			}).toThrow();
		});

		it('should set default properties', function () {
			var build = new Build('id');

			expect(build.name).toBe(null);
			expect(build.projectName).toBe(null);
			expect(build.webUrl).toBe(null);
			expect(build.isRunning).toBe(false);
			expect(build.isBroken).toBe(false);
		});
	});
});