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
			spyOnSignal = jasmineSignals.spyOnSignal;

		beforeEach(function () {
			projectSuccessInfo = { name: 'project name', status: 'Success' };
			projectFailureInfo = { name: 'project name', status: 'Failure' };
		});

		it('should initialize name and status from JSON', function () {
			var someProject = project().update(projectSuccessInfo);

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
	});
});