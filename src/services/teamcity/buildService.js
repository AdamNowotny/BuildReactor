define([
	'services/buildService',
	'services/teamcity/teamcityRequest',
	'signals',
	'jquery'
], function (BuildService, teamcityRequest, Signal, $) {

		'use strict';

		var GoBuildService = function (settings) {
			$.extend(this, new BuildService(settings));
		};
		
		GoBuildService.settings = function () {
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
			teamcityRequest.buildTypes(this.settings).addOnce(function (result) {
				if (result.error) {
					finished.dispatch({ error: result.error	});
				}
				var templateData = createTemplateData(result.response, selectedPlans);
				finished.dispatch({	projects: templateData });
			});
			return finished;
		};

		var updateAll = function () {
			//build

		};

		var activeProjects = function () {
			//var projectsInfo = values(this._selectedProjects).map(function (p) {
			//	return {
			//		name: p.projectName(),
			//		group: p.category(),
			//		isBroken: p.status() === 'Failure',
			//		url: p.url(),
			//		isBuilding: p.isBuilding()
			//	};
			//});
			//return {
			//	name: this.name,
			//	items: projectsInfo
			//};
		};

		function createTemplateData(buildTypesJson, selectedProjects) {
			
			if (!buildTypesJson.buildType) {
				return { items: [] };
			}
			var builds = buildTypesJson.buildType.map(function (d, i) {
				return {
					id: d.id,
					name: d.name,
					group: d.projectName,
					enabled: true,
					selected: selectedProjects.indexOf(d.id) > -1,
					webUrl: d.webUrl
				};
			});
			return {
				items: builds
			};
		}

		GoBuildService.prototype = {
			projects: projects,
			activeProjects: activeProjects,
			updateAll: updateAll
		};

		return GoBuildService;
	});