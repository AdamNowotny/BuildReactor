define([
		'jquery',
		'options/optionsController',
		'options/addService',
		'options/serviceSettings',
		'options/serviceOptionsPage',
		'options/serviceList',
		'options/savePrompt',
		'options/removePrompt',
		'options/alert',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals'
	], function ($, controller, addService, serviceSettings, serviceOptionsPage, serviceList, savePrompt, removePrompt, alert, MockSettingsBuilder, spyOnSignal) {

		'use strict';
		
		describe('optionsController', function () {

			var page = {
				isAddButtonEnabled: function (enable) {
					if (enable === undefined) {
						return !$('#service-add-button').hasClass('disabled');
					} else {
						$('#service-add-button').toggleClass('disabled', !enable);
						return undefined;
					}
				},
				isAddButtonActive: function (enable) {
					if (enable === undefined) {
						return $('#service-add-button').hasClass('btn-primary');
					} else {
						$('#service-add-button').toggleClass('btn-primary');
					}
				},
				removeService: function () {
					$('#service-remove-button').click();
				}
			};

			var spyServiceListGetSelectedName;
			var spyServiceListUpdate;
			var spyServiceSettingsGetAll;
			var spyServiceSettingsGetByIndex;
			var spyServiceSettingsUpdate;

			beforeEach(function () {
				jasmine.getFixtures().load('optionsControllerFixture.html');
				spyOn(addService, 'show');
				spyOn(addService, 'hide');
				spyOn(addService, 'initialize');

				spyOn(savePrompt, 'initialize');
				spyOn(savePrompt, 'show');
				spyOn(savePrompt, 'hide');

				spyOn(removePrompt, 'initialize');
				spyOn(removePrompt, 'show');
				spyOn(removePrompt, 'hide');

				spyOn(alert, 'show');

				spyOn(serviceOptionsPage, 'initialize');
				spyOn(serviceOptionsPage, 'show');
				spyOn(serviceOptionsPage, 'hide');

				spyOn(serviceList, 'load');
				spyServiceListUpdate = spyOn(serviceList, 'update');
				spyOn(serviceList, 'selectLast');
				spyOn(serviceList, 'selectItem');
				spyServiceListGetSelectedName = spyOn(serviceList, 'getSelectedName');

				spyOn(serviceSettings, 'load');
				spyOn(serviceSettings, 'clear');
				spyOn(serviceSettings, 'add');
				spyServiceSettingsGetByIndex = spyOn(serviceSettings, 'getByIndex');
				spyServiceSettingsGetAll = spyOn(serviceSettings, 'getAll');
				spyOn(serviceSettings, 'remove');
				spyServiceSettingsUpdate = spyOn(serviceSettings, 'update');

				controller.initialize();
			});

			afterEach(function () {
				savePrompt.removeSelected.removeAll();
				addService.on.selected.removeAll();
				removePrompt.removeSelected.removeAll();
				serviceSettings.cleared.removeAll();
				serviceList.itemClicked.removeAll();
				serviceList.itemSelected.removeAll();
				serviceOptionsPage.on.updated.removeAll();
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

				expect(serviceOptionsPage.initialize).toHaveBeenCalled();
				expect(removePrompt.initialize).toHaveBeenCalled();
				expect(savePrompt.initialize).toHaveBeenCalled();
				expect(addService.initialize).toHaveBeenCalled();
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
					.create();
				var item = createItem(0, 'service name');
				spyServiceSettingsGetByIndex.andReturn(serviceInfo);

				serviceList.itemSelected.dispatch(item);

				expect(serviceOptionsPage.show).toHaveBeenCalledWith(serviceInfo);
			});

			it('should update service name when selected', function () {
				spyServiceSettingsGetByIndex.andReturn(createSettings('Service name'));

				serviceList.itemSelected.dispatch(createItem(2, 'Service name'));

				expect($('.service-name')).toHaveHtml('Service name');
			});

			it('should show service actions when service selected', function () {
				$('.service-actions').hide();
				spyServiceSettingsGetByIndex.andReturn(createSettings('Service name'));

				serviceList.itemSelected.dispatch(createItem(2, 'Service name'));

				expect($('.service-actions')).toBeVisible();
			});

			it('should update settings', function () {
				var currentSettings = new MockSettingsBuilder().create();
				var newServiceSettings = new MockSettingsBuilder().create();
				spyServiceSettingsGetByIndex.andReturn(currentSettings);
				serviceList.itemSelected.dispatch(createItem(0, currentSettings.name));

				serviceOptionsPage.on.updated.dispatch(newServiceSettings);

				expect(serviceSettings.update).toHaveBeenCalledWith(currentSettings, newServiceSettings);
			});

			it('should update settings multiple times', function () {
				var settings1 = new MockSettingsBuilder().withName('1').create();
				var settings2 = new MockSettingsBuilder().withName('2').create();
				var settings3 = new MockSettingsBuilder().withName('3').create();
				spyServiceSettingsGetByIndex.andReturn(settings1);
				serviceList.itemSelected.dispatch(createItem(0, settings1.name));

				serviceOptionsPage.on.updated.dispatch(settings2);
				serviceOptionsPage.on.updated.dispatch(settings3);

				expect(serviceSettings.update).toHaveBeenCalledWith(settings1, settings2);
				expect(serviceSettings.update).toHaveBeenCalledWith(settings2, settings3);
			});

			it('should send message to main when settings updated', function () {
				var newServiceSettings = new MockSettingsBuilder().create();
				var settings = [createSettings('service 1'), newServiceSettings];
				spyOn(chrome.extension, 'sendMessage').andCallFake(function (message) {
					expect(message.name).toBe('updateSettings');
					expect(message.settings).toBe(settings);
				});
				spyServiceSettingsGetAll.andReturn(settings);

				serviceOptionsPage.on.updated.dispatch(newServiceSettings);

				expect(chrome.extension.sendMessage).toHaveBeenCalled();
			});

			it('should show alert when settings saved', function () {
				var mockSettings = new MockSettingsBuilder().create();

				serviceOptionsPage.on.updated.dispatch(mockSettings);

				expect(alert.show).toHaveBeenCalled();
			});

			it('should not display name after services cleared', function () {
				$('.service-actions').show();

				serviceSettings.cleared.dispatch();

				expect($('.service-actions')).toBeHidden();
			});

			it('should display add service page after services cleared', function () {
				serviceSettings.cleared.dispatch();

				expect(addService.show).toHaveBeenCalled();
			});

			describe('Adding service', function () {

				function add(name) {
					var serviceInfo = new MockSettingsBuilder().withName(name).create();
					addService.on.selected.dispatch(serviceInfo);
					return serviceInfo;
				}

				it('should hide service settings when adding service', function () {
					$('#service-add-button').click();

					expect(serviceOptionsPage.hide).toHaveBeenCalled();
				});

				it('should hide service actions when adding service', function () {
					$('.service-actions').show();

					$('#service-add-button').click();

					expect($('.service-actions')).toBeHidden();
				});

				it('should show services when adding service', function () {
					$('#service-add-button').click();

					expect(addService.show).toHaveBeenCalled();
				});

				it('should highlight button', function () {
					$('#service-add-button').click();

					expect($('#service-add-button')).toHaveClass('btn-primary');
				});

				it('should remove service highlight', function () {
					$('#service-add-button').click();

					expect(serviceList.selectItem).toHaveBeenCalledWith(null);
				});

				it('should not show if button disabled', function () {
					$('#service-add-button').addClass('disabled');

					$('#service-add-button').click();

					expect(addService.show).not.toHaveBeenCalled();
				});

				it('should prompt to save before switching to another service', function () {
					add('Server 2');
					spyServiceListGetSelectedName.andReturn('Server 2');

					serviceList.itemClicked.dispatch(createItem(0, 'Server 1'));

					expect(savePrompt.show).toHaveBeenCalledWith('Server 2');
				});

				it('should not switch if prompt to save shown', function () {
					add('Server 2');

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
					add('Server 2');

					removePrompt.removeSelected.dispatch();
					serviceList.itemSelected.dispatch(createItem(0, 'Server 1'));

					expect(savePrompt.show.callCount).toBe(0);
				});

				it('should disable add button if new service not saved yet', function () {
					add('Service');

					expect(page.isAddButtonEnabled()).toBeFalsy();
				});

				it('should enable add button if service saved', function () {
					page.isAddButtonEnabled(false);

					serviceOptionsPage.on.updated.dispatch(createSettings('service'));
					
					expect(page.isAddButtonEnabled()).toBeTruthy();
				});

				it('should deactivate add button if service selected', function () {
					page.isAddButtonActive(true);
					var serviceInfo = new MockSettingsBuilder().create();
					var item = createItem(0, 'service name');
					spyServiceSettingsGetByIndex.andReturn(serviceInfo);

					serviceList.itemSelected.dispatch(item);

					expect(page.isAddButtonActive()).toBeFalsy();
				});

				it('should hide new service list if service selected', function () {
					var serviceInfo = new MockSettingsBuilder().create();
					var item = createItem(0, 'service name');
					spyServiceSettingsGetByIndex.andReturn(serviceInfo);

					serviceList.itemSelected.dispatch(item);

					expect(addService.hide).toHaveBeenCalled();
				});

				it('should enable add button if new service removed', function () {
					add('Service');

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
					spyOn(chrome.extension, 'sendMessage').andCallFake(function (message) {
						expect(message.name).toBe('updateSettings');
					});

					removePrompt.removeSelected.dispatch();

					expect(chrome.extension.sendMessage).toHaveBeenCalled();
				});

			});

			describe('Rename', function () {

				beforeEach(function () {
					//jasmine.getFixtures().load('optionsControllerFixture.html');
				});

				afterEach(function () {
					$('#service-rename-modal').modal('hide');
				});

				it('should show current name when service selected', function () {
					spyServiceSettingsGetByIndex.andReturn(createSettings('Service name'));

					serviceList.itemSelected.dispatch(createItem(2, 'Service name'));

					expect($('#service-rename-modal input[type=text]')).toHaveValue('Service name');
				});

				it('should update name on submit', function () {
					spyOnSignal(serviceOptionsPage.on.updated);
					spyServiceSettingsUpdate.andCallFake(function (settings, sameSettings) {
						expect(settings.name).toBe('new name');
					});

					$('#service-rename-modal input').val('new name');
					$('#service-rename-modal button[type=submit]').click();

					expect(serviceSettings.update).toHaveBeenCalled();
				});

				it('should update service names', function () {
					$('.service-name').text('old');

					$('#service-rename-modal').modal();
					$('#service-rename-modal input').val('new2');
					$('#service-rename-modal form').submit();

					expect($('.service-name')).toHaveHtml('new2');
				});

				it('should hide modal', function () {
					$('#service-rename-modal').modal();

					$('#service-rename-modal form').submit();

					expect($('#service-rename-modal')).toBeHidden();
				});

				it('should focus on text input', function () {
					$('#service-rename-modal').modal();
					$('#service-rename-modal').trigger('shown');

					expect(document.activeElement).toHaveAttr('type', 'text');
				});

				it('should restore current name on show', function () {
					spyServiceSettingsGetByIndex.andReturn(createSettings('current name'));
					serviceList.itemSelected.dispatch(createItem(2, 'current name'));

					$('#service-rename-modal').modal();
					$('#service-rename-modal input').val('changed name');
					$('#service-rename-modal').modal('hide');
					$('#service-rename-modal').modal();
					$('#service-rename-modal').trigger('shown');

					expect($('#service-rename-modal input').val()).toBe('current name');
				});

				it('should refresh menu', function () {
					$('#service-rename-modal form').submit();

					expect(serviceList.update).toHaveBeenCalled();
				});
			});
		});
	});