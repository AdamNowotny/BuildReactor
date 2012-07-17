define([
	'signals',
	'jquery'
], function (signals, $) {

	var loaded = new signals.Signal(),
		saved = new signals.Signal(),
		srcPrefix = 'src/',
		iframe,
		currentSettings;

	function initialize() {
		iframe = $('#settings-frame')[0];
	}

	var show = function (serviceInfo) {
		if (serviceInfo === currentSettings) {
			loaded.dispatch();
			return;
		}
		currentSettings = serviceInfo;
		iframe.onload = function () {
			loaded.dispatch();
			var controllerName = serviceInfo.baseUrl + '/settingsController';
			iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
				// executed in iframe context
				serviceSettingsController.settingsChanged.add(settingsChanged);
				serviceSettingsController.show(serviceInfo);
			});
		};
		$('#settings-frame').attr('src', srcPrefix + serviceInfo.baseUrl + '/options.html');
	};

	var settingsChanged = function (newSettings) {
		saved.dispatch(newSettings);
	};

	var showEmpty = function () {
		iframe.onload = function () {
			loaded.dispatch();
		};
		iframe.src = 'about:blank';
	};

	return {
		initialize: initialize,
		show: show,
		showEmpty: showEmpty,
		loaded: loaded,
		saved: saved,
		srcPrefix: function (value) {
			if (value === undefined) {
				return srcPrefix;
			}
			srcPrefix = value;
		}
	};
});