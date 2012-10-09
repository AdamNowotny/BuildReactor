define(function () {

	'use strict';

	function service(settings) {
		return 'services/' + settings.baseUrl + '/buildService';
	}

	function icon(settings) {
		return 'src/services/' + settings.icon;
	}
	
	function logo(settings) {
		return 'src/services/' + settings.logo;
	}

	return {
		service: service,
		icon: icon,
		logo: logo
	};
});