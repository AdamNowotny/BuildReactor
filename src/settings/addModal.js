define([
	'signals',
	'jquery',
	'hbs!templates/addModalService',
	'jqueryTools',
	'bootstrap'
], function (signals, $, addModalServiceTemplate) {

	'use strict';

	var on = {
		selected: new signals.Signal()
	};
	var scrollableApi;
	var serviceTypeName;
	var serviceTypes;

	var initialize = function (serviceSettings) {
		serviceTypeName = undefined;
		scrollableApi = undefined;
		serviceTypes = serviceSettings;
		renderServiceTypes();
		$('#service-add-wizard .thumbnails a').click(serviceAddSelect);
		$('#service-add-form').submit(function () {
			serviceAdd();
			return false;
		});
	};

	var renderServiceTypes = function () {
		$('#service-add-list').html(addModalServiceTemplate({ services: serviceTypes }));
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
		serviceTypeName = $(sender.currentTarget).closest('a').data('service');
		scrollableApi.next();
	};

	var serviceAdd = function () {
		if ($('#service-add-wizard .btn-primary').hasClass('disabled')) {
			return;
		}
		hide();
		var selected = serviceTypes.filter(function (d) {
			return d.typeName === serviceTypeName;
		})[0];
		selected.name = $('#service-add-name').val();
		on.selected.dispatch(selected);
	};

	return {
		initialize: initialize,
		show: show,
		on: on
	};
});