define([
		'jquery',
		'src/settingsPageController',
		'src/settingsAddController',
		'src/settings/serviceSettings',
		'src/settings/frame',
		'src/settings/serviceList',
		'src/settings/savePrompt',
		'src/settings/removePrompt',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals',
		'src/Timer'
	], function ($, controller, settingsAddController, serviceSettings, frame, serviceList, savePrompt, removePrompt, MockSettingsBuilder, jasmineSignals, Timer) {
		describe('SettingsPageController', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			var page = {
				getServiceName: function () {
					return $('#service-name').text();
				},
				setServiceName: function (name) {
					return $('#service-name').text(name);
				},
				isAddButtonEnabled: function () {
					return !$('#service-add-button').hasClass('disabled');
				},
				removeService: function () {
					$('#service-remove-button').click();
				},
				addService: function () {
					$('#service-add-button').click();
				}
			};

			var spyServiceListGetSelectedName;
			var spyServiceSettingsGetAll;
			var spyServiceSettingsGetByIndex;

			beforeEach(function () {
				jasmine.getFixtures().load('settingsPageControllerFixture.html');
				spyOn(settingsAddController, 'show');
				spyOn(settingsAddController, 'initialize');

				spyOn(savePrompt, 'initialize');
				spyOn(savePrompt, 'show');
				spyOn(savePrompt, 'hide');

				spyOn(removePrompt, 'initialize');
				spyOn(removePrompt, 'show');
				spyOn(removePrompt, 'hide');

				spyOn(frame, 'initialize');
				spyOn(frame, 'show');
				spyOn(frame, 'showEmpty');

				spyOn(serviceList, 'load');
				spyOn(serviceList, 'update');
				spyOn(serviceList, 'add');
				spyOn(serviceList, 'selectItem');
				spyServiceListGetSelectedName = spyOn(serviceList, 'getSelectedName');

				spyOn(serviceSettings, 'load');
				spyOn(serviceSettings, 'clear');
				spyOn(serviceSettings, 'add');
				spyServiceSettingsGetByIndex = spyOn(serviceSettings, 'getByIndex');
				spyServiceSettingsGetAll = spyOn(serviceSettings, 'getAll');
				spyOn(serviceSettings, 'remove');

				controller.initialize();
			});

			var createItem = function (index, name) {
				var html = '<li><a href="#">' + name + '</a></li>';
				var item = $(html);
				item.data('service-index', index);
				return item[0];
			};

			var createSettings = function (name) {
				return new MockSettingsBuilder().withName(name).create();
			};

			it('should initialize components on initialize', function () {
				controller.initialize();

				expect(frame.initialize).toHaveBeenCalled();
				expect(removePrompt.initialize).toHaveBeenCalled();
				expect(savePrompt.initialize).toHaveBeenCalled();
				expect(settingsAddController.initialize).toHaveBeenCalled();
			});

			it('should display list of services', function () {
				var mockSettings1 = new MockSettingsBuilder().withName('service 1').create();
				var mockSettings2 = new MockSettingsBuilder().withName('service 2').create();
				var settings = [mockSettings1, mockSettings2];

				controller.load(settings);

				expect(serviceList.load).toHaveBeenCalledWith(settings);
				expect(serviceSettings.load).toHaveBeenCalledWith(settings);
			});

			it('should show service settings page on itemSelected', function () {
				var serviceInfo = new MockSettingsBuilder()
					.withName('service name')
					.withSettingsPage('page1.html')
					.create();
				var item = createItem(0, 'service name');
				spyServiceSettingsGetByIndex.andReturn(serviceInfo);

				serviceList.itemSelected.dispatch(item);

				expect(frame.show).toHaveBeenCalledWith(serviceInfo);
			});

			it('should update service name when selected', function () {
				spyServiceSettingsGetByIndex.andReturn(createSettings('Service name'));

				serviceList.itemSelected.dispatch(createItem(2, 'Service name'));

				expect($('#service-name')).toHaveText('Service name');
			});

			it('should signal settingsChanged when settings saved', function () {
				var newServiceSettings = new MockSettingsBuilder().create();
				var settings = [createSettings('service 1'), newServiceSettings];
				var spySettingsChanged = spyOnSignal(controller.settingsChanged).matchingValues(settings);
				spyServiceSettingsGetAll.andReturn(settings);

				frame.saved.dispatch(newServiceSettings);

				expect(spySettingsChanged).toHaveBeenDispatched();
			});

			it('should show alert when settings saved', function () {
				spyOn(Timer.prototype, 'start').andCallFake(function () {
					expect('#alert-saved').toBeVisible();
					this.elapsed.dispatch();
				});
				var mockSettings = new MockSettingsBuilder().create();

				controller.settingsChanged.dispatch(mockSettings);

				expect('#alert-saved').not.toBeVisible();
			});

			it('should fail if subcontroller does not implement required API', function () {
				// TODO implement test
			});

			it('should not display name after services cleared', function () {
				page.setServiceName('service name');

				serviceSettings.cleared.dispatch();

				expect(page.getServiceName()).toBe('');
			});

			it('should display empty page after services cleared', function () {
				serviceSettings.cleared.dispatch();

				expect(frame.showEmpty).toHaveBeenCalled();
			});

			describe('Adding service', function () {

				function addService(name) {
					var serviceInfo = new MockSettingsBuilder().withName(name).create();
					settingsAddController.serviceAdded.dispatch(serviceInfo);
					return serviceInfo;
				}

				it('should show dialog when adding service', function () {
					page.addService();

					expect(settingsAddController.show).toHaveBeenCalled();
				});

				it('should not show dialog if button disabled', function () {
					$('#service-add-button').addClass('disabled');

					page.addService();

					expect(settingsAddController.show).not.toHaveBeenCalled();
				});

				it('should add new service to list', function () {
					var serviceInfo = addService('Service');

					expect(serviceList.add).toHaveBeenCalledWith(serviceInfo);
				});

				it('should prompt to save before switching to another service', function () {
					addService('Server 2');
					spyServiceListGetSelectedName.andReturn('Server 2');

					serviceList.itemClicked.dispatch(createItem(0, 'Server 1'));

					expect(savePrompt.show).toHaveBeenCalledWith('Server 2');
				});

				it('should not switch if prompt to save shown', function () {
					addService('Server 2');

					serviceList.itemClicked.dispatch(createItem(0, 'Server 1'));

					expect(serviceList.selectItem).not.toHaveBeenCalled();
				});

				it('should remove new service if changes discarded', function () {
					savePrompt.removeSelected.dispatch();

					expect(serviceList.update).toHaveBeenCalled();
				});

				it('should hide prompt if new service changes discarded', function () {
					savePrompt.removeSelected.dispatch();

					expect(savePrompt.hide).toHaveBeenCalled();
					expect(savePrompt.show).not.toHaveBeenCalled();
				});

				it('should not show save prompt after removing service', function () {
					spyServiceSettingsGetByIndex.andReturn(createSettings('Server 2'));
					addService('Server 2');

					removePrompt.removeSelected.dispatch();
					serviceList.itemSelected.dispatch(createItem(0, 'Server 1'));

					expect(savePrompt.show.callCount).toBe(0);
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

				it('should show confirmation dialog before removing', function () {
					spyServiceListGetSelectedName.andReturn('some name');

					page.removeService();

					expect(removePrompt.show).toHaveBeenCalledWith('some name');
				});

				it('should remove service on removeSelected', function () {
					removePrompt.removeSelected.dispatch();

					expect(serviceList.update).toHaveBeenCalled();
					expect(serviceSettings.remove).toHaveBeenCalled();
				});

				it('should dispatch settingsChanged after removing service', function () {
					var settingsChangedSpy = spyOnSignal(controller.settingsChanged);

					removePrompt.removeSelected.dispatch();

					expect(settingsChangedSpy).toHaveBeenDispatched();
				});

			});
		});
	});