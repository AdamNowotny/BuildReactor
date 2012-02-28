define([
		'jquery',
		'settingsAddController',
		'bootstrap',
		'jqueryTools'
	], function ($, controller) {
		describe('SettingsAddController', function () {

			var serviceAddedSpy;

			beforeEach(function () {
				jasmine.getFixtures().load('serviceAddModal.html');
				controller.initialize();
				serviceAddedSpy = spyOnSignal(controller.serviceAdded);
				modalWindow.show();
			});

			afterEach(function () {
				serviceAddedSpy.reset();
				modalWindow.hide();
			});

			var modalWindow = {
				hide: function () {
					$('#service-add-wizard').modal('hide');
				},
				show: function () {
					controller.show();
				},
				isShown: function () {
					return $('#service-add-wizard').is(':visible');
				},
				close: function () {
					$('#service-add-wizard .close').click();
				},
				selectService: function () {
					$('#service-add-wizard .thumbnail:first').click();
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
					$("#service-add-wizard .wizard-form").submit();
				}
			};

			it('should show available services', function () {
				expect($('#service-add-wizard')).toBeVisible();
				expect(modalWindow.getActiveHeader()).toBe('Select service to add');
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

			it('should add service', function () {
				var name = 'My CI service name';
				var serviceAddedSpy = spyOnSignal(controller.serviceAdded).matching(function (info) {
					return info.name == name &&
						info.baseUrl == 'src/bamboo' &&
							info.service == 'bambooBuildService' &&
								info.settingsController == 'bambooSettingsController' &&
									info.settingsPage == 'bambooOptions.html';
				});
				modalWindow.selectService();
				modalWindow.enterServiceName(name);
				modalWindow.add();

				expect(modalWindow.isShown()).toBeFalsy();
				expect(serviceAddedSpy).toHaveBeenDispatched(1);
			});

			it('should add on enter when name is in focus', function () {
				modalWindow.selectService();
				modalWindow.enterServiceName('My server');

				modalWindow.pressEnter();

				expect(modalWindow.isShown()).toBeFalsy();
				expect(serviceAddedSpy).toHaveBeenDispatched(1);
			});
		});
	});