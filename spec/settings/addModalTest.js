define([
		'jquery',
		'src/settings/addModal',
		'src/serviceTypesRepository',
		'jasmineSignals',
		'jqueryTools'
	], function ($, addModal, serviceTypesRepository, jasmineSignals) {

		describe('addModal', function () {

			var serviceAddedSpy;
			var spyOnSignal = jasmineSignals.spyOnSignal;

			var serviceType1 = {
				typeName: 'Atlassian Bamboo',
				icon: 'icon.png',
				baseUrl: 'src/bamboo',
				service: 'bambooBuildService',
				settingsController: 'bambooSettingsController',
				settingsPage: 'bambooOptions.html'
			};
			var serviceType2 = {
				typeName: 'CruiseControl',
				icon: 'icon.png',
				baseUrl: 'src/cruisecontrol',
				service: 'ccBuildService',
				settingsController: 'ccSettingsController',
				settingsPage: 'ccOptions.html'
			};
			var newSettings = serviceType1;

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
					return $('#service-add-wizard .thumbnail').eq(index - 1).next().text();
				}
			};

			beforeEach(function () {
				spyOn(serviceTypesRepository, 'getAll').andReturn([serviceType1, serviceType2]);
				spyOn(serviceTypesRepository, 'createSettingsFor').andReturn(newSettings);
				jasmine.getFixtures().load('settings/addModalFixture.html');
				addModal.initialize(serviceTypesRepository);
				serviceAddedSpy = spyOnSignal(addModal.serviceAdded);
				modalWindow.show();
			});

			afterEach(function () {
				serviceAddedSpy.reset();
				modalWindow.hide();
			});

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
				expect(modalWindow.getServiceNameAt(1)).toBe(serviceType1.typeName);
				expect(modalWindow.getServiceNameAt(2)).toBe(serviceType2.typeName);
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

			it('should dispatch added with selected service', function () {
				var spyServiceAdded = spyOnSignal(addModal.serviceAdded).matchingValues(newSettings);

				modalWindow.selectService(2);
				modalWindow.enterServiceName('CI 2');
				modalWindow.add();

				expect(spyServiceAdded).toHaveBeenDispatched(1);
			});

			it('should add name to new settings', function () {
				var spyServiceAdded = spyOnSignal(addModal.serviceAdded).matching(function (settings) {
					return settings.name === 'CI 2';
				});

				modalWindow.selectService(2);
				modalWindow.enterServiceName('CI 2');
				modalWindow.add();

				expect(spyServiceAdded).toHaveBeenDispatched(1);
			});

		});
	});