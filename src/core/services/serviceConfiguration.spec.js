define([
	'core/services/serviceConfiguration',
	'core/services/configurationStore',
	'rx',
	'rx.testing'
], function (serviceConfiguration, configurationStore, Rx) {

	'use strict';
	
	describe('serviceConfiguration', function () {

		var onNext = Rx.ReactiveTest.onNext;
		var scheduler;

		beforeEach(function () {
			spyOn(configurationStore, 'store');
			spyOn(configurationStore, 'getAll');
			scheduler = new Rx.TestScheduler();
		});

		it('should get all service configuration', function () {
			var allConfig = [{ name: 'name1' }, { name: 'name2' }];
			configurationStore.getAll.andReturn(allConfig);

			var result = serviceConfiguration.getAll();

			expect(result).toEqual(allConfig);
		});

		it('should set all service configuration', function () {
			var allConfig = [{ name: 'name1' }, { name: 'name2' }];

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.setAll(allConfig);
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			expect(configurationStore.store).toHaveBeenCalledWith(allConfig);
			expect(changes.messages).toHaveEqualElements(onNext(300, allConfig));
		});

		it('should disable service', function () {
			configurationStore.getAll.andReturn([{ name: 'serviceName', disabled: false }]);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.disableService('serviceName');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [{ name: 'serviceName', disabled: true }];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveEqualElements(onNext(300, result));
		});

		it('should enable service', function () {
			configurationStore.getAll.andReturn([{ name: 'serviceName', disabled: true }]);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.enableService('serviceName');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [{ name: 'serviceName', disabled: false }];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveEqualElements(onNext(300, result));
		});
	});
});