define([
		'jquery',
		'src/settings/addModal',
		'jasmineSignals',
		'jqueryTools'
	], function ($, addModal, jasmineSignals) {
		describe('addModal', function () {

			var serviceAddedSpy;
			var spyOnSignal = jasmineSignals.spyOnSignal;

			beforeEach(function () {
				jasmine.getFixtures().load('settings/addModalFixture.html');
				addModal.initialize(getSupportedServiceTypes());
				serviceAddedSpy = spyOnSignal(addModal.serviceAdded);
				modalWindow.show();
			});

			afterEach(function () {
				serviceAddedSpy.reset();
				modalWindow.hide();
			});

			var getSupportedServiceTypes = function () {
				var serviceTypes = [
					{
						name: 'Atlassian Bamboo',
						icon: 'icon.png',
						baseUrl: 'src/bamboo',
						service: 'bambooBuildService',
						settingsController: 'bambooSettingsController',
						settingsPage: 'bambooOptions.html'
					},
					{
						name: 'CruiseControl',
						icon: 'icon.png',
						baseUrl: 'src/cruisecontrol',
						service: 'ccBuildService',
						settingsController: 'ccSettingsController',
						settingsPage: 'ccOptions.html'
					}
				];
				return serviceTypes;
			};

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
					$("#service-add-form").submit();
				},
				getServiceCount: function () {
					return $('.thumbnail').length;
				}
			};

			it('should fail if service types not specified', function () {
				expect(function () {
					addModal.initialize();
				}).toThrow();
			});

			it('should show services page', function () {
				expect($('#service-add-wizard')).toBeVisible();
				expect(modalWindow.getActiveHeader()).toBe('Select service to add');
			});

			it('should show supported services', function () {
				expect(modalWindow.getServiceCount()).toBe(2);
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
				var serviceAddedSpy = spyOnSignal(addModal.serviceAdded).matching(function (info) {
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