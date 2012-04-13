define([
		'jquery',
		'src/settings/serviceList',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals'
	], function ($, serviceList, MockSettingsBuilder, jasmineSignals) {
		describe('serviceList', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			var page = {
				count: function () {
					return $('#service-list li').length;
				},
				serviceAt: function (index) {
					return $('#service-list li').eq(index);
				},
				clickServiceAt: function (index) {
					this.serviceAt(index).click();
				},
				getSelectedIndex: function () {
					var selectedIndex = $('#service-list li.active').index();
					return selectedIndex;
				}
			};

			var itemClickedSpy;
			var itemSelectedSpy;
			var settings;

			beforeEach(function () {
				jasmine.getFixtures().load('settings/serviceListFixture.html');
				itemClickedSpy = spyOnSignal(serviceList.itemClicked);
				itemSelectedSpy = spyOnSignal(serviceList.itemSelected);
			});

			var createSettings = function (name) {
				var mockSettings = new MockSettingsBuilder().withName(name).create();
				return mockSettings;
			};

			var initializeServiceList = function () {
				var mockSettings1 = createSettings('service 1');
				var mockSettings2 = createSettings('service 2');
				var mockSettings3 = createSettings('service 3');
				settings = [mockSettings1, mockSettings2, mockSettings3];
				serviceList.load(settings);
			};

			it('should load and select first', function () {
				var mockSettings1 = createSettings('service 1');
				var mockSettings2 = createSettings('service 2');

				serviceList.load([mockSettings1, mockSettings2]);

				expect(page.count()).toBe(2);
				expect(page.serviceAt(0)).toHaveText('service 1');
				expect(page.serviceAt(1)).toHaveText('service 2');
				expect(page.getSelectedIndex()).toBe(0);
			});

			it('should not select if empty list on load', function () {
				serviceList.load([]);

				expect(itemSelectedSpy).not.toHaveBeenDispatched();
			});

			it('should clear before load', function () {
				var mockSettings1 = createSettings('service 1');
				var mockSettings2 = createSettings('service 2');

				serviceList.load([mockSettings1, mockSettings2]);
				serviceList.load([mockSettings1, mockSettings2]);

				expect(page.count()).toBe(2);
			});

			it('should add item and select it', function () {
				initializeServiceList();
				var mockSettings = createSettings('service 4');

				serviceList.add(mockSettings);

				expect(page.count()).toBe(4);
				expect(page.serviceAt(3)).toHaveText('service 4');
			});

			it('should select item', function () {
				initializeServiceList();

				var item = $('#service-list li').eq(2);
				serviceList.selectItem(item);

				expect(page.getSelectedIndex()).toBe(2);
			});

			it('should update and select at previous index', function () {
				initializeServiceList();
				var item = $('#service-list li').eq(2);
				serviceList.selectItem(item);

				serviceList.update(settings);

				expect(page.getSelectedIndex()).toBe(2);
			});

			it('should not select if empty list on update', function () {
				serviceList.update([]);

				expect(itemSelectedSpy).not.toHaveBeenDispatched();
			});

			it('should dispatch itemClicked on click', function () {
				initializeServiceList();

				page.clickServiceAt(1);

				expect(itemClickedSpy).toHaveBeenDispatched();
			});

			it('should dispatch itemSelected on select', function () {
				initializeServiceList();

				var item = $('#service-list li').eq(2);
				serviceList.selectItem(item);

				expect(itemSelectedSpy).toHaveBeenDispatched();
			});

			it('should get selected item name', function () {
				initializeServiceList();

				var item = $('#service-list li').eq(2);
				serviceList.selectItem(item);

				expect(serviceList.getSelectedName()).toBe('service 3');
			});

		});
	});