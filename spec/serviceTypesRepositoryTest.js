define(['src/serviceTypesRepository'], function (repository) {

	describe('serviceTypesRepository', function () {

		it('should get all types as array', function () {
			var types = repository.getAll();

			expect(types.length).toBe(2);
		});

		it('should create settings for service type', function () {
			var settings = repository.createSettingsFor('CruiseControl');

			expect(settings.typeName).toBe('CruiseControl');
			expect(settings.icon).toBe('icon.png');
			expect(settings.baseUrl).toBe('src/cruisecontrol');
			expect(settings.service).toBe('ccBuildService');
			expect(settings.settingsController).toBe('ccSettingsController');
			expect(settings.settingsPage).toBe('ccOptions.html');
		});

	});
});