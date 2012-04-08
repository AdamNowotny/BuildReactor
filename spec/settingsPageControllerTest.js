define([
		'jquery',
		'src/settingsPageController',
		'src/settingsAddController',
		'src/settings/savePrompt',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals',
		'src/Timer'
	], function ($, controller, settingsAddController, savePrompt, MockSettingsBuilder, jasmineSignals, Timer) {
		describe('SettingsPageController', function () {

			var defaultTimeout = 3000;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			var page = {
				getServiceName: function () {
					return $('#service-name').text();
				},
				isAddButtonEnabled: function () {
					return !$('#service-add-button').hasClass('disabled');
				}
			};

			page.serviceList = {
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
				jasmine.getFixtures().load('optionsEmptyFixture.html');
				spyOn(settingsAddController, 'show');
				spyOn(settingsAddController, 'initialize');
				spyOn(savePrompt, 'initialize');
				spyOn(savePrompt, 'show');
				spyOn(savePrompt, 'hide');
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

			function loadServices() {
				var serviceList = [];
				for (var i = 0; i < arguments.length; i++) {
					var name = arguments[i];
					var serviceInfo = new MockSettingsBuilder().withName(name).create();
					serviceList.push(serviceInfo);
				}
				controller.load(serviceList);
			};

			it('should display list of services', function () {
				var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
				var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();

				controller.load([mockSettings1, mockSettings2]);

				expect(page.serviceList.count()).toBe(2);
				expect(page.serviceList.serviceAt(0)).toHaveText('service 1');
				expect(page.serviceList.serviceAt(1)).toHaveText('service 2');
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
					page.serviceList.selectServiceAt(0);
				});

				runs(function () {
					expect(settingsShownSpy).toHaveBeenDispatched(1);
				});
			});

			it('should update service name when selected', function () {
				loadServices('First service', 'Second service');

				expect($('#service-name')).toHaveText('First service');

				page.serviceList.serviceAt(1).click();

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
				page.serviceList.serviceAt(1).click();

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
					childControllerGetter().settingsChanged.dispatch(mockSettings);
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
					childControllerGetter().settingsChanged.dispatch(settings);
				});
				waitsFor(function () {
					return settingsChangedCount == 1;
				}, 0);

				runs(function () {
					expect(settings.url).toBe('http://new.url.com/');
				});
			});

			it('should show alert when settings saved', function () {
				spyOn(Timer.prototype, 'start').andCallFake(function () {
					expect('#alert-saved').toBeVisible();
					this.elapsed.dispatch();
				});
				var mockSettings = new MockSettingsBuilder().create();

				expect('#alert-saved').not.toBeVisible();
				controller.settingsChanged.dispatch(mockSettings);

				expect('#alert-saved').not.toBeVisible();
			});

			it('should fail if subcontroller does not implement required API', function () {
				// TODO implement test
			});

			describe('Adding service', function () {

				function addService(name) {
					var serviceInfo = new MockSettingsBuilder().withName(name).create();
					settingsAddController.serviceAdded.dispatch(serviceInfo);
				}

				it('should show dialog when adding service', function () {
					$('#service-add-button').click();

					expect(settingsAddController.show).toHaveBeenCalled();
				});

				it('should not show dialog if button disabled', function () {
					$('#service-add-button').addClass('disabled');

					$('#service-add-button').click();

					expect(settingsAddController.show).not.toHaveBeenCalled();
				});

				it('should initialize add service controller on initialize', function () {
					controller.initialize();

					expect(settingsAddController.initialize).toHaveBeenCalled();
				});

				it('should update list of services on add', function () {
					addService('Service');

					expect(page.serviceList.count()).toBe(1);
				});

				it('should show new service settings', function () {
					loadServices('Server 1');

					addService('Server 2');

					expect(page.serviceList.serviceAt(0)).not.toHaveClass('active');
					expect(page.serviceList.serviceAt(1)).toHaveClass('active');
				});

				it('should prompt to save before switching to another service', function () {
					loadServices('Server 1');
					addService('Server 2');

					page.serviceList.selectServiceAt(0);

					expect(savePrompt.show).toHaveBeenCalledWith('Server 2');
				});

				it('should not switch if prompt to save shown', function () {
					loadServices('Server 1');
					addService('Server 2');
					var newServiceIndex = page.serviceList.getSelectedIndex();

					page.serviceList.selectServiceAt(0);

					expect(page.serviceList.getSelectedIndex()).toBe(newServiceIndex);
				});

				it('should remove new service if changes discarded', function () {
					loadServices('Server 1');

					savePrompt.removeSelected.dispatch();

					expect(page.serviceList.count()).toBe(0);
				});

				it('should hide prompt if new service changes discarded', function () {
					loadServices('Server 1');

					savePrompt.removeSelected.dispatch();

					expect(savePrompt.hide).toHaveBeenCalled();
					expect(savePrompt.show).not.toHaveBeenCalled();
				});

				it('should not show save prompt after removing service', function () {
					loadServices('Server 1');
					addService('Server 2');

					page.serviceList.selectServiceAt(0);
					page.removeWindow.remove();

					expect(savePrompt.show.callCount).toBe(1);
				});

				it('should not switch if prompt to save shown', function () {
					loadServices('Server 1');
					addService('Server 2');
					var newServiceIndex = page.serviceList.getSelectedIndex();

					page.serviceList.selectServiceAt(0);

					expect(page.serviceList.getSelectedIndex()).toBe(newServiceIndex);
				});

				it('should disable add button if new service not saved yet', function () {
					addService('Service');

					expect(page.isAddButtonEnabled()).toBeFalsy();
				});

				it('should enable add button if new service removed', function () {
					addService('Service');

					savePrompt.removeSelected.dispatch();

					expect(page.isAddButtonEnabled()).toBeTruthy();
				});

			});

			describe('Removing service', function () {

				page.removeWindow = {
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
					page.removeWindow.hide();
				});

				it('should show confirmation dialog', function () {
					expect(page.removeWindow.isShown()).toBeFalsy();

					page.removeWindow.show();

					expect(page.removeWindow.isShown()).toBeTruthy();
				});

				it('should show service name in modal window', function () {
					loadServices('some name');

					page.removeWindow.show();

					expect(page.removeWindow.serviceName()).toBe('some name');
				});

				it('should close modal window', function () {
					loadServices('service');
					page.removeWindow.show();

					page.removeWindow.remove();

					expect(page.removeWindow.isShown()).toBeFalsy();
				});

				it('should remove service', function () {
					loadServices('service');
					page.removeWindow.show();

					page.removeWindow.remove();

					expect(page.serviceList.count()).toBe(0);
				});

				it('should dispatch settingsChanged', function () {
					loadServices('service');
					page.removeWindow.show();
					var settingsChangedSpy = spyOnSignal(controller.settingsChanged);

					page.removeWindow.remove();

					expect(settingsChangedSpy).toHaveBeenDispatched();
				});

				it('should select next in list after remove', function () {
					loadServices('service 1', 'service 2', 'service 3');
					page.serviceList.selectServiceAt(1);
					page.removeWindow.show();

					page.removeWindow.remove();

					expect(page.serviceList.getSelectedIndex()).toBe(1);
				});

				it('should select previous in list if last removed', function () {
					loadServices('service 1', 'service 2', 'service 3');
					page.serviceList.selectServiceAt(2);
					page.removeWindow.show();

					page.removeWindow.remove();

					expect(page.serviceList.getSelectedIndex()).toBe(1);
				});

				it('should not display settings after removing last one', function () {
					loadServices('single service');
					page.removeWindow.show();

					page.removeWindow.remove();

					expect(page.getServiceName()).toBe('');
					expect(getSettingsFrame().src).toBe('about:blank');
				});

			});
		});
	});