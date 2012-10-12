define(['common/resourceFinder', 'spec/mocks/mockSettingsBuilder'], function (finder, MockSettingsBuilder) {

	'use strict';
	
	describe('resourceFinder', function () {

		it('should return build service location', function () {
			var settings = new MockSettingsBuilder().withBaseUrl('service1').create();

			expect(finder.service(settings)).toBe('services/service1/buildService');
		});

		it('should return icon location', function () {
			expect(finder.icon('service1/icon.png')).toBe('src/services/service1/icon.png');
		});

		it('should return logo location', function () {
			expect(finder.logo('service1/logo.png')).toBe('src/services/service1/logo.png');
		});

	});

});