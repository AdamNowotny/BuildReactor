define([
	'rx',
	'options/actionsCtrl'
], function (Rx) {

	'use strict';
	
	describe('actionCtrl', function () {

		var scope, controller, stateService;

		beforeEach(module('options'));

		beforeEach(inject(function ($rootScope, $controller) {
			scope = $rootScope.$new();
			stateService = {
				selectedServices: new Rx.ReplaySubject(),
				disableService: jasmine.createSpy(),
				enableService: jasmine.createSpy()
			};
			controller = $controller('ActionsCtrl', {
				$scope: scope,
				StateService: stateService
			});
		}));

		it('should initialize scope', function () {
			expect(scope.isActive).toBe(false);
			expect(scope.isEnabled).toBe(true);
		});

		it('should show actions when service selected', function () {
			stateService.selectedServices.onNext({});

			expect(scope.isActive).toBe(true);
		});

		it('should hide actions when no service selected', function () {
			stateService.selectedServices.onNext(null);

			expect(scope.isActive).toBe(false);
		});

		it('should show selected service name', function () {
			stateService.selectedServices.onNext({ name: 'service name' });

			expect(scope.serviceName).toBe('service name');
		});

		it('should indicate when service disabled', function () {
			stateService.selectedServices.onNext({ disabled: true });

			expect(scope.isEnabled).toBe(false);
		});

		it('should disable service when switch toggled', function () {
			stateService.selectedServices.onNext({});

			scope.isEnabled = false;
			scope.$digest();
			
			expect(stateService.disableService).toHaveBeenCalled();
		});

		it('should enable service when switch toggled', function () {
			stateService.selectedServices.onNext({ disabled: true });

			scope.isEnabled = true;
			scope.$digest();

			expect(stateService.enableService).toHaveBeenCalled();
		});

	});
});