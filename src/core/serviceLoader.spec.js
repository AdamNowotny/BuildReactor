define(['core/serviceLoader'], function (loader) {

	'use strict';
	
	describe('serviceLoader', function () {

		it('should create service', function () {
			var CustomBuildService = function () {};
			define('services/test/buildService', function () {
				return CustomBuildService;
			});
			var settings = {
				baseUrl: 'test'
			};
			var created = false;

			runs(function () {
				loader.load(settings).subscribe(function (service) {
					expect(service).toBeDefined();
					created = true;
				});
			});

			waitsFor(function () {
				return created;
			});
		});

	});
});