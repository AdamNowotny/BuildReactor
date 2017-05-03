import updater from 'core/config/viewConfigUpdater';

describe('core/config/viewConfigUpdater', () => {

	it('should add default view configuration', () => {
		const config = updater.update();

		expect(config).toEqual({
			columns: 2,
			fullWidthGroups: true,
			singleGroupRows: false,
			showCommits: true,
			showCommitsWhenGreen: false,
			theme: 'dark',
			colorBlindMode: true,
			notifications: {
				enabled: true,
				showWhenDashboardActive: false,
				buildStarted: false,
				buildFinished: false,
				buildBroken: true,
				buildFixed: true
			}
		});
	});

	it('should not override existing view configuration', () => {
		const config = updater.update({ columns: 4 });

		expect(config.columns).toBe(4);
	});

	it('should add default singleGroupRows', () => {
		const config = updater.update({ columns: 4 });

		expect(config.singleGroupRows).toBe(false);
	});

	it('should add default showCommits', () => {
		const config = updater.update({ columns: 4 });

		expect(config.showCommits).toBe(true);
	});

	it('should add default showCommitsWhenGreen', () => {
		const config = updater.update({ columns: 4 });

		expect(config.showCommitsWhenGreen).toBe(false);
	});

	it('should add default theme', () => {
		const config = updater.update({ columns: 4 });

		expect(config.theme).toBe('dark');
	});

	it('should add default notifications config', () => {
		const config = updater.update({ columns: 4 });

		expect(config.notifications).not.toBeNull();
	});

	it('should add default colorBlindMode setting', () => {
		const config = updater.update({ columns: 4 });

		expect(config.colorBlindMode).toBe(true);
	});
});
