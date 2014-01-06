define(function () {

	'use strict';

	return {
		settings: [
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
		],
		serviceTypes: [
			{
				typeName: "Atlassian Bamboo",
				baseUrl: "bamboo",
				icon: "bamboo/icon.png",
				logo: "bamboo/logo.png",
				projects: [],
				url: "",
				urlHint: "https://ci.openmrs.org/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "CCTray Generic",
				baseUrl: "cctray",
				icon: "cctray/icon.png",
				logo: "cctray/logo.png",
				projects: [],
				url: "",
				urlHint: "http://cruisecontrol.instance.com/cctray.xml",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "CruiseControl",
				baseUrl: "cruisecontrol",
				icon: "cruisecontrol/icon.png",
				logo: "cruisecontrol/logo.png",
				projects: [],
				url: "",
				urlHint: "http://cruisecontrol.instance.com/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "CruiseControl.NET",
				baseUrl: "cruisecontrol.net",
				icon: "cruisecontrol.net/icon.png",
				logo: "cruisecontrol.net/logo.png",
				projects: [],
				url: "",
				urlHint: "http://build.nauck-it.de/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "CruiseControl.rb",
				baseUrl: "cruisecontrol.rb",
				icon: "cruisecontrol.rb/icon.png",
				logo: "cruisecontrol.rb/logo.png",
				projects: [],
				url: "",
				urlHint: "http://cruisecontrolrb.thoughtworks.com/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "ThoughtWorks GO",
				baseUrl: "go",
				icon: "go/icon.png",
				logo: "go/logo.png",
				projects: [],
				url: "",
				urlHint: "http://example-go.thoughtworks.com/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "Jenkins",
				baseUrl: "jenkins",
				icon: "jenkins/icon.png",
				logo: "jenkins/logo.png",
				projects: [],
				url: "",
				urlHint: "http://ci.jenkins-ci.org/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "TeamCity",
				baseUrl: "teamcity",
				icon: "teamcity/icon.png",
				logo: "teamcity/logo.png",
				projects: [],
				url: "",
				urlHint: "http://teamcity.jetbrains.com/",
				username: "",
				password: "",
				updateInterval: 60
			},
			{
				typeName: "Travis",
				baseUrl: "travis",
				icon: "travis/icon.png",
				logo: "travis/logo.png",
				projects: [],
				username: ""
			}
		]
	};
});