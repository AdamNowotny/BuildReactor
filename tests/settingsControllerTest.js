define([
        'jquery',
        'src/settingsController',
        'mocks/MockSettingsBuilder',
        'mocks/MockSettingsController'
    ], function ($, controller, MockSettingsBuilder, MockSettingsController) {
    	describe('SettingsController', function () {

    		beforeEach(function () {
    			jasmine.getFixtures().load('optionsEmpty.html');
    			MockSettingsController.prototype.resetShowCalled();
    		});

    		it('should display list of services', function () {
    			var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
    			var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();

    			controller.show([mockSettings1, mockSettings2]);

    			expect($('#services a').length).toBe(2);
    			expect($('#services a').eq(0)).toHaveText('service 1');
    			expect($('#services a').eq(1)).toHaveText('service 2');
    		});

    		it('should show first service settings on load', function () {
    			var mockSettings = new MockSettingsBuilder().create();
    			MockSettingsController.prototype.filterShowCalled('settings-0');

    			controller.show([mockSettings]);

    			expect(MockSettingsController.prototype.getShowCalled()).toBe(1);
    		});

    		it('should not regenerate settings if already active', function () {
    			var mockSettings = new MockSettingsBuilder().create();
    			controller.show([mockSettings]);

    			$('#services a').eq(0).click();

    			expect(MockSettingsController.prototype.getShowCalled()).toBe(1);
    		});

    		it('should display settings of selected service', function () {
    			var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
    			var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();

    			controller.show([mockSettings1, mockSettings2]);
    			expect($('#settings-0')).toBeVisible();
    			expect($('#settings-1')).toBeHidden();

    			$('#services a').eq(1).click();
    			expect($('#settings-0')).toBeHidden();
    			expect($('#settings-1')).toBeVisible();
    		});

    		it('should signal settingsChanged when settings saved', function () {

    		});

    	});
    });