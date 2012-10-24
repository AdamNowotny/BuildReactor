define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var JenkinsBuildService = function (settings) {
			this.cctrayLocation = function (url) {
				return 'view/All/cc.xml';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		JenkinsBuildService.prototype = CCTrayBuildService.prototype;

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

		return JenkinsBuildService;
	});