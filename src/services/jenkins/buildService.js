define([
	'services/buildService',
	'services/jenkins/jenkinsBuild',
	'jquery',
	'signals',
	'services/jenkins/jenkinsRequest'
], function (BuildService, JenkinsBuild, $, Signal, jenkinsRequest) {

	'use strict';

	var JenkinsBuildService = function (settings) {
		$.extend(this, new BuildService(settings));
		this.Build = JenkinsBuild;
	};
	
	JenkinsBuildService.settings = function () {
		return {
			typeName: 'Jenkins',
			baseUrl: 'jenkins',
			icon: 'jenkins/icon.png',
			logo: 'jenkins/logo.png',
			projects: [],
			url: '',
			urlHint: 'http://ci.jenkins-ci.org/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	JenkinsBuildService.prototype.projects = function () {
		var completed = new Signal();
		completed.memorize = true;
		var requestSettings = {
			url: this.settings.url,
			username: this.settings.username,
			password: this.settings.password
		};
		jenkinsRequest.projects(requestSettings).addOnce(function (result) {
			if (result.error) {
				completed.dispatch({ error: result.error });
			} else {
				try {
					var templateData = createTemplateData(result.response);
					completed.dispatch({ projects: templateData });
				} catch (ex) {
					completed.dispatch({ error: { name: 'ParseError', message: 'Unrecognized response'}});
				}
			}
		});
		return completed;
	};

	function createTemplateData(apiJson) {
		return {
			items: apiJson.jobs.map(function (job, index) {
				return {
					id: job.name,
					name: job.displayName,
					group: null,
					enabled: job.buildable
				};
			}),
			primaryView: apiJson.primaryView.name,
			views: apiJson.views.map(function (view, index) {
				return {
					name: view.name,
					items: view.jobs.map(function (job, index) {
						return job.name;
					})
				};
			})
		};
	}

	return JenkinsBuildService;
});
