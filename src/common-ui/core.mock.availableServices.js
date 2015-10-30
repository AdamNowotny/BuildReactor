define(function () {

	'use strict';

	return [
		{
			typeName: 'Atlassian Bamboo',
			baseUrl: 'bamboo',
			urlHint: 'URL, e.g. http://ci.openmrs.org/',
			urlHelp: 'For Bamboo OnDemand use https://[your_account].atlassian.net/builds',
			defaultConfig: {
				baseUrl: 'bamboo',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "CCTray Generic",
			baseUrl: "cctray",
			urlHint: "http://cruisecontrol.instance.com/cctray.xml",
			defaultConfig: {
				baseUrl: 'cctray',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "CruiseControl",
			baseUrl: "cruisecontrol",
			urlHint: "http://cruisecontrol.instance.com/",
			defaultConfig: {
				baseUrl: 'cruisecontrol',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "CruiseControl.NET",
			baseUrl: "cruisecontrol.net",
			urlHint: "http://build.nauck-it.de/",
			defaultConfig: {
				baseUrl: 'cruisecontrol.net',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "CruiseControl.rb",
			baseUrl: "cruisecontrol.rb",
			urlHint: "http://cruisecontrolrb.thoughtworks.com/",
			defaultConfig: {
				baseUrl: 'cruisecontrol.rb',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "ThoughtWorks GO",
			baseUrl: "go",
			urlHint: "http://example-go.thoughtworks.com/",
			defaultConfig: {
				baseUrl: 'go',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "Jenkins",
			baseUrl: "jenkins",
			urlHint: "http://ci.jenkins-ci.org/",
			defaultConfig: {
				baseUrl: 'jenkins',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "TeamCity",
			baseUrl: "teamcity",
			urlHint: "http://teamcity.jetbrains.com/",
			defaultConfig: {
				baseUrl: 'teamcity',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		},
		{
			typeName: "Travis",
			baseUrl: "travis",
			defaultConfig: {
				baseUrl: 'travis',
				name: '',
				projects: [],
				username: '',
				updateInterval: 60
			}
		}
	];
});