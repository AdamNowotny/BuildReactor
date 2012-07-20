define(function () {

	'use strict';
	
	var MockSettingsBuilder = function () {
		this.settings = {
			baseUrl: 'mocks',
			url: 'http://www.example.com/',
			name: 'service name'
		};
		this.create = function () {
			return this.settings;
		};
		this.withName = function (name) {
			this.settings.name = name;
			return this;
		};
		this.withBaseUrl = function (url) {
			this.settings.baseUrl = url;
			return this;
		};
	};

	return MockSettingsBuilder;
});