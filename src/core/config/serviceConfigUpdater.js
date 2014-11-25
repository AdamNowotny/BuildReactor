define(function () {
	'use strict';
	
	function update(config) {
		return config ? config.map(updateService) : [];
	}

	function updateService(service) {
		if (service.typeName === 'ThoughtWorks GO') {
			service.typeName = 'GoCD';
		}
		return service;
	}

	return {
		update: update
	};
});
