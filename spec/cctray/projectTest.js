define([
	'cctray/project',
	'jquery',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
], function (project, $, jasmineSignals, projectsXml) {

	'use strict';
	
	describe('cctray/project', function () {

		var projectSuccessInfo,
			projectFailureInfo,
			projectBuildingInfo,
			spyOnSignal = jasmineSignals.spyOnSignal;

		beforeEach(function () {
			projectSuccessInfo = { name: 'project name', status: 'Success', url: 'http://www.example.com/' };
			projectFailureInfo = { name: 'project name', status: 'Failure', url: 'http://www.example.com/' };
			projectBuildingInfo = { name: 'project name', status: 'Unknown', url: 'http://www.example.com/' };
		});

		it('should initialize from JSON', function () {
			var someProject = project().update(projectSuccessInfo);

			expect(someProject.url()).toBe('http://www.example.com/');
			expect(someProject.projectName()).toBe('project name');
		});

		it('should dispatch failed if build is broken while initializing', function () {
			var someProject = project();
			var buildFailedSpy = spyOnSignal(someProject.failed);

			someProject.update(projectFailureInfo);

			expect(buildFailedSpy).toHaveBeenDispatched();
		});

		it('should dispatch failed if build failed', function () {
			var someProject = project().update(projectSuccessInfo),
				buildFailedSpy = spyOnSignal(someProject.failed);

			someProject.update(projectFailureInfo);

			expect(buildFailedSpy).toHaveBeenDispatched();
		});

		it('should dispatch fixed if build was fixed', function () {
			var someProject = project().update(projectFailureInfo),
				buildFixedSpy = spyOnSignal(someProject.fixed);

			someProject.update(projectSuccessInfo);

			expect(buildFixedSpy).toHaveBeenDispatched();
		});

		it('should not dispatch fixed if initializing', function () {
			var someProject = project(),
				buildFixedSpy = spyOnSignal(someProject.fixed);

			someProject.update(projectSuccessInfo);

			expect(buildFixedSpy).not.toHaveBeenDispatched();
		});

		it('should ignore if building', function () {
			var someProject = project(),
				buildFixedSpy = spyOnSignal(someProject.fixed),
				buildBrokenSpy = spyOnSignal(someProject.failed);

			someProject.update(projectBuildingInfo);

			expect(buildFixedSpy).not.toHaveBeenDispatched();
			expect(buildBrokenSpy).not.toHaveBeenDispatched();
		});
	});
});