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
		};
		
		TeamcityBuildService.settings = function () {
			return {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				logo: 'teamcity/logo.png',
				projects: [],
				urlHint: 'http://teamcity.jetbrains.com/'
			};
		};

		var projects = function (selectedPlans) {
			var finished = new Signal();
			finished.memorize = true;
			request.buildTypes(this.settings).addOnce(function (result) {
				if (result.error) {
					finished.dispatch({ error: result.error	});
				}
				var templateData = createTemplateData(result.response, selectedPlans);
				finished.dispatch({	projects: templateData });
			});
			return finished;
		};

		var updateAll = function () {
			var completed = new Signal();
			completed.memorize = true;
			if (!this.settings.projects) {
				completed.dispatch();
				return completed;
			}
			var that = this;
			this.settings.projects.forEach(function (id, index) {
				var build;
				if (that.builds[id]) {
					build = that.builds[id];
				} else {
					build = new Build(id, that.settings);
					that.builds[id] = build;
					that.observeBuild(build);
				}
				build.update().addOnce(function () {
					completed.dispatch();
				});
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
							selected: selectedProjects.indexOf(d.id) > -1,
							webUrl: d.webUrl
						};
					})
				};
			}
		}

		TeamcityBuildService.prototype = {
			projects: projects,
			updateAll: updateAll
		};

		return TeamcityBuildService;
	});