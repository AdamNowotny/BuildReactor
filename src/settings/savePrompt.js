define([
		'signals',
		'jquery',
		'bootstrap'
], function (signals, $) {

	'use strict';

	var removeSelected = new signals.Signal();

	function initialize() {
		$('#save-prompt .btn-danger').click(function () {
			removeSelected.dispatch();
		});
	}

	function show(serviceName) {
		$('#save-prompt .service-name').html(serviceName);
		$('#save-prompt').modal();
	}

	function hide() {
		$('#save-prompt').modal('hide');
	}

	return {
		initialize: initialize,
		show: show,
		hide: hide,
		removeSelected: removeSelected
	};
});