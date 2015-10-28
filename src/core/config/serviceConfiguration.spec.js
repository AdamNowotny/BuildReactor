define([
	'core/config/serviceConfiguration',
	'core/config/localStore',
	'core/config/serviceConfigUpdater',
	'common/arrayEquals',
	'rx',
	'rx.testing'
], function (serviceConfiguration, configStore, configUpdater, arrayEquals, Rx) {

	'use strict';

	describe('core/config/serviceConfiguration', function () {

		var onNext = Rx.ReactiveTest.onNext;
		var scheduler;

		beforeEach(function () {
			spyOn(configStore, 'setItem');
			spyOn(configStore, 'getItem');
			spyOn(configUpdater, 'update');
			scheduler = new Rx.TestScheduler();
		});

		it('should update service config on init', function () {
			var oldConfig = [
				{ name: 'service', disabled: false }
			];
			var newConfig = [
				{ name: 'updated service', disabled: false }
			];
			configStore.getItem.andReturn(oldConfig);
			configUpdater.update.andReturn(newConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.init();
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			expect(configStore.setItem).toHaveBeenCalledWith('services', newConfig);
			expect(changes.messages).toHaveElements(onNext(300, newConfig));
		});

		it('should disable service', function () {
			var allConfig = [
				{ name: 'service1', disabled: false },
				{ name: 'service2', disabled: false }
			];
			configStore.getItem.andReturn(allConfig);

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
			expect(configStore.setItem).toHaveBeenCalledWith('services', result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should enable service', function () {
			var allConfig = [
				{ name: 'service1', disabled: false },
				{ name: 'service2', disabled: true }
			];
			configStore.getItem.andReturn(allConfig);

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
			expect(configStore.setItem).toHaveBeenCalledWith('services', result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should remove service', function () {
			var allConfig = [{ name: 'service1' }, { name: 'service2' }];
			configStore.getItem.andReturn(allConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.removeService('service1');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [{ name: 'service2' }];
			expect(configStore.setItem).toHaveBeenCalledWith('services', result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should rename service', function () {
			var allConfig = [{ name: 'service1' }, { name: 'service2' }];
			configStore.getItem.andReturn(allConfig);

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.renameService('service1', 'service1 new');
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [{ name: 'service1 new' }, { name: 'service2' }];
			expect(configStore.setItem).toHaveBeenCalledWith('services', result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should save existing service', function () {
			var allConfig = [{ name: 'service', url: 'http://example1.com' }];
			configStore.getItem.andReturn(allConfig);
			var newSettings = { name: 'service', url: 'http://example2.com' };

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.saveService(newSettings);
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [newSettings];
			expect(configStore.setItem).toHaveBeenCalledWith('services', result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		it('should add new service', function () {
			var allConfig = [{ name: 'service', url: 'http://example1.com' }];
			configStore.getItem.andReturn(allConfig);
			var newSettings = { name: 'service-new', url: 'http://example2.com' };

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.saveService(newSettings);
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			var result = [allConfig[0], newSettings];
			expect(configStore.setItem).toHaveBeenCalledWith('services', result);
			expect(changes.messages).toHaveElements(onNext(300, result));
		});

		describe('reordering', function () {

			it('should reorder services', function () {
				var allConfig = [
					{ name: 'service1' },
					{ name: 'service2' }
				];
				configStore.getItem.andReturn(allConfig);

				scheduler.scheduleAbsolute(300, function () {
					serviceConfiguration.setOrder(['service2', 'service1']);
				});
				var changes = scheduler.startWithCreate(function () {
					return serviceConfiguration.changes;
				});

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
				configStore.getItem.andReturn(allConfig);

				expect(function () {
					serviceConfiguration.setOrder(['service2', 'service1']);
				}).toThrow({ name: 'ArgumentInvalid', message: 'All services required' });
			});

			it('should not publish changes when order not changed', function () {
				var allConfig = [
					{ name: 'service1' },
					{ name: 'service2' }
				];
				configStore.getItem.andReturn(allConfig);

				scheduler.scheduleAbsolute(300, function () {
					serviceConfiguration.setOrder(['service1', 'service2']);
				});
				var changes = scheduler.startWithCreate(function () {
					return serviceConfiguration.changes;
				});

				expect(changes.messages).not.toHaveElementsAtTimes(300);
			});

		});

		describe('reordering builds', function () {

			it('should store updated builds', function () {
				var allConfig = [
					{ name: 'service name', projects: ['build1', 'build2'] }
				];
				configStore.getItem.andReturn(allConfig);

				scheduler.scheduleAbsolute(300, function () {
					serviceConfiguration.setBuildOrder('service name', ['build2', 'build1']);
				});
				var changes = scheduler.startWithCreate(function () {
					return serviceConfiguration.changes;
				});

				var result = configStore.setItem.mostRecentCall.args[1][0];
				expect(result.name).toBe('service name');
				expect(result.projects).toEqual(['build2', 'build1']);
			});

			it('should publish changes', function () {
				var allConfig = [
					{ name: 'service name', projects: ['build1', 'build2'] }
				];
				configStore.getItem.andReturn(allConfig);

				scheduler.scheduleAbsolute(300, function () {
					serviceConfiguration.setBuildOrder('service name', ['build2', 'build1']);
				});
				var changes = scheduler.startWithCreate(function () {
					return serviceConfiguration.changes;
				});

				expect(changes.messages).toHaveElementsMatchingAt(300, function (value) {
					return arrayEquals(value[0].projects, ['build2', 'build1']);
				});
			});

		});
		
		it('should save service configuration', function () {
			var newSettings = [{ name: 'service' }];

			scheduler.scheduleAbsolute(300, function () {
				serviceConfiguration.save(newSettings);
			});
			var changes = scheduler.startWithCreate(function () {
				return serviceConfiguration.changes;
			});

			expect(configStore.setItem).toHaveBeenCalledWith('services', newSettings);
			expect(changes.messages).toHaveElements(onNext(300, newSettings));
		});


	});
});
