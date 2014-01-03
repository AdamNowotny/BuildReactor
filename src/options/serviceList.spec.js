define([
		'jquery',
		'options/serviceList',
		'test/mockSettingsBuilder',
		'jasmineSignals'
	], function ($, serviceList, MockSettingsBuilder, spyOnSignal) {

		'use strict';

		describe('serviceList', function () {

			var page = {
				count: function () {
					return $('.service-list li').length;
				},
				serviceAt: function (index) {
					return $('.service-list li').eq(index);
				},
				iconAt: function (index) {
					return $('.service-list li img').eq(index).attr('src');
				},
				clickServiceAt: function (index) {
					this.serviceAt(index).click();
				},
				getSelectedIndex: function () {
					var selectedIndex = $('.service-list li.active').index();
					return selectedIndex;
				}
			};

			var itemClickedSpy;
			var itemSelectedSpy;
			var settings;

			beforeEach(function () {
				loadFixtures('src/options/serviceList.fixture.html');
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

			it('should display icons', function () {
				var mockSettings1 = new MockSettingsBuilder().withIcon('service1/icon.png').create();
				var mockSettings2 = new MockSettingsBuilder().withIcon('service2/icon.png').create();

				serviceList.load([mockSettings1, mockSettings2]);

				expect(page.iconAt(0)).toBe('src/core/services/service1/icon.png');
				expect(page.iconAt(1)).toBe('src/core/services/service2/icon.png');
			});

			it('should show disabled services', function () {
				var mockSettings = new MockSettingsBuilder().isDisabled().create();

				serviceList.load([mockSettings]);

				expect(page.serviceAt(0)).toHaveClass('muted');
			});

			it('should select last item', function () {
				initializeServiceList();
				var mockSettings1 = createSettings('service 1');
				var mockSettings2 = createSettings('service 2');
				serviceList.update([mockSettings1, mockSettings2]);

				serviceList.selectLast();
				expect(page.count()).toBe(2);
				expect(page.getSelectedIndex()).toBe(1);
			});

			it('should select item', function () {
				initializeServiceList();

				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);

				expect(page.getSelectedIndex()).toBe(2);
			});

			it('should update and select at same index', function () {
				initializeServiceList();
				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);

				serviceList.update(settings);

				expect(page.getSelectedIndex()).toBe(2);
			});

			it('should not signal selected when updated', function () {
				initializeServiceList();
				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);
				itemSelectedSpy.reset();

				serviceList.update(settings);

				expect(itemSelectedSpy).not.toHaveBeenDispatched();
			});

			it('should update and select at new last index if last was selected', function () {
				initializeServiceList();
				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);

				serviceList.update([createSettings('single')]);

				expect(page.getSelectedIndex()).toBe(0);
			});

			it('should unselect when null passed to selectItem', function () {
				initializeServiceList();
				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);

				serviceList.selectItem(null);

				expect(page.getSelectedIndex()).toBe(-1);
			});

			it('should not signal selected when null passed to selectItem', function () {
				initializeServiceList();
				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);
				itemSelectedSpy.reset();

				serviceList.selectItem(null);

				expect(itemSelectedSpy).not.toHaveBeenDispatched();
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

				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);

				expect(itemSelectedSpy).toHaveBeenDispatched();
			});

			it('should get selected item name', function () {
				initializeServiceList();

				var item = $('.service-list li').eq(2);
				serviceList.selectItem(item);

				expect(serviceList.getSelectedName()).toBe('service 3');
			});

		});
	});