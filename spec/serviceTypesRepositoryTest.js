define(['serviceTypesRepository', 'spec/mocks/buildService'], function (repository, MockBuildService) {

	'use strict';
	
	describe('serviceTypesRepository', function () {

		afterEach(function () {
			repository.clear();
		});

		it('should return empty array if no services registered', function () {
			var types = repository.getAll();

			expect(types.length).toBe(0);
		});

		it('should register service', function () {
			spyOn(MockBuildService, 'settings');

			repository.register(MockBuildService);

			expect(MockBuildService.settings).toHaveBeenCalled();
		});

		it('should return registered services settings', function () {
			repository.register(MockBuildService);
			var types = repository.getAll();

			expect(types.length).toBe(1);
			expect(types[0].typeName).toBe(MockBuildService.settings().typeName);
		});

		it('should clear registrations', function () {
			repository.register(MockBuildService);

			repository.clear();

			expect(repository.getAll().length).toBe(0);
		});

	});
});