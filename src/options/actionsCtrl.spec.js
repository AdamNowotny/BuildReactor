define([
	'rx',
	'options/actionsCtrl'
], function (Rx) {

	'use strict';
	
	describe('actionCtrl', function () {

		var scope, controller, stateService, modal;
		var timeout;

		beforeEach(module('options'));

		beforeEach(inject(function ($rootScope, $controller, $modal, $timeout) {
			timeout = $timeout;
			scope = $rootScope.$new();
			modal = $modal;
			spyOn(modal, 'open');
			stateService = {
				selectedServices: new Rx.ReplaySubject(),
				disableService: jasmine.createSpy(),
				enableService: jasmine.createSpy(),
				removeService: jasmine.createSpy()
			};
			controller = $controller('ActionsCtrl', {
				$scope: scope,
				StateService: stateService
			});
		}));

		function selectService(config) {
			stateService.selectedServices.onNext(config);
			timeout.flush();
		}

		it('should show actions when service selected', function () {
			selectService({ name: 'serviceName' });
			scope.$digest();

			expect(scope.isActive).toBe(true);
		});

		it('should hide actions when no service selected', function () {
			selectService(null);

			expect(scope.isActive).toBe(false);
		});

		it('should show selected service name', function () {
			selectService({ name: 'service name' });

			expect(scope.serviceName).toBe('service name');
		});

		it('should indicate when service disabled', function () {
			selectService({ disabled: true });

			expect(scope.isEnabled).toBe(false);
		});

		it('should disable service when switch toggled', function () {
			selectService({ name: 'serviceName' });

			scope.isEnabled = false;
			scope.$digest();
			
			expect(stateService.disableService).toHaveBeenCalled();
		});

		it('should enable service when switch toggled', function () {
			selectService({ disabled: true });

			scope.isEnabled = true;
			scope.$digest();

			expect(stateService.enableService).toHaveBeenCalled();
		});

		it('should remove service', function () {
			scope.serviceName = 'serviceName';
			modal.open.andCallFake(function (params) {
				return {
					result: {
						then: function (callback) {
							callback(scope.serviceName);
						}
					}
				};
			});

			scope.remove();

			expect(stateService.removeService).toHaveBeenCalledWith('serviceName');
		});
		
	});
});