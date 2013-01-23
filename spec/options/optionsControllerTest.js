define([
		'jquery',
		'options/optionsController',
		'options/addService',
		'options/serviceSettings',
		'options/serviceOptionsPage',
		'options/serviceList',
		'bootbox',
		'options/alert',
		'spec/mocks/mockSettingsBuilder',
		'jasmineSignals'
	], function ($, controller, addService, serviceSettings, serviceOptionsPage, serviceList, bootbox, alert, MockSettingsBuilder, spyOnSignal) {

		'use strict';
		
		describe('optionsController', function () {

			var spyServiceListGetSelectedName;
			var spyServiceListUpdate;
			var spyServiceSettingsGetAll;
			var spyServiceSettingsGetByIndex;
			var spyServiceSettingsUpdate;
			var spyBootboxPrompt;
			var spyBootboxDialog;

			beforeEach(function () {
				jasmine.getFixtures().load('optionsControllerFixture.html');
				spyOn(addService, 'show');
				spyOn(addService, 'hide');
				spyOn(addService, 'initialize');

				spyOn(bootbox, 'setIcons');
				spyBootboxPrompt = spyOn(bootbox, 'prompt');
				spyBootboxDialog = spyOn(bootbox, 'dialog');

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
				addService.on.selected.removeAll();
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
				$('.service-action').hide();
				spyServiceSettingsGetByIndex.andReturn(createSettings('Service name'));

				serviceList.itemSelected.dispatch(createItem(2, 'Service name'));

				expect($('.service-action')).toBeVisible();
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
				$('.service-action').show();

				serviceSettings.cleared.dispatch();

				expect($('.service-action')).toBeHidden();
			});

			it('should display empty page after services cleared', function () {
				serviceSettings.cleared.dispatch();

				expect(serviceOptionsPage.hide).toHaveBeenCalled();
			});

			it('should update services if service disabled', function () {
				spyOn(chrome.extension, 'sendMessage');
				
				$('.toggle-button .labelLeft').click();

				expect(chrome.extension.sendMessage).toHaveBeenCalled();
			});

			it('should not send update if disabled service loaded', function () {
				var settings = [new MockSettingsBuilder().isDisabled().create()];
				spyOn(chrome.extension, 'sendMessage');

				controller.load(settings);

				expect(chrome.extension.sendMessage).not.toHaveBeenCalled();
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
					$('.service-action').show();

					$('#service-add-button').click();

					expect($('.service-action')).toBeHidden();
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

				it('should toggle enabled when adding service', function () {
					$('.toggle-button input').attr('checked', false);
					add('Server 2');
					spyServiceListGetSelectedName.andReturn('Server 2');

					serviceList.itemClicked.dispatch(createItem(0, 'Server 1'));

					expect($('.toggle-button input')).toBeChecked();
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

					expect(bootbox.dialog).toHaveBeenCalled();
				});

				it('should not switch if prompt to save shown', function () {
					add('Server 2');

					serviceList.itemClicked.dispatch(createItem(0, 'Server 1'));

					expect(serviceList.selectItem).not.toHaveBeenCalled();
				});

				it('should remove new service if changes discarded', function () {
					add('Server 2');
					spyServiceListGetSelectedName.andReturn('Server 2');
					spyServiceListUpdate.reset();
					spyBootboxDialog.andCallFake(function (message, buttons, options) {
						buttons[1].callback();
					});

					serviceList.itemClicked.dispatch(createItem(0, 'Server 1'));

					expect(serviceList.update).toHaveBeenCalled();
				});

				it('should not show save prompt after removing service', function () {
					spyServiceSettingsGetByIndex.andReturn(createSettings('Server 2'));
					add('Server 2');
					spyBootboxDialog.andCallFake(function (message, buttons, options) {
						buttons[1].callback();
					});
					$('#service-remove-button').click();
					spyBootboxDialog.reset();

					serviceList.itemSelected.dispatch(createItem(0, 'Server 1'));

					expect(bootbox.dialog).not.toHaveBeenCalled();
				});

				it('should disable add button if new service not saved yet', function () {
					add('Service');

					expect($('#service-add-button')).toHaveClass('disabled');
				});

				it('should enable add button if service saved', function () {
					$('#service-add-button').addClass('disabled');

					serviceOptionsPage.on.updated.dispatch(createSettings('service'));
					
					expect($('#service-add-button')).not.toHaveClass('disabled');
				});

				it('should deactivate add button if service selected', function () {
					$('#service-add-button').addClass('btn-primary');
					var serviceInfo = new MockSettingsBuilder().create();
					var item = createItem(0, 'service name');
					spyServiceSettingsGetByIndex.andReturn(serviceInfo);

					serviceList.itemSelected.dispatch(item);

					expect($('#service-add-button')).not.toHaveClass('btn-primary');
				});

				it('should hide new service list if service selected', function () {
					var serviceInfo = new MockSettingsBuilder().create();
					var item = createItem(0, 'service name');
					spyServiceSettingsGetByIndex.andReturn(serviceInfo);

					serviceList.itemSelected.dispatch(item);

					expect(addService.hide).toHaveBeenCalled();
				});

				it('should enable add button if new service removed', function () {
					spyServiceSettingsGetByIndex.andReturn(createSettings('Server 2'));
					add('Server 2');
					spyBootboxDialog.andCallFake(function (message, buttons, options) {
						buttons[1].callback();
					});
					$('#service-remove-button').click();
					spyBootboxDialog.reset();

					serviceList.itemSelected.dispatch(createItem(0, 'Server 1'));

					expect($('#service-add-button')).not.toHaveClass('disabled');
				});

				it('should not send update if disabled new service', function () {
					spyOn(chrome.extension, 'sendMessage');

					add('Server 2');
					$('.toggle-button .labelLeft').click();

					expect(chrome.extension.sendMessage).not.toHaveBeenCalled();
				});

				it('should save disabled status on save', function () {
					spyOn(chrome.extension, 'sendMessage');
					spyServiceSettingsUpdate.andCallFake(function (oldSettings, newSettings) {
						expect(newSettings.disabled).toBe(true);
					});
					add('Server 2');
					$('.toggle-button .labelLeft').click();
					
					var newServiceSettings = new MockSettingsBuilder().isDisabled().create();
					serviceOptionsPage.on.updated.dispatch(newServiceSettings);

					expect(chrome.extension.sendMessage).toHaveBeenCalled();
				});

			});

			describe('Removing service', function () {

				it('should show confirmation dialog before removing', function () {
					spyServiceListGetSelectedName.andReturn('some name');

					$('#service-remove-button').click();

					expect(bootbox.dialog).toHaveBeenCalled();
				});

				it('should remove service on removeSelected', function () {
					spyBootboxDialog.andCallFake(function (message, buttons, options) {
						buttons[1].callback();
					});

					$('#service-remove-button').click();

					expect(serviceList.update).toHaveBeenCalled();
					expect(serviceSettings.remove).toHaveBeenCalled();
				});

				it('should dispatch settingsChanged after removing service', function () {
					spyOn(chrome.extension, 'sendMessage').andCallFake(function (message) {
						expect(message.name).toBe('updateSettings');
					});

					spyBootboxDialog.andCallFake(function (message, buttons, options) {
						buttons[1].callback();
					});
					
					$('#service-remove-button').click();

					expect(chrome.extension.sendMessage).toHaveBeenCalled();
				});

			});

			describe('Rename', function () {

				it('should update settings', function () {
					spyServiceSettingsUpdate.andCallFake(function (settings, sameSettings) {
						expect(settings.name).toBe('new name');
					});
					spyBootboxPrompt.andCallFake(function (message, cancel, ok, callback, value) {
						callback('new name');
					});

					$('#service-rename-action').click();
					
					expect(serviceSettings.update).toHaveBeenCalled();
				});

				it('should update displayed service name', function () {
					$('.service-name').text('old');
					spyBootboxPrompt.andCallFake(function (message, cancel, ok, callback, value) {
						callback('new2');
					});

					$('#service-rename-action').click();

					expect($('.service-name')).toHaveHtml('new2');
				});

				it('should refresh menu', function () {
					spyBootboxPrompt.andCallFake(function (message, cancel, ok, callback, value) {
						callback('new name');
					});

					$('#service-rename-action').click();

					expect(serviceList.update).toHaveBeenCalled();
				});
			});
		});
	});