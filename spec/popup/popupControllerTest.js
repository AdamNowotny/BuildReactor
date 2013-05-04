define([
	'popup/popupController',
	'popup/messages',
	'jquery'
], function (controller, messages, $) {

	'use strict';

	describe('popupController', function () {

		var state = [
			{
				name: 'service 1',
				items: [
					{
						name: 'build name 1',
						group: 'build group 1',
						isBroken: false,
						webUrl: 'http://example1.com/',
						isRunning: true
					},
					{
						name: 'build name 2',
						group: 'build group 2',
						isBroken: true,
						webUrl: 'http://example2.com/',
						isRunning: false
					},
					{
						name: 'build with no group',
						group: '',
						isBroken: false,
						webUrl: 'http://example3.com/',
						isRunning: false
					},
					{
						name: 'build name 4',
						group: 'build group 2',
						webUrl: '',
						isRunning: true
					},
					{
						name: 'disabled build',
						group: 'other group',
						isBroken: false,
						isDisabled: true,
						webUrl: 'http://example3.com/',
						isRunning: false
					},
				]
			},
			{
				name: 'service 2',
				items: []
			}
		];
		var subscription;

		beforeEach(function () {
			jasmine.getFixtures().set('<div class="service-info-container">content</div>');
			subscription = controller();
		});

		afterEach(function () {
			subscription.dispose();
		});

		it('should show message if no services configured', function () {
			messages.activeProjects.onNext([]);

			expect($('.no-services-message')).toHaveText('No services configured');
			expect($('.no-services-message')).toBeVisible();
		});

		it('should not show message if at least 1 service configured', function () {
			messages.activeProjects.onNext(state);

			expect($('.no-services-message')).not.toBeVisible();
		});

		it('should show service names', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-name').length).toBeGreaterThan(1);
			expect($('.service-name').eq(0)).toHaveText('service 1');
			expect($('.service-name').eq(1)).toHaveText('service 2');
		});

		it('should show build names', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item-name').length).toBeGreaterThan(1);
			expect($('.service-item-name').text().length).not.toBe(0);
		});

		it('should show group names', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-group').length).toBeGreaterThan(1);
			expect($('.service-group').eq(0)).toHaveText('build group 1');
			expect($('.service-group').eq(1)).toHaveText('build group 2');
		});

		it('should not show group name if none', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item').eq(0)).toHaveText('build with no group');
		});

		it('should sort by group name', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item-name').eq(0)).toHaveText('build with no group');
			expect($('.service-item-name').eq(1)).toHaveText('build name 1');
			expect($('.service-item-name').eq(2)).toHaveText('build name 2');
			expect($('.service-item-name').eq(3)).toHaveText('build name 4');
			expect($('.service-item-name').eq(4)).toHaveText('disabled build');
		});

		it('should indicate broken build', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item.broken').length).toBe(1);
			expect($('.failed-count')).toHaveText('1 broken');
		});

		it('should indicate disabled build', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item.disabled').length).toBe(1);
			expect($('.service-item.disabled .label')).toBeVisible();
		});

		it('should not show failed count for disabled builds', function () {
			var state = [{
				name: 'service 1',
				items: [{
						name: 'build name 1',
						isBroken: true,
						isDisabled: true
					}]
				}];
			messages.activeProjects.onNext(state);

			expect($('.service-item.broken').length).toBe(1);
			expect($('.failed-count')).not.toBeVisible();
		});

		it('should show if building', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item.building').length).toBe(2);
		});

		it('should add link for each build', function () {
			messages.activeProjects.onNext(state);

			expect($('.service-item a').length).toBe(5);
			expect($('.service-item a').eq(0).attr('href')).toBe('http://example3.com/');
			expect($('.service-item a').attr('href')).toBeDefined();
		});
	});

});