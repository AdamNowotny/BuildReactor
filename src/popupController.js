define([
	'jquery',
	'hbs!templates/popup'
], function ($, popupTemplate) {

	'use strict';
	
	function show(state) {
		var html = popupTemplate({ services: state});
		$('.service-info-container').html(html);
	}

	return {
		show: show
	};
});
