define(['services/cctray/buildService', 'jquery'], function (CCTrayBuildService, $) {

		'use strict';

		var JenkinsBuildService = function (settings) {
			$.extend(this, new CCTrayBuildService(settings));
			this.cctrayLocation = 'cc.xml';
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

		return JenkinsBuildService;
	});