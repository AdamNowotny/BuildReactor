define([
	'popupController',
	'jquery'
], function (controller, $) {

	'use strict';

	describe('popupController', function () {

		var state = [
			{
				name: 'service 1',
				items: [
					{
						id: 'id1',
						name: 'build name 1',
						group: 'build group 1'
					},
					{
						id: 'id2',
						name: 'build name 2',
						group: 'build group 2'
					}
				]
			},
			{
				name: 'service 2',
				items: []
			}
		];

		beforeEach(function () {
			jasmine.getFixtures().set('<div class="service-info-container">content</div>');
		});

		it('should show service names', function () {
			controller.show(state);

			expect($('.service-name').length).toBe(2);
			expect($('.service-name').eq(0)).toHaveText('service 1');
			expect($('.service-name').eq(1)).toHaveText('service 2');
		});

		it('should show build names', function () {
			controller.show(state);

			expect($('.service-item-name').length).toBe(2);
			expect($('.service-item-name').eq(0)).toHaveText('build name 1');
			expect($('.service-item-name').eq(1)).toHaveText('build name 2');
		});

		it('should show group names', function () {
			controller.show(state);

			expect($('.service-group').length).toBe(2);
			expect($('.service-group').eq(0)).toHaveText('build group 1');
			expect($('.service-group').eq(1)).toHaveText('build group 2');
		});
	});

});