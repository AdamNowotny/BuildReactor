define([
	'services/cctray/buildService',
	'jquery',
	'signals',
	'services/jenkins/jenkinsRequest'
], function (CCTrayBuildService, $, Signal, jenkinsRequest) {

	'use strict';

	var JenkinsBuildService = function (settings) {
		$.extend(this, new CCTrayBuildService(settings));
		this.projects = projects;
		this.cctrayLocation = (settings.primaryView && settings.primaryView !== 'All') ?
			'view/All/cc.xml' : 'cc.xml';
	};
	
	JenkinsBuildService.settings = function () {
		return {
			typeName: 'Jenkins',
			baseUrl: 'jenkins',
			icon: 'jenkins/icon.png',
			logo: 'jenkins/logo.png',
			projects: [],
			urlHint: 'http://ci.jenkins-ci.org/'
		};
	};

	var projects = function (selectedPlans) {
		var receivedProjects = new Signal();
		receivedProjects.memorize = true;
		var requestSettings = {
			url: this.settings.url,
			username: this.settings.username,
			password: this.settings.password
		};
		var plansRequest = jenkinsRequest.projects(requestSettings);
		plansRequest.responseReceived.addOnce(function (response) {
			var templateData = createTemplateData(response, selectedPlans);
			receivedProjects.dispatch({
				projects: templateData
			});
		});
		plansRequest.errorReceived.addOnce(function (ajaxError) {
			receivedProjects.dispatch({
				error: ajaxError
			});
		});
		return receivedProjects;
	};

	function createTemplateData(apiJson, selectedProjects) {
		
		return {
			items: apiJson.jobs.map(function (job, index) {
				return {
					id: job.name,
					name: job.displayName,
					group: null,
					enabled: job.buildable,
					selected: selectedProjects.indexOf(job.name) > -1
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