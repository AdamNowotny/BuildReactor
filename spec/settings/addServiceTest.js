define([
		'jquery',
		'settings/addService',
		'jasmineSignals',
		'jqueryTools'
	], function ($, addService, jasmineSignals) {

		'use strict';

		describe('addModal', function () {

			var spySelected;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			var serviceTypes;

			var container = {
				hide: function () {
					$('#service-add-wizard').modal('hide');
				},
				show: function () {
					addService.show();
				},
				isShown: function () {
					return $('.service-add-container').is(':visible');
				},
				close: function () {
					$('#service-add-wizard .close').click();
				},
				selectService: function (index) {
					if (index === undefined) {
						index = 1;
					}
					$('.thumbnail').eq(index - 1).find('img').click();
				},
				enterServiceName: function (serviceName) {
					$('#service-add-name').val(serviceName).trigger('input');
				},
				getServiceName: function () {
					return $('#service-add-name').val();
				},
				isAddButtonDisabled: function () {
					return $('.btn-primary').hasClass('disabled');
				},
				add: function () {
					$('.btn-primary').click();
				},
				pressEnter: function () {
					$(".service-add-form").submit();
				},
				getServiceCount: function () {
					return $('.thumbnail').length;
				},
				getServiceNameAt: function (index) {
					return $('.thumbnail .caption h5').eq(index - 1).text();
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
				jasmine.getFixtures().load('settings/addServiceFixture.html');
				addService.initialize('.service-add-container', serviceTypes);
				spySelected = spyOnSignal(addService.on.selected);
				container.show();
			});

			afterEach(function () {
				addService.on.selected.removeAll();
				container.hide();
			});

			it('should show supported services', function () {
				expect(container.getServiceCount()).toBe(2);
				expect(container.getServiceNameAt(1)).toBe(serviceTypes[0].typeName);
				expect(container.getServiceNameAt(2)).toBe(serviceTypes[1].typeName);
			});

			it('should disable name if service type not selected', function () {
				container.show();

				expect($('#service-add-name')).toBeDisabled();
			});

			it('should enable name after service type selected', function () {
				container.selectService();

				expect($('#service-add-name')).not.toBeDisabled();
			});

			it('should highlight selected service', function () {
				container.selectService(2);
				container.selectService(1);

				expect($('.thumbnail.active').length).toBe(1);
				expect($('.thumbnail').eq(0)).toHaveClass('active');
			});

			it('should focus name after selecting service type', function () {
				container.selectService();

				expect($(document.activeElement)).toHaveId('service-add-name');
			});

			it('should clear name if previously entered', function () {
				container.selectService();
				container.enterServiceName('Some name');
				container.close();

				container.show();

				expect(container.getServiceName()).toBe('');
			});

			it('should enable add button only if name specified', function () {
				container.selectService();

				container.enterServiceName('Some name');
				expect(container.isAddButtonDisabled()).toBeFalsy();

				container.enterServiceName('');
				expect(container.isAddButtonDisabled()).toBeTruthy();
			});

			it('should ignore add button if disabled', function () {
				container.add();

				expect(container.isShown()).toBeTruthy();
			});

			it('should dispatch selected', function () {
				spySelected.andCallFake(function (info) {
					expect(info).toBe(serviceTypes[1]);
					expect(info.name).toBe('CI 2');
				});

				container.selectService(2);
				container.enterServiceName('CI 2');
				container.add();

				expect(spySelected).toHaveBeenDispatched(1);
			});

			it('should add on enter when name is in focus', function () {
				container.selectService();
				container.enterServiceName('My server');

				container.pressEnter();

				expect(spySelected).toHaveBeenDispatched(1);
			});

			it('should hide', function () {
				addService.hide();
				
				expect(container.isShown()).toBeFalsy();
			});

		});
	});