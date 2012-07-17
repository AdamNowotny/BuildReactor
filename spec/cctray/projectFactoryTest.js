define([
	'cctray/projectFactory',
	'jquery',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
], function (projectFactory, $, jasmineSignals, projectsXml) {

	'use strict';
	
	describe('cctray/projectFactory', function () {

		var projectSuccessInfo,
			projectFailureInfo,
			spyOnSignal = jasmineSignals.spyOnSignal;

		beforeEach(function () {
			projectSuccessInfo = { name: 'project name', status: 'Success' };
			projectFailureInfo = { name: 'project name', status: 'Failure' };
		});

		it('should initialize from JSON', function () {
			var project = projectFactory.create(projectSuccessInfo);

			expect(project.name).toBe('project name');
		});

		it('should dispatch buildFailed if build failed', function () {
			var project = projectFactory.create(projectSuccessInfo),
				buildFailedSpy = spyOnSignal(project.buildFailed);

			project.update(projectFailureInfo);

			expect(buildFailedSpy).toHaveBeenDispatched();
		});

		it('should dispatch buildFixed if build was fixed', function () {
			var project = projectFactory.create(projectFailureInfo),
				buildFixedSpy = spyOnSignal(project.buildFixed);

			project.update(projectSuccessInfo);

			expect(buildFixedSpy).toHaveBeenDispatched();
		});
	});
});