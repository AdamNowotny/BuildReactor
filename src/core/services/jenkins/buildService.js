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
			projects: [],
			url: '',
			urlHint: 'URL, e.g. http://ci.jenkins-ci.org/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	var availableBuilds = function () {
		var self = this;
		return request.json({
			url: joinUrl(this.settings.url, 'api/json'),
			username: self.settings.username,
			password: self.settings.password
		}).selectMany(function (response) {
			return Rx.Observable.zip(
				allJobDetails(response.jobs, self.settings),
				allViewDetails(response.views, response.primaryView.name, self.settings),
				function (jobs, views) {
					return {
						items: jobs,
						primaryView: response.primaryView.name,
						views: views
					};
				}
			);
		});
	};

	function allJobDetails(jobs, settings) {
		return Rx.Observable.zipArray(jobs.map(function (job) {
			return jobDetails(job, settings);
		}));
	}

	function allViewDetails(views, primaryView, settings) {
		var updatedViews = views.map(function (view) {
			return {
				name: view.name,
				url: (view.name === primaryView) ?
					joinUrl(view.url, 'primaryView/') : view.url
			};
		});
		return Rx.Observable.zipArray(updatedViews.map(function (view) {
			return viewDetails(view, settings);
		}));
	}

	function jobDetails(job, settings) {
		return request.json({
			url: joinUrl(job.url, 'api/json'),
			username: settings.username,
			password: settings.password,
		}).select(function (jobResponse) {
			return {
				id: jobResponse.name,
				name: jobResponse.displayName,
				group: null,
				isDisabled: !jobResponse.buildable
			};
		});
	}

	function viewDetails(view, settings) {
		return request.json({
			url: joinUrl(view.url, 'api/json'),
			username: settings.username,
			password: settings.password,
		}).select(function (viewResponse) {
			return {
				name: viewResponse.name,
				items: viewResponse.jobs.map(function (job) {
					return job.name;
				})
			};
		});
	}

	return JenkinsBuildService;
});
