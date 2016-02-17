define(function () {

	'use strict';

	return {
		projects: {
			primaryView: 'All',
			views: [
				{
					name: 'All',
					items: [
						'JAVADOC-BRANCH18X',
						'JAVADOC-BRANCH19X',
						'JAVADOC-TRUNK',
						'JU-CORE',
						'FUNC-APPTEST',
						'FUNC-BUILDPERF',
						'FUNC-LBR',
						'FUNC-PERF',
						'NIGHTLY-BRANCH18X',
						'NIGHTLY-BRANCH19X',
						'NIGHTLY-TRUNK',
						'BUNDLED-FORM',
						'BUNDLED-HTMLEXT',
						'BUNDLED-HTML',
						'BUNDLED-HTMLWIDGETS',
						'BUNDLED-LOGIC',
						'BUNDLED-MDS',
						'BUNDLED-FLAG',
						'BUNDLED-REPORT',
						'BUNDLED-RPC',
						'BUNDLED-RESTWS',
						'BUNDLED-SXS',
						'BUNDLED-XFORMS',
						'DEMO-DEVTEST01',
						'DEMO-DEVTEST01A',
						'DEMO-LATEST',
						'DEMO-NIGHTLY',
						'DEMO-DEMODB',
						'APPT-APPT'
					]
				},
				{
					name: 'All disabled',
					items: [ 'JAVADOC-BRANCH18X' ]
				},
				{
					name: 'JavaDocs',
					items: [ 'JAVADOC-BRANCH18X', 'JAVADOC-BRANCH19X', 'JAVADOC-TRUNK' ]
				}
			],
			selected: [
				'JAVADOC-BRANCH18X',
				'JU-CORE',
				'DEMO-DEMODB',
				'FUNC-APPTEST'
			],
			items: [
				{
					id: 'JAVADOC-BRANCH18X',
					name: 'Publish 1.8.x Javadocs',
					group: 'Javadocs',
					isDisabled: true,
				},
				{
					id: 'JAVADOC-BRANCH19X',
					name: 'Publish 1.9.x Javadocs',
					group: 'Javadocs',
					isDisabled: false,
				},
				{
					id: 'JAVADOC-TRUNK',
					name: 'Publish Trunk Javadocs',
					group: 'Javadocs',
					isDisabled: false,
				},
				{
					id: 'JU-CORE',
					name: 'OpenMRS Core',
					group: 'JUnit',
					isDisabled: false,
				},
				{
					id: 'FUNC-APPTEST',
					name: 'Application Release Test',
					group: 'Functional Tests',
					isDisabled: true,
				},
				{
					id: 'FUNC-BUILDPERF',
					name: 'Build and Deploy to Buea',
					group: 'Functional Tests',
					isDisabled: false,
				},
				{
					id: 'FUNC-LBR',
					name: 'Liquibase Runner',
					group: 'Functional Tests',
					isDisabled: false,
				},
				{
					id: 'FUNC-PERF',
					name: 'Performance Test',
					group: 'Functional Tests',
					isDisabled: false,
				},
				{
					id: 'NIGHTLY-BRANCH18X',
					name: 'Deploy Nightly 1.8.x',
					group: 'Nightly Builds',
					isDisabled: false,
				},
				{
					id: 'NIGHTLY-BRANCH19X',
					name: 'Deploy Nightly 1.9.x',
					group: 'Nightly Builds',
					isDisabled: false,
				},
				{
					id: 'NIGHTLY-TRUNK',
					name: 'Deploy Nightly Trunk',
					group: 'Nightly Builds',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-FORM',
					name: 'Formentry Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-HTMLEXT',
					name: 'Htmlformentry Extensions Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-HTML',
					name: 'Htmlformentry Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-HTMLWIDGETS',
					name: 'Htmlwidgets Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-LOGIC',
					name: 'Logic Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-MDS',
					name: 'Metadata Sharing',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-FLAG',
					name: 'Patient Flags Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-REPORT',
					name: 'Reporting',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-RPC',
					name: 'Reporting Compatibility Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-RESTWS',
					name: 'REST Web Services',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-SXS',
					name: 'Serialization.xstream',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'BUNDLED-XFORMS',
					name: 'XForms Module',
					group: 'Bundled Modules',
					isDisabled: false,
				},
				{
					id: 'DEMO-DEVTEST01',
					name: 'Deploy Dev Test 01',
					group: 'Demo Sites',
					isDisabled: false,
				},
				{
					id: 'DEMO-DEVTEST01A',
					name: 'Deploy Dev Test 01 Hibernate Search',
					group: 'Demo Sites',
					isDisabled: false,
				},
				{
					id: 'DEMO-LATEST',
					name: 'Deploy Latest Demo',
					group: 'Demo Sites',
					isDisabled: false,
				},
				{
					id: 'DEMO-NIGHTLY',
					name: 'Deploy Nightly Demo',
					group: 'Demo Sites',
					isDisabled: false,
				},
				{
					id: 'DEMO-DEMODB',
					name: 'Reset Latest Demo DB',
					group: 'Demo Sites',
					isDisabled: false,
				},
				{
					id: 'APPT-APPT',
					name: 'Appointment Module',
					group: 'Appointment',
					isDisabled: false,
				}
			]
		}
	};

});