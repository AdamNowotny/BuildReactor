define(['rx', 'rx.time'], function (Rx) {

	'use strict';

	var activeProjects = [
		{
			name: "BuildReactor (fake builds)",
			items: [
				{
					name: "Success",
					group: "Normal",
					isBroken: false,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false
				}, {
					name: "Failed",
					group: "Normal",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false
				}, {
					name: "Unstable",
					group: "Normal",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false,
					tags: [{ name: 'Unstable', type: 'warning' }]
				}, {
					name: "Success",
					group: "Building",
					isBroken: false,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: true
				}, {
					name: "Failed",
					group: "Building",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: true
				}, {
					name: "Unstable",
					group: "Building",
					isBroken: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: true,
					tags: [{ name: 'Unstable', type: 'warning' }]
				}, {
					name: "Success",
					group: "Disabled",
					isBroken: false,
					isDisabled: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false
				}, {
					name: "Failed",
					group: "Disabled",
					isBroken: true,
					isDisabled: true,
					url: "http://ci.openmrs.org/browse/FUNC-PERF-4",
					isRunning: false
				}
			]
		}, {
			name: "BuildReactor (fake offline builds)",
			items: [
				{
					name: "Failed building offline",
					group: "Offline",
					error: { name: 'Error', message: 'Ajax error', description: 'Ajax connection error (500)' },
					isBroken: true,
					url: null,
					isRunning: true
				}, {
					name: "Success building offline",
					group: "Offline",
					error: { name: 'Error', message: 'Ajax error', description: 'Ajax connection error (500)' },
					isBroken: false,
					url: null,
					isRunning: true
				}, {
					name: "Failed offline",
					group: "Offline",
					error: { name: 'Error', message: 'Ajax error', description: 'Ajax connection error (500)' },
					isBroken: true,
					url: null,
					isRunning: false
				}, {
					name: "Success offline",
					group: "Offline",
					error: { name: 'Error', message: 'Ajax error', description: 'Ajax connection error (500)' },
					isBroken: false,
					url: null,
					isRunning: false
				}, {
					name: "Success disabled offline",
					group: "Offline",
					error: { name: 'Error', message: 'Ajax error', description: 'Ajax connection error (500)' },
					isBroken: false,
					url: null,
					isRunning: false,
					isDisabled: true
				}, {
					name: "Broken disabled offline",
					group: "Offline",
					error: { name: 'Error', message: 'Ajax error', description: 'Ajax connection error (500)' },
					isBroken: true,
					url: null,
					isRunning: false,
					isDisabled: true
				}
			]
		}
	];

	var updateSettings = function (settingsList) {
	};

	var initOptions = function (callback) {
		callback(JSON.parse('{"settings":[{"name":"BuildReactor long name","baseUrl":"cctray","url":"https://api.travis-ci.org/repos/AdamNowotny/BuildReactor/cc.xml","icon":"cctray/icon.png","updateInterval":60,"username":"","password":"","projects":["AdamNowotny/BuildReactor"],"disabled":false},{"name":"OpenMRS","baseUrl":"bamboo","url":"http://ci.openmrs.org","icon":"bamboo/icon.png","updateInterval":60,"username":"","password":"","projects":["FUNC-APPTEST","FUNC-BUILDPERF","FUNC-PERF","JU-CORE"],"disabled":true},{"name":"Jenkins","baseUrl":"jenkins","url":"http://ci.jenkins-ci.org","icon":"jenkins/icon.png","updateInterval":60,"username":"","password":"","projects":["config-provider-model","infra_main_svn_to_git","infra_plugin_changes_report","infra_plugins_svn_to_git","infra_svnsync"],"disabled":true},{"name":"T1","baseUrl":"teamcity","url":"http://teamcity.jetbrains.com/","icon":"teamcity/icon.png","updateInterval":60,"username":"","password":"","projects":["bt308"],"disabled":true,"branch":""},{"name":"T2","baseUrl":"teamcity","url":"http://teamcity.codebetter.com/","icon":"teamcity/icon.png","updateInterval":60,"username":"","password":"","projects":["bt607"],"disabled":true,"branch":"release"}],"serviceTypes":[{"typeName":"Atlassian Bamboo","baseUrl":"bamboo","icon":"bamboo/icon.png","logo":"bamboo/logo.png","projects":[],"url":"","urlHint":"https://ci.openmrs.org/","username":"","password":"","updateInterval":60},{"typeName":"CCTray Generic","baseUrl":"cctray","icon":"cctray/icon.png","logo":"cctray/logo.png","projects":[],"url":"","urlHint":"http://cruisecontrol.instance.com/cctray.xml","username":"","password":"","updateInterval":60},{"typeName":"CruiseControl","baseUrl":"cruisecontrol","icon":"cruisecontrol/icon.png","logo":"cruisecontrol/logo.png","projects":[],"url":"","urlHint":"http://cruisecontrol.instance.com/","username":"","password":"","updateInterval":60},{"typeName":"CruiseControl.NET","baseUrl":"cruisecontrol.net","icon":"cruisecontrol.net/icon.png","logo":"cruisecontrol.net/logo.png","projects":[],"url":"","urlHint":"http://build.nauck-it.de/","username":"","password":"","updateInterval":60},{"typeName":"CruiseControl.rb","baseUrl":"cruisecontrol.rb","icon":"cruisecontrol.rb/icon.png","logo":"cruisecontrol.rb/logo.png","projects":[],"url":"","urlHint":"http://cruisecontrolrb.thoughtworks.com/","username":"","password":"","updateInterval":60},{"typeName":"ThoughtWorks GO","baseUrl":"go","icon":"go/icon.png","logo":"go/logo.png","projects":[],"url":"","urlHint":"http://example-go.thoughtworks.com/","username":"","password":"","updateInterval":60},{"typeName":"Jenkins","baseUrl":"jenkins","icon":"jenkins/icon.png","logo":"jenkins/logo.png","projects":[],"url":"","urlHint":"http://ci.jenkins-ci.org/","username":"","password":"","updateInterval":60},{"typeName":"TeamCity","baseUrl":"teamcity","icon":"teamcity/icon.png","logo":"teamcity/logo.png","projects":[],"url":"","urlHint":"http://teamcity.jetbrains.com/","username":"","password":"","updateInterval":60},{"typeName":"Travis","baseUrl":"travis","icon":"travis/icon.png","logo":"travis/logo.png","projects":[],"username":""}]}'));
	};

	var availableProjects = function (settings, callback) {
		callback(JSON.parse('{"projects":{"items":[{"id":"JAVADOC-BRANCH18X","name":"Publish 1.8.x Javadocs","group":"Javadocs","enabled":true,"selected":false},{"id":"JAVADOC-BRANCH19X","name":"Publish 1.9.x Javadocs","group":"Javadocs","enabled":true,"selected":false},{"id":"JAVADOC-TRUNK","name":"Publish Trunk Javadocs","group":"Javadocs","enabled":true,"selected":false},{"id":"JU-CORE","name":"OpenMRS Core","group":"JUnit","enabled":true,"selected":true},{"id":"FUNC-APPTEST","name":"Application Release Test","group":"Functional Tests","enabled":false,"selected":false},{"id":"FUNC-BUILDPERF","name":"Build and Deploy to Buea","group":"Functional Tests","enabled":true,"selected":false},{"id":"FUNC-LBR","name":"Liquibase Runner","group":"Functional Tests","enabled":true,"selected":false},{"id":"FUNC-PERF","name":"Performance Test","group":"Functional Tests","enabled":true,"selected":false},{"id":"NIGHTLY-BRANCH18X","name":"Deploy Nightly 1.8.x","group":"Nightly Builds","enabled":true,"selected":false},{"id":"NIGHTLY-BRANCH19X","name":"Deploy Nightly 1.9.x","group":"Nightly Builds","enabled":true,"selected":false},{"id":"NIGHTLY-TRUNK","name":"Deploy Nightly Trunk","group":"Nightly Builds","enabled":true,"selected":false},{"id":"BUNDLED-FORM","name":"Formentry Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-HTMLEXT","name":"Htmlformentry Extensions Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-HTML","name":"Htmlformentry Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-HTMLWIDGETS","name":"Htmlwidgets Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-LOGIC","name":"Logic Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-MDS","name":"Metadata Sharing","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-FLAG","name":"Patient Flags Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-REPORT","name":"Reporting","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-RPC","name":"Reporting Compatibility Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-RESTWS","name":"REST Web Services","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-SXS","name":"Serialization.xstream","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-XFORMS","name":"XForms Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"DEMO-DEVTEST01","name":"Deploy Dev Test 01","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-DEVTEST01A","name":"Deploy Dev Test 01 Hibernate Search","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-LATEST","name":"Deploy Latest Demo","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-NIGHTLY","name":"Deploy Nightly Demo","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-DEMODB","name":"Reset Latest Demo DB","group":"Demo Sites","enabled":true,"selected":true},{"id":"APPT-APPT","name":"Appointment Module","group":"Appointment","enabled":true,"selected":false}]}}'));
	};

	return {
		init: function () {},
		activeProjects: Rx.Observable.returnValue(activeProjects),
		initOptions: initOptions,
		updateSettings: updateSettings,
		availableProjects: availableProjects
	};

});