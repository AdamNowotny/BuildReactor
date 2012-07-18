define([
	'signals',
	'jquery',
	'text!./addModalService.hbs',
	'handlebars',
	'jqueryTools',
	'bootstrap'
], function (signals, $, serviceTemplateText, handlebars) {

	'use strict';

	var serviceTemplate = handlebars.compile(serviceTemplateText);

	var serviceAdded = new signals.Signal();
	var scrollableApi;
	var serviceTypeName;
	var typesRepository;

	var initialize = function (serviceTypesRepository) {
		if (!serviceTypesRepository) {
			throw {
				name: 'ArgumentUndefined',
				message: 'Supported service types must be specified'
			};
		}
		typesRepository = serviceTypesRepository;
		serviceTypeName = undefined;
		renderServiceTypes(typesRepository.getAll());
		scrollableApi = undefined;
		$('#service-add-wizard .thumbnails a').click(serviceAddSelect);
		$('#service-add-form').submit(function () {
			serviceAdd();
			return false;
		});
	};

	var renderServiceTypes = function (serviceTypes) {
		$('#service-add-list').html(serviceTemplate({ services: serviceTypes }));
	};

	var show = function () {
		if (!scrollableApi) {
			initializeModal();
		}
		scrollableApi.begin(0);
		$('#service-add-wizard .btn-primary').addClass('disabled');
		$('#service-add-name').val('');
		$('#service-add-wizard').modal();
	};

	var hide = function () {
		$('#service-add-wizard').modal('hide');
	};

	var getName = function () {
		return $('#service-add-name').val();
	};

	var initializeModal = function () {
		initializeScrollable();
		$('#service-add-wizard .btn-primary').click(serviceAdd);
		$('#service-add-name').on('input', function () {
			if ($(this).val() === '') {
				$('#service-add-wizard .btn-primary').addClass('disabled');
			} else {
				$('#service-add-wizard .btn-primary').removeClass('disabled');
			}
		});
	};

	var initializeScrollable = function () {
		var scrollable = $('.scrollable').scrollable().data('scrollable');
		scrollable.onBeforeSeek(function (event, index) {
			if (scrollable.getIndex() !== index) {
				$('#service-add-wizard .steps li.active').removeClass('active');
				$('#service-add-wizard .steps li').eq(index).addClass('active');
			}
		});
		scrollable.onSeek(function (event, index) {
			if (index === 1) {
				$('#service-add-name').focus();
			}
		});
		scrollableApi = scrollable;
	};

	var serviceAddSelect = function (sender) {
		serviceTypeName = sender.target.alt;
		scrollableApi.next();
	};

	var serviceAdd = function () {
		if ($('#service-add-wizard .btn-primary').hasClass('disabled')) {
			return;
		}
		hide();
		var newSettings = typesRepository.createSettingsFor(serviceTypeName);
		newSettings.name = getName();
		serviceAdded.dispatch(newSettings);
	};

	return {
		initialize: initialize,
		show: show,
		serviceAdded: serviceAdded
	};
});