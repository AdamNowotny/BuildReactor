define(['common/timer', 'jquery'], function (Timer, $) {

	'use strict';

	var alertTimer = new Timer();
	alertTimer.on.elapsed.add(function () {
		$('.alert-saved .alert').removeClass('in');
	});

	function show() {
		$('.alert-saved .alert').addClass('in');
		alertTimer.start(3);
	}

	return {
		show: show
	};
});