define(function () {
	'use strict';
	
	function update(config) {
		config.version = 2;
		config.services.forEach(updateService);
		return config;
	}

	function updateService(service) {
		if (service.typeName === 'ThoughtWorks GO') {
			service.typeName = 'GoCD';
		}
	}

	return {
		update: update
	};
});
