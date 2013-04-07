define([
	'services/buildService',
    './buildbotBuild',
	'jquery',
	'services/request',
	'common/joinUrl'
], function (BuildService, BuildBotBuild, $, request, joinUrl) {

	'use strict';

	var BuildBotBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = BuildBotBuild;
	};

	BuildBotBuildService.settings = function () {
		return {
			typeName: 'BuildBot',
			baseUrl: 'buildbot',
			icon: 'buildbot/icon.png',
			logo: 'buildbot/logo.png',
			projects: [],
			urlHint: 'http://buildbot.buildbot.net/',
			url: '',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	BuildBotBuildService.prototype.availableBuilds = function () {
		return request.json({
			url: joinUrl(this.settings.url, 'json/builders'),
			username: this.settings.username,
			password: this.settings.password,
			parseHandler: parseAvailableBuilds
		});
	};

	function parseAvailableBuilds(apiJson) {
        var items = [];
        for (var builderName in apiJson) {
            if (apiJson.hasOwnProperty(builderName)) {
				var builder = apiJson[builderName];
                items.push({
                    id: builderName,
                    name: builderName,
                    group: builder.category,
                    enabled: true
                });
            }
        }

		return {
			items: items
		};
	}

	return BuildBotBuildService;
});
