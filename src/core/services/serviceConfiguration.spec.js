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
			expect(changes.messages).toHaveElements(onNext(300, allConfig));
		});

		it('should disable service', function () {
			var allConfig = [
				{ name: 'service1', disabled: false },
				{ name: 'service2', disabled: false }
			];
			configurationStore.getAll.andReturn(allConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.disableService('service2');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [
				{ name: 'service1', disabled: false },
				{ name: 'service2', disabled: true }
			];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should enable service', function () {
			var allConfig = [
				{ name: 'service1', disabled: false },
				{ name: 'service2', disabled: true }
			];
			configurationStore.getAll.andReturn(allConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.enableService('service2');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [
				{ name: 'service1', disabled: false },
				{ name: 'service2', disabled: false }
			];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should remove service', function () {
			var allConfig = [{ name: 'service1' }, { name: 'service2' }];
			configurationStore.getAll.andReturn(allConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.removeService('service1');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [{ name: 'service2' }];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should rename service', function () {
			var allConfig = [{ name: 'service1' }, { name: 'service2' }];
			configurationStore.getAll.andReturn(allConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.renameService('service1', 'service1 new');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [{ name: 'service1 new' }, { name: 'service2' }];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should save existing service', function () {
			var allConfig = [{ name: 'service', url: 'http://example1.com' }];
			configurationStore.getAll.andReturn(allConfig);
			var newSettings = { name: 'service', url: 'http://example2.com' };

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.saveService(newSettings);
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [newSettings];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should add new service', function () {
			var allConfig = [{ name: 'service', url: 'http://example1.com' }];
			configurationStore.getAll.andReturn(allConfig);
			var newSettings = { name: 'service-new', url: 'http://example2.com' };

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.saveService(newSettings);
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [allConfig[0], newSettings];
			expect(configurationStore.store).toHaveBeenCalledWith(result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		describe('reordering', function () {
			it('should reorder services', function () {
				var allConfig = [
					{ name: 'service1' },
					{ name: 'service2' }
				];
				configurationStore.getAll.andReturn(allConfig);

				scheduler.scheduleAbsolute(300, function () {
					serviceConfiguration.setOrder(['service2', 'service1']);
				});
				var changes = scheduler.startWithCreate(function () {
					return serviceConfiguration.changes;
				});

				var result = [
					{ name: 'service2' },
					{ name: 'service1' }
				];
				expect(changes.messages).toHaveElementsMatchingAt(300, function (value) {
					return value[0].name === 'service2' && value[1].name === 'service1';
				});
			});

			it('should throw error when service count does not match', function () {
				var allConfig = [
					{ name: 'service1' },
					{ name: 'service2' },
					{ name: 'service3' }
				];
				configurationStore.getAll.andReturn(allConfig);

				expect(function () {
					serviceConfiguration.setOrder(['service2', 'service1']);
				}).toThrow({ name: 'ArgumentInvalid', message: 'All services required' });
			});
		});
		
	});
});