define([
		'jquery',
		'src/settingsPageController',
		'src/settingsAddController',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals'
	], function ($, controller, settingsAddController, MockSettingsBuilder, jasmineSignals) {
		describe('SettingsPageController', function () {

			var defaultTimeout = 3000;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			var menu = {
				count: function () {
					return $('#service-list li').length;
				},
				serviceAt: function (index) {
					return $('#service-list li').eq(index);
				},
				selectServiceAt: function (index) {
					this.serviceAt(index).click();
				},
				getSelectedIndex: function () {
					var selectedIndex = $('#service-list li.active').index();
					return selectedIndex;
				}
			};

			beforeEach(function () {
				jasmine.getFixtures().load('optionsEmpty.html');
				spyOn(settingsAddController, 'show');
				spyOn(settingsAddController, 'initialize');
				controller.initialize();
			});

			function getSettingsFrame() {
				var iframe = $('#settings-frame')[0];
				return {
					window: iframe.contentWindow,
					document: iframe.contentWindow.document,
					src: $(iframe).attr('src')
				};
			}

			// returns function used to get active settings controller
			function runsToGetController(settings) {
				var childController = null;

				// wait for RequireJS to be loaded
				waitsFor(function () {
					return getSettingsFrame().window.require != undefined;
				}, defaultTimeout);
				// get service settings controller from iframe
				runs(function () {
					var controllerName = settings.baseUrl + '/' + settings.settingsController;
					getSettingsFrame().window.require(
						[controllerName], function (serviceSettingsController) {
							childController = serviceSettingsController;
						});
				});
				waitsFor(function () {
					return childController != null;
				}, defaultTimeout);
				return function () { return childController; };
			}

			it('should display list of services', function () {
				var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
				var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();

				controller.load([mockSettings1, mockSettings2]);

				expect(menu.count()).toBe(2);
				expect(menu.serviceAt(0)).toHaveText('service 1');
				expect(menu.serviceAt(1)).toHaveText('service 2');
			});

			it('should show first service settings page on load', function () {
				var settingsShownSpy = spyOnSignal(controller.settingsShown);
				var mockSettings = new MockSettingsBuilder()
					.withSettingsPage('page1.html')
					.create();

				runs(function () {
					controller.load([mockSettings]);
				});

				waitsFor(function () {
					return settingsShownSpy.count > 0;
				}, defaultTimeout);
				runs(function () {
					expect(getSettingsFrame().src).toContain('page1.html');
				});
			});

			it('should call show on first service settings on load', function () {
				var mockSettings = new MockSettingsBuilder().create();
				var childControllerGetter = null;

				runs(function () {
					controller.load([mockSettings]);
					childControllerGetter = runsToGetController(mockSettings);
				});

				// expect show to be already called on the settings controller
				waitsFor(function () {
					return childControllerGetter().getShowCalledCount() > 0;
				}, 0);
			});

			it('should not regenerate settings page if already active', function () {
				var settingsShownSpy = spyOnSignal(controller.settingsShown);
				runs(function () {
					var mockSettings = new MockSettingsBuilder().create();
					controller.load([mockSettings]);
				});
				waitsFor(function () {
					return settingsShownSpy.count > 0;
				}, defaultTimeout);

				runs(function () {
					menu.selectServiceAt(0);
				});

				runs(function () {
					expect(settingsShownSpy).toHaveBeenDispatched(1);
				});
			});

			it('should update service name when selected', function () {
				var mockSettings1 = new MockSettingsBuilder()
					.withName('First service')
					.create();
				controller.load([mockSettings1]);

				expect($('#service-name')).toHaveText('First service');

				var mockSettings2 = new MockSettingsBuilder()
					.withName('Second service')
					.create();
				controller.load([mockSettings2]);

				expect($('#service-name')).toHaveText('Second service');
			});

			it('should display settings of selected service', function () {
				var mockSettings1 = new MockSettingsBuilder()
					.withName('service 1')
					.withSettingsPage('page1.html')
					.create();
				var mockSettings2 = new MockSettingsBuilder()
					.withName('service 2')
					.withSettingsPage('page2.html')
					.create();

				controller.load([mockSettings1, mockSettings2]);
				expect(getSettingsFrame().src).toContain('page1.html');
				menu.serviceAt(1).click();

				expect(getSettingsFrame().src).toContain('page2.html');
			});

			it('should signal settingsChanged when settings saved', function () {
				var mockSettings = new MockSettingsBuilder().create();
				var childControllerGetter = null;
				var settingsChangedCount = 0;
				runs(function () {
					controller.load([mockSettings]);
					childControllerGetter = runsToGetController(mockSettings);
				});

				runs(function () {
					controller.settingsChanged.add(function (settings) {
						settingsChangedCount++;
					});
					childControllerGetter().saveClicked.dispatch(mockSettings);
				});

				waitsFor(function () {
					return settingsChangedCount == 1;
				}, 0);
			});

			it('should signal settingsChanged with new settings', function () {
				var mockSettings = new MockSettingsBuilder().create();
				var childControllerGetter = null;
				var settingsChangedCount = 0;
				runs(function () {
					controller.load([mockSettings]);
					childControllerGetter = runsToGetController(mockSettings);
				});

				var settings = mockSettings;
				runs(function () {
					getSettingsFrame().document.getElementById('url').value = 'http://new.url.com/';
				});
				runs(function () {
					controller.settingsChanged.add(function (newSettings) {
						settings = newSettings[0];
						settingsChangedCount++;
					});
					settings.url = 'http://new.url.com/';
					childControllerGetter().saveClicked.dispatch(settings);
				});
				waitsFor(function () {
					return settingsChangedCount == 1;
				}, 0);

				runs(function () {
					expect(settings.url).toBe('http://new.url.com/');
				});
			});

			it('should fail if subcontroller does not implement required API', function () {
				// TODO implement test
			});

			describe('Adding service', function () {

				it('should show dialog when adding service', function () {
					$('#service-add-button').click();

					expect(settingsAddController.show).toHaveBeenCalled();
				});

				it('should initialize add service controller on initialize', function () {
					controller.initialize();

					expect(settingsAddController.initialize).toHaveBeenCalled();
				});

				it('should update list of services on add', function () {
					var serviceInfo = {
						name: 'My Bamboo CI',
						baseUrl: 'src/bamboo',
						service: 'bambooBuildService',
						settingsController: 'bambooSettingsController',
						settingsPage: 'bambooOptions.html'
					};
					settingsAddController.serviceAdded.dispatch(serviceInfo);

					expect(menu.count()).toBe(1);
				});

				it('should show new service settings', function () {
					var serviceInfo1 = {
						name: 'Server 1',
						baseUrl: 'src/bamboo',
						service: 'bambooBuildService',
						settingsController: 'bambooSettingsController',
						settingsPage: 'bambooOptions.html'
					};
					settingsAddController.serviceAdded.dispatch(serviceInfo1);
					var serviceInfo2 = {
						name: 'Server',
						baseUrl: 'src/bamboo',
						service: 'bambooBuildService',
						settingsController: 'bambooSettingsController',
						settingsPage: 'bambooOptions.html'
					};
					settingsAddController.serviceAdded.dispatch(serviceInfo2);

					expect(menu.serviceAt(0)).not.toHaveClass('active');
					expect(menu.serviceAt(1)).toHaveClass('active');
				});
			});

			describe('Removing service', function () {

				var modalWindow = {
					show: function () {
						$('#service-remove-button').click();
					},
					hide: function () {
						$('#service-remove-modal').modal('hide');
					},
					isShown: function () {
						return $('#service-remove-modal').is(':visible');
					},
					serviceName: function () {
						return $('#service-remove-name').text();
					},
					remove: function () {
						$('#service-remove-form').submit();
					}
				};

				afterEach(function () {
					modalWindow.hide();
				});

				it('should show confirmation dialog', function () {
					expect(modalWindow.isShown()).toBeFalsy();

					modalWindow.show();

					expect(modalWindow.isShown()).toBeTruthy();
				});

				it('should show service name in modal window', function () {
					var mockSettings = new MockSettingsBuilder().create();
					controller.load([mockSettings]);

					modalWindow.show();

					expect(modalWindow.serviceName()).toBe(mockSettings.name);
				});

				it('should close modal window', function () {
					var mockSettings = new MockSettingsBuilder().create();
					controller.load([mockSettings]);
					modalWindow.show();

					modalWindow.remove();

					expect(modalWindow.isShown()).toBeFalsy();
				});

				it('should remove service', function () {
					var mockSettings = new MockSettingsBuilder().create();
					controller.load([mockSettings]);
					modalWindow.show();

					modalWindow.remove();

					expect(menu.count()).toBe(0);
				});

				it('should dispatch settingsChanged', function () {
					var mockSettings = new MockSettingsBuilder().create();
					controller.load([mockSettings]);
					modalWindow.show();
					var settingsChangedSpy = spyOnSignal(controller.settingsChanged);

					modalWindow.remove();

					expect(settingsChangedSpy).toHaveBeenDispatched();
				});

				it('should select next in list after remove', function () {
					var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
					var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();
					var mockSettings3 = new MockSettingsBuilder().withName('service 3').create();
					controller.load([mockSettings1, mockSettings2, mockSettings3]);
					menu.selectServiceAt(1);
					modalWindow.show();

					modalWindow.remove();

					expect(menu.getSelectedIndex()).toBe(1);
				});

				it('should select previous in list if last removed', function () {
					var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
					var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();
					var mockSettings3 = new MockSettingsBuilder().withName('service 3').create();
					controller.load([mockSettings1, mockSettings2, mockSettings3]);
					menu.selectServiceAt(2);
					modalWindow.show();

					modalWindow.remove();

					expect(menu.getSelectedIndex()).toBe(1);
				});
			});
		});
	});