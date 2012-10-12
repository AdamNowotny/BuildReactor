define(function () {

	'use strict';

	function service(settings) {
		return 'services/' + settings.baseUrl + '/buildService';
	}

	function icon(iconUrl) {
		return 'src/services/' + iconUrl;
	}
	
	function logo(logoUrl) {
		return 'src/services/' + logoUrl;
	}

	return {
		service: service,
		icon: icon,
		logo: logo
	};
});