define([
	'core/services/buildServiceBase',
	'core/services/request',
	'core/services/jenkins/jenkinsBuild',
	'mout/object/mixIn',
	'common/joinUrl',
	'rx'
], function (BuildServiceBase, request, JenkinsBuild, mixIn, joinUrl, Rx) {

	'use strict';

	var JenkinsBuildService = function (settings) {
		mixIn(this, new BuildServiceBase(settings));
		this.Build = JenkinsBuild;
		this.availableBuilds = availableBuilds;
	};

	JenkinsBuildService.settings = function () {
		return {
			typeName: 'Jenkins',
			baseUrl: 'jenkins',
			icon: 'jenkins/icon.png',
			logo: 'jenkins/logo.png',
			urlHint: 'URL, e.g. http://ci.jenkins-ci.org/',
			defaultConfig: {
				baseUrl: 'jenkins',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		};
	};

	var availableBuilds = function () {
		var self = this;
		return request.json({
			url: joinUrl(this.settings.url, 'api/json?tree=jobs[name,buildable],primaryView[name],views[name,url]'),
			username: self.settings.username,
			password: self.settings.password
		}).selectMany(function (response) {
			return Rx.Observable.zip(
				allViewDetails(response.views, response.primaryView.name, self.settings),
				function (views) {
					return {
						items: response.jobs.map(jobDetails),
						primaryView: response.primaryView.name,
						views: views
					};
				}
			);
		});
	};

	function jobDetails(job) {
		return {
			id: job.name,
			name: job.name,
			group: null,
			isDisabled: !job.buildable
		};
	}

	function allViewDetails(views, primaryView, settings) {
		var updatedViews = views.map(function (view) {
			return {
				name: view.name,
				url: (view.name === primaryView && view.url.indexOf(primaryView) < 0) ?
					joinUrl(view.url, 'view' + '/' + primaryView) : view.url
			};
		});
		return Rx.Observable.zipArray(updatedViews.map(function (view) {
			return viewDetails(view, settings);
		}));
	}

	function viewDetails(view, settings) {
		return request.json({
			url: joinUrl(view.url, 'api/json?tree=jobs[name]'),
			username: settings.username,
			password: settings.password,
			timeout: 90000
		}).select(function (viewResponse) {
			return {
				name: view.name,
				items: viewResponse.jobs.map(function (job) {
					return job.name;
				})
			};
		});
	}

	return JenkinsBuildService;
});
