define(function () {

	'use strict';
	
	var MockSettingsBuilder = function () {
		this.settings = {
			typeName: 'service type',
			baseUrl: 'mocks',
			url: 'http://www.example.com/',
			name: 'service name'
		};
		this.create = function () {
			return {
				baseUrl: this.settings.baseUrl,
				url: this.settings.url,
				name: this.settings.name
			};
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