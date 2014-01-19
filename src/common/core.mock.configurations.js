define(['rx'], function (Rx) {

	'use strict';

	var settings = [
		{
			name: "BuildReactor long name",
			baseUrl: "cctray",
			url: "https://api.travis-ci.org/repos/AdamNowotny/BuildReactor/cc.xml",
			icon: "cctray/icon.png",
			updateInterval: 60,
			username: "",
			password: "",
			projects: [
				"AdamNowotny/BuildReactor"
			],
			disabled: false
		},
		{
			name: "OpenMRS",
			baseUrl: "bamboo",
			url: "http://ci.openmrs.org",
			icon: "bamboo/icon.png",
			updateInterval: 60,
			username: "",
			password: "",
			projects: [
				"FUNC-APPTEST",
				"FUNC-BUILDPERF",
				"FUNC-PERF",
				"JU-CORE"
			],
			disabled: true
		},
		{
			name: "Jenkins",
			baseUrl: "jenkins",
			url: "http://ci.jenkins-ci.org",
			icon: "jenkins/icon.png",
			updateInterval: 60,
			username: "",
			password: "",
			projects: [
				"config-provider-model",
				"infra_main_svn_to_git",
				"infra_plugin_changes_report",
				"infra_plugins_svn_to_git",
				"infra_svnsync"
			],
			disabled: true
		},
		{
			name: "T1",
			baseUrl: "teamcity",
			url: "http://teamcity.jetbrains.com/",
			icon: "teamcity/icon.png",
			updateInterval: 60,
			username: "",
			password: "",
			projects: [
				"bt308"
			],
			disabled: true,
			branch: ""
		},
		{
			name: "T2",
			baseUrl: "teamcity",
			url: "http://teamcity.codebetter.com/",
			icon: "teamcity/icon.png",
			updateInterval: 60,
			username: "",
			password: "",
			projects: [
				"bt607"
			],
			disabled: true,
			branch: "release"
		}
	];

	return Rx.Observable.returnValue(settings);
});
