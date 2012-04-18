define(function () {

	var types = [
		{
			typeName: 'Atlassian Bamboo',
			icon: 'icon.png',
			baseUrl: 'src/bamboo'
		},
		{
			typeName: 'CruiseControl',
			icon: 'icon.png',
			baseUrl: 'src/cruisecontrol'
		}
	];

	var getAll = function () {
		return types;
	};

	var createSettingsFor = function (name) {
		var typeInfo = getByName(name);
		var newSettings = {
			typeName: name,
			icon: typeInfo.icon,
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