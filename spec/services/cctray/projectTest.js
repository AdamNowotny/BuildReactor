define([
	'services/cctray/project',
	'jquery',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
], function (project, $, jasmineSignals, projectsXml) {

	'use strict';
	
	describe('services/cctray/project', function () {

		var projectSuccessInfo = { name: 'project name', status: 'Success', url: 'http://www.example.com/' };
		var projectFailureInfo = { name: 'project name', status: 'Failure', url: 'http://www.example.com/' };
		var projectBuildingInfo = { name: 'project name', status: 'Unknown', url: 'http://www.example.com/' };
		var spyOnSignal = jasmineSignals.spyOnSignal;
		var someProject;

		beforeEach(function () {
			someProject = project();
			spyOnSignal(someProject.failed);
			spyOnSignal(someProject.fixed);
		});

		it('should initialize from JSON', function () {
			someProject.update(projectSuccessInfo);

			expect(someProject.url()).toBe('http://www.example.com/');
			expect(someProject.projectName()).toBe('project name');
		});

		it('should dispatch failed if build is broken while initializing', function () {
			someProject.update(projectFailureInfo);

			expect(someProject.failed).toHaveBeenDispatched();
		});

		it('should dispatch failed if build failed', function () {
			someProject.update(projectSuccessInfo);

			someProject.update(projectFailureInfo);

			expect(someProject.failed).toHaveBeenDispatched();
		});

		it('should dispatch fixed if build was fixed', function () {
			someProject.update(projectFailureInfo);

			someProject.update(projectSuccessInfo);

			expect(someProject.fixed).toHaveBeenDispatched();
		});

		it('should not dispatch fixed if initializing', function () {
			someProject.update(projectSuccessInfo);

			expect(someProject.fixed).not.toHaveBeenDispatched();
		});

		it('should ignore if building', function () {
			someProject.update(projectBuildingInfo);

			expect(someProject.fixed).not.toHaveBeenDispatched();
			expect(someProject.failed).not.toHaveBeenDispatched();
		});

		it('should not signal fixed if previous state unknown', function () {
			someProject.update(projectBuildingInfo);
			someProject.update(projectSuccessInfo);

			expect(someProject.fixed).not.toHaveBeenDispatched();
		});
	});
});