define([
	'signals',
	'jquery',
	'hbs!templates/addModalService',
	'bootstrap'
], function (signals, $, addModalServiceTemplate) {

	'use strict';

	var on = {
		selected: new signals.Signal()
	};
	var serviceTypeName;
	var serviceTypes;
	var container;

	var initialize = function (selector, availableServices) {
		container = $(selector);
		serviceTypeName = undefined;
		serviceTypes = availableServices;
		$('.service-add-list ul', container).html(addModalServiceTemplate({ services: serviceTypes }));
		$('.thumbnails a', container).click(serviceAddSelect);
		$('.service-add-form', container).submit(function () {
			serviceAdd();
			return false;
		});
		$('.btn-primary', container).click(serviceAdd);
		$('#service-add-name', container).on('input', function () {
			if ($(this).val() === '') {
				$('.btn-primary', container).addClass('disabled');
			} else {
				$('.btn-primary', container).removeClass('disabled');
			}
		});
	};

	var show = function () {
		$('.btn-primary', container).addClass('disabled');
		$('#service-add-name', container).val('');
		container.show();
	};

	var hide = function () {
		container.hide();
	};

	var serviceAddSelect = function (sender) {
		serviceTypeName = $(sender.currentTarget).closest('a').data('service');
		$('#service-add-name', container).focus();
	};

	var serviceAdd = function () {
		if ($('.btn-primary', container).hasClass('disabled')) {
			return;
		}
		var selected = serviceTypes.filter(function (d) {
			return d.typeName === serviceTypeName;
		})[0];
		selected.name = $('#service-add-name', container).val();
		on.selected.dispatch(selected);
	};

	return {
		initialize: initialize,
		show: show,
		hide: hide,
		on: on
	};
});