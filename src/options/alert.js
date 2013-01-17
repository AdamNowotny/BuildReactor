define(['common/timer', 'jquery'], function (Timer, $) {

	'use strict';

	var alertTimer = new Timer();
	alertTimer.on.elapsed.add(function () {
		$('.alert-saved').addClass('alert-hide');
	});

	function show() {
		$('.alert-saved').removeClass('alert-hide');
		alertTimer.start(3);
	}

	return {
		show: show
	};
});