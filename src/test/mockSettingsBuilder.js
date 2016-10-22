define(function() {

	'use strict';
	
	var MockSettingsBuilder = function() {
		this.settings = {
			baseUrl: 'mocks',
			url: 'http://www.example.com/',
			name: 'service name',
			icon: 'mocks/icon.png',
			logo: 'mocks/icon.png',
			disabled: false
		};
		this.create = function() {
			return {
				baseUrl: this.settings.baseUrl,
				url: this.settings.url,
				name: this.settings.name,
				icon: this.settings.icon,
				logo: this.settings.logo,
				disabled: this.settings.disabled
			};
		};
		this.withName = function(name) {
			this.settings.name = name;
			return this;
		};
		this.withBaseUrl = function(url) {
			this.settings.baseUrl = url;
			return this;
		};
		this.withIcon = function(icon) {
			this.settings.icon = icon;
			return this;
		};
		this.withLogo = function(logo) {
			this.settings.logo = logo;
			return this;
		};
		this.isDisabled = function() {
			this.settings.disabled = true;
			return this;
		};
	};

	return MockSettingsBuilder;
});
