define(function () {
	'use strict';
	
	function update(config) {
		config = config || {};
		config.columns = config.columns || 2;
		config.fullWidthGroups = (typeof config.fullWidthGroups === 'boolean') ? config.fullWidthGroups : true;
		return config ? config : { columns: 2, fullWidthGroups: true };
	}

	return {
		update: update
	};
});
