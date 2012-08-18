define([
		'jquery',
		'settings/addModal',
		'jasmineSignals',
		'jqueryTools'
	], function ($, addModal, jasmineSignals) {

		'use strict';

		describe('addModal', function () {

			var spySelected;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			var serviceTypes;

			var modalWindow = {
				hide: function () {
					$('#service-add-wizard').modal('hide');
				},
				show: function () {
					addModal.show();
				},
				isShown: function () {
					return $('#service-add-wizard').is(':visible');
				},
				close: function () {
					$('#service-add-wizard .close').click();
				},
				selectService: function (index) {
					if (index === undefined) {
						index = 1;
					}
					$('#service-add-wizard .thumbnail').eq(index - 1).find('img').click();
				},
				enterServiceName: function (serviceName) {
					$('#service-add-wizard #service-add-name').val(serviceName).trigger('input');
				},
				getServiceName: function () {
					return $('#service-add-wizard #service-add-name').val();
				},
				getActiveHeader: function () {
					return $('#service-add-wizard .modal-header .active').text().trim();
				},
				isAddButtonDisabled: function () {
					return $('#service-add-wizard .btn-primary').hasClass('disabled');
				},
				add: function () {
					$('#service-add-wizard .btn-primary').click();
				},
				pressEnter: function () {
					$("#service-add-form").submit();
				},
				getServiceCount: function () {
					return $('.thumbnail').length;
				},
				getServiceNameAt: function (index) {
					return $('#service-add-wizard .thumbnail .caption h5').eq(index - 1).text();
				}
			};

			beforeEach(function () {
				serviceTypes = [{
					typeName: 'Atlassian Bamboo',
					baseUrl: 'bamboo',
					icon: 'bamboo/icon.png'
				}, {
					typeName: 'CruiseControl',
					baseUrl: 'cruisecontrol',
					icon: 'cruisecontrol/icon.png'
				}];
				jasmine.getFixtures().load('settings/addModalFixture.html');
				addModal.initialize(serviceTypes);
				spySelected = spyOnSignal(addModal.on.selected);
				modalWindow.show();
			});

			afterEach(function () {
				addModal.on.selected.removeAll();
				modalWindow.hide();
			});

			it('should show service selection step', function () {
				expect($('#service-add-wizard')).toBeVisible();
				expect(modalWindow.getActiveHeader()).toBe('Select service to add');
			});

			it('should show supported services', function () {
				expect(modalWindow.getServiceCount()).toBe(2);
				expect(modalWindow.getServiceNameAt(1)).toBe(serviceTypes[0].typeName);
				expect(modalWindow.getServiceNameAt(2)).toBe(serviceTypes[1].typeName);
			});

			it('should expect name after selecting service type', function () {
				modalWindow.selectService();

				expect($('#service-add-wizard #service-add-name')).toBeVisible();
				expect(modalWindow.getActiveHeader()).toBe('Enter service name');
			});

			it('should show first page if previously closed', function () {
				modalWindow.selectService();
				modalWindow.close();

				modalWindow.show();

				expect($('#service-add-wizard .modal-header li:first')).toHaveClass('active');
				expect($('#service-add-wizard .modal-header li.active').length).toBe(1);
				expect($('#service-add-wizard .thumbnail:first')).toBeVisible();
			});

			it('should clear name if previously entered', function () {
				modalWindow.selectService();
				modalWindow.enterServiceName('Some name');
				modalWindow.close();

				modalWindow.show();

				expect(modalWindow.getServiceName()).toBe('');
			});

			it('should enable add button only if name specified', function () {
				modalWindow.selectService();

				modalWindow.enterServiceName('Some name');
				expect(modalWindow.isAddButtonDisabled()).toBeFalsy();

				modalWindow.enterServiceName('');
				expect(modalWindow.isAddButtonDisabled()).toBeTruthy();
			});

			it('should ignore add button if disabled', function () {
				modalWindow.add();

				expect(modalWindow.isShown()).toBeTruthy();
			});

			it('should hide after selection', function () {
				modalWindow.selectService();
				modalWindow.enterServiceName('name');
				modalWindow.add();

				expect(modalWindow.isShown()).toBeFalsy();
			});

			it('should dispatch selected', function () {
				spySelected.andCallFake(function (info) {
					expect(info).toBe(serviceTypes[1]);
					expect(info.name).toBe('CI 2');
				});

				modalWindow.selectService(2);
				modalWindow.enterServiceName('CI 2');
				modalWindow.add();

				expect(spySelected).toHaveBeenDispatched(1);
			});

			it('should select on enter when name is in focus', function () {
				modalWindow.selectService();
				modalWindow.enterServiceName('My server');

				modalWindow.pressEnter();

				expect(modalWindow.isShown()).toBeFalsy();
				expect(spySelected).toHaveBeenDispatched(1);
			});

		});
	});