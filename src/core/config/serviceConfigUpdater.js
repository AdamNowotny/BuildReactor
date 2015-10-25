define(function () {
	'use strict';
	
	function update(config) {
		return (config || []).map(updateVersion2);
	}

	function updateVersion2(service) {
		return {
			baseUrl: service.baseUrl,
      		projects: service.projects,
      		url: service.url,
      		username: service.username,
      		password: service.password,
      		updateInterval: service.updateInterval,
      		name: service.name,
      		disabled: service.disabled
		};
	}

	return {
		update: update
	};
});
