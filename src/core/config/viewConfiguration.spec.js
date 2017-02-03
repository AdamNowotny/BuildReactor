import Rx from 'rx/dist/rx.testing';
import configStore from 'core/config/localStore';
import configUpdater from 'core/config/viewConfigUpdater';
import viewConfiguration from 'core/config/viewConfiguration';

describe('core/config/viewConfiguration', () => {

	const onNext = Rx.ReactiveTest.onNext;
	let scheduler;

	beforeEach(() => {
		spyOn(configStore, 'setItem');
		spyOn(configStore, 'getItem');
		spyOn(configUpdater, 'update');
		scheduler = new Rx.TestScheduler();
	});

	it('should update view config on init', () => {
		const oldConfig = [
			{ columns: 4 }
		];
		const newConfig = [
			{ columns: 4, fullWidthGroups: true }
		];
		configStore.getItem.and.returnValue(oldConfig);
		configUpdater.update.and.returnValue(newConfig);

		scheduler.scheduleAbsolute(null, 300, () => {
			viewConfiguration.init();
		});
		const changes = scheduler.startScheduler(() => {
			return viewConfiguration.changes;
		});

		expect(configStore.setItem).toHaveBeenCalledWith('views', newConfig);
		expect(changes.messages).toHaveElements(onNext(300, newConfig));
	});

	it('should not update view config if not an object', () => {
		expect(() => {
			viewConfiguration.save('undefined');
		}).toThrowError();
		expect(configStore.setItem).not.toHaveBeenCalled();
	});

	it('should publish changes on save', () => {
		const viewConfig = {
			columns: 2
		};

		scheduler.scheduleAbsolute(null, 300, () => {
			viewConfiguration.save(viewConfig);
		});
		const changes = scheduler.startScheduler(() => {
			return viewConfiguration.changes;
		});

		expect(configStore.setItem).toHaveBeenCalledWith('views', viewConfig);
		expect(changes.messages).toHaveElements(
			onNext(200),
			onNext(300, viewConfig)
		);
	});

	it('should not publish changes if config unchanged', () => {
		const viewConfig = {
			columns: 2
		};
		configStore.getItem.and.returnValue(viewConfig);

		scheduler.scheduleAbsolute(null, 300, () => {
			viewConfiguration.save(viewConfig);
		});
		const changes = scheduler.startScheduler(() => {
			return viewConfiguration.changes;
		});

		expect(changes.messages).not.toHaveElements(onNext(300, viewConfig));
	});

});
