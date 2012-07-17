define(['serviceTypesRepository'], function (repository) {

	describe('serviceTypesRepository', function () {

		it('should get all types as array', function () {
			var types = repository.getAll();

			expect(types.length).toBe(2);
		});

		it('should create settings for service type', function () {
			var settings = repository.createSettingsFor('CCTray Generic');

			expect(settings.typeName).toBe('CCTray Generic');
			expect(settings.baseUrl).toBe('cctray');
		});

	});
});