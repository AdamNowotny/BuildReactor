define([
	'services/buildService',
    './buildbotBuild',
	'jquery',
	'signals',
	'services/buildbot/buildbotRequest'
], function (BuildService, BuildBotBuild, $, Signal, buildbotRequest) {

	'use strict';

	var BuildBotBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = BuildBotBuild;
	};
	
	BuildBotBuildService.settings = function () {
		return {
			typeName: 'BuildBot',
			baseUrl: 'buildbot',
			icon: 'buildbot/logo.png',
			logo: 'buildbot/logo.png',
			projects: [],
			urlHint: 'http://trac.buildbot.org/'
		};
	};

	BuildBotBuildService.prototype.projects = function (selectedPlans) {
		var completed = new Signal();
		completed.memorize = true;
		var requestSettings = {
			url: this.settings.url,
			username: this.settings.username,
			password: this.settings.password
		};
		buildbotRequest.projects(requestSettings).addOnce(function (result) {
			if (result.error) {
				completed.dispatch({ error: result.error });
			} else {
				try {
					var templateData = createTemplateData(result.response, selectedPlans);
					completed.dispatch({ projects: templateData });
				} catch (ex) {
					completed.dispatch({ error: { name: 'ParseError', message: 'Unrecognized response ' + result.response}});
				}
			}
		});
		return completed;
	};

	function createTemplateData(apiJson, selectedProjects) {

        var items = [];
        var views = [];
        for (var builderName in apiJson) {
            if (apiJson.hasOwnProperty(builderName)) {
                items.push({
                    id: builderName,
                    name: builderName,
                    group: null,
                    enabled: true,
                    selected: selectedProjects.indexOf(builderName) > -1
                });
            }
        }

		return {
			items: items
		};
	}

	return BuildBotBuildService;
});
