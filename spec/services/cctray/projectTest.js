define([
	'services/cctray/project',
	'jquery',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
], function (project, $, jasmineSignals, projectsXml) {

	'use strict';
	
	describe('services/cctray/project', function () {

		var projectSuccessInfo = {
			name: 'project name',
			activity: 'Sleeping',
			status: 'Success',
			url: 'http://www.example.com/'
		};
		var projectFailureInfo = { name: 'project name', status: 'Failure', url: 'http://www.example.com/' };
		var spyOnSignal = jasmineSignals.spyOnSignal;
		var someProject;

		beforeEach(function () {
			someProject = project();
			spyOnSignal(someProject.failed);
			spyOnSignal(someProject.fixed);
			spyOnSignal(someProject.started);
			spyOnSignal(someProject.finished);
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

		it('should dispatch started if activity changed to building', function () {
			someProject.update({ status: 'Success', activity: 'Sleeping' });

			someProject.update({ status: 'Success', activity: 'Building' });

			expect(someProject.started).toHaveBeenDispatched();
		});

		it('should know if building', function () {
			someProject.update({ status: 'Success', activity: 'Building' });

			expect(someProject.isBuilding()).toBeTruthy();
		});

		it('should know if building finished', function () {
			someProject.update({ status: 'Success', activity: 'Building' });
			someProject.update({ status: 'Success', activity: 'Sleeping' });

			expect(someProject.isBuilding()).toBeFalsy();
		});

		it('should dispatch started if building while initializing', function () {
			someProject.update({ status: 'Success', activity: 'Building' });

			expect(someProject.started).toHaveBeenDispatched();
		});

		it('should dispatch finished if activity changed from building', function () {
			someProject.update({ status: 'Success', activity: 'Building' });

			someProject.update({ status: 'Success', activity: 'Sleeping' });

			expect(someProject.finished).toHaveBeenDispatched();
		});

		it('should ignore if status unknown', function () {
			someProject.update({ status: 'Unknown' });

			expect(someProject.fixed).not.toHaveBeenDispatched();
			expect(someProject.failed).not.toHaveBeenDispatched();
		});

		it('should not signal fixed if previous state unknown', function () {
			someProject.update({ status: 'Unknown' });
			someProject.update({ status: 'Success' });

			expect(someProject.fixed).not.toHaveBeenDispatched();
		});
	});
});