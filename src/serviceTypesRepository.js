define(function () {

	var types = [
		{
			typeName: 'Atlassian Bamboo',
			icon: 'icon.png',
			baseUrl: 'src/bamboo',
			service: 'bambooBuildService',
			settingsController: 'bambooSettingsController',
			settingsPage: 'bambooOptions.html'
		},
		{
			typeName: 'CruiseControl',
			icon: 'icon.png',
			baseUrl: 'src/cruisecontrol',
			service: 'ccBuildService',
			settingsController: 'ccSettingsController',
			settingsPage: 'ccOptions.html'
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
			baseUrl: typeInfo.baseUrl,
			service: typeInfo.service,
			settingsController: typeInfo.settingsController,
			settingsPage: typeInfo.settingsPage
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