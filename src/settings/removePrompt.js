define([
		'signals',
		'jquery',
		'bootstrap'
], function (signals, $) {

	'use strict';

	var removeSelected = new signals.Signal();

	function initialize() {
		$('#service-remove-modal .btn-danger').click(function () {
			hide();
			removeSelected.dispatch();
		});
	}

	function show(serviceName) {
		$('#service-remove-modal .service-name').html(serviceName);
		$('#service-remove-modal').modal();
	}

	function hide() {
		$('#service-remove-modal').modal('hide');
	}

	return {
		initialize: initialize,
		show: show,
		hide: hide,
		removeSelected: removeSelected
	};
});