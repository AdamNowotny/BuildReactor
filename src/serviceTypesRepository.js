define(function () {

	'use strict';
	
	var types = [
		{
			typeName: 'Atlassian Bamboo',
			baseUrl: 'bamboo',
			icon: 'bamboo/icon.png'
		},
		{
			typeName: 'CCTray Generic',
			baseUrl: 'cctray',
			icon: 'cctray/icon.png'
		}
	];

	var getAll = function () {
		return types;
	};

	var getByName = function (name) {
		for (var i = 0; i < types.length; i++) {
			if (types[i].typeName === name) {
				return types[i];
			}
		}
	};

	return {
		getAll: getAll
	};
});