define(function () {

	var types = [
		{
			typeName: 'Atlassian Bamboo',
			baseUrl: 'bamboo'
		},
		{
			typeName: 'CCTray Generic',
			baseUrl: 'cctray'
		}
	];

	var getAll = function () {
		return types;
	};

	var createSettingsFor = function (name) {
		var typeInfo = getByName(name);
		var newSettings = {
			typeName: name,
			baseUrl: typeInfo.baseUrl
		};
		return newSettings;
	};

	var getByName = function (name) {
		for (var i = 0; i < types.length; i++) {
			if (types[i].typeName === name) {
				return types[i];
			}
		}
	};

	return {
		getAll: getAll,
		createSettingsFor: createSettingsFor
	};
});