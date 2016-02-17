define([
	'core/config/viewConfiguration',
	'core/config/localStore',
	'core/config/viewConfigUpdater',
	'rx',
	'rx.testing'
], function (viewConfiguration, configStore, configUpdater, Rx) {

	'use strict';

	describe('core/config/viewConfiguration', function () {

		var onNext = Rx.ReactiveTest.onNext;
		var scheduler;

		beforeEach(function () {
			spyOn(configStore, 'setItem');
			spyOn(configStore, 'getItem');
			spyOn(configUpdater, 'update');
			scheduler = new Rx.TestScheduler();
		});

		it('should update view config on init', function () {
			var oldConfig = [
				{ columns: 4 }
			];
			var newConfig = [
				{ columns: 4, fullWidthGroups: true }
			];
			configStore.getItem.andReturn(oldConfig);
			configUpdater.update.andReturn(newConfig);

			scheduler.scheduleAbsolute(300, function () {
				viewConfiguration.init();
			});
			var changes = scheduler.startWithCreate(function () {
				return viewConfiguration.changes;
			});

			expect(configStore.setItem).toHaveBeenCalledWith('views', newConfig);
			expect(changes.messages).toHaveElements(onNext(300, newConfig));
		});

		it('should not update view config if not an object', function () {
			expect(function () {
				viewConfiguration.save('undefined');
			}).toThrow();
			expect(configStore.setItem).not.toHaveBeenCalled();
		});

		it('should publish changes on save', function () {
			var viewConfig = {
				columns: 2
			};

			scheduler.scheduleAbsolute(300, function () {
				viewConfiguration.save(viewConfig);
			});
			var changes = scheduler.startWithCreate(function () {
				return viewConfiguration.changes;
			});

			expect(configStore.setItem).toHaveBeenCalledWith('views', viewConfig);
			expect(changes.messages).toHaveElements(onNext(300, viewConfig));
		});
		
		it('should not publish changes if config unchanged', function () {
			var viewConfig = {
				columns: 2
			};
			configStore.getItem.andReturn(viewConfig);
			
			scheduler.scheduleAbsolute(300, function () {
				viewConfiguration.save(viewConfig);
			});
			var changes = scheduler.startWithCreate(function () {
				return viewConfiguration.changes;
			});

			expect(changes.messages).not.toHaveElements(onNext(300, viewConfig));
		});
		
	});
});
