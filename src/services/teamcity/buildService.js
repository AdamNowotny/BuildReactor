define([
	'services/buildService',
	'services/teamcity/teamcityRequest',
	'services/teamcity/teamcityBuild',
	'signals',
	'jquery'
], function (BuildService, request, Build, Signal, $) {

		'use strict';

		var TeamcityBuildService = function (settings) {
			$.extend(this, new BuildService(settings));
			this.Build = Build;
		};

		TeamcityBuildService.settings = function () {
			return {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				logo: 'teamcity/logo.png',
				projects: [],
				url: '',
				urlHint: 'http://teamcity.jetbrains.com/',
				username: '',
				password: '',
				updateInterval: 60
			};
		};

		TeamcityBuildService.prototype.projects = function (selectedPlans) {
			var completed = new Signal();
			completed.memorize = true;
			request.buildTypes(this.settings).addOnce(function (result) {
				if (result.error) {
					completed.dispatch({ error: result.error });
				} else {
					try {
						var templateData = createTemplateData(result.response, selectedPlans);
						completed.dispatch({ projects: templateData });
					} catch (ex) {
						completed.dispatch({ error: { name: 'ParseError', message: 'Unrecognized response'}});
					}
				}
			});
			return completed;
		};

		function createTemplateData(buildTypesJson, selectedProjects) {
			if (!buildTypesJson.buildType) {
				return { items: [] };
			} else {
				return {
					items: buildTypesJson.buildType.map(function (d, i) {
						return {
							id: d.id,
							name: d.name,
							group: d.projectName,
							enabled: true,
							selected: selectedProjects.indexOf(d.id) > -1
						};
					})
				};
			}
		}

		return TeamcityBuildService;
	});