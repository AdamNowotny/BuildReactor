define([
	'services/cctray/cctrayProject',
	'jquery',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
], function (CCTrayProject, $, spyOnSignal, projectsXml) {

	'use strict';
	
	describe('services/cctray/project', function () {

		var projectSuccessInfo = {
			name: 'project name',
			activity: 'Sleeping',
			status: 'Success',
			url: 'http://www.example.com/'
		};
		var projectFailureInfo = { name: 'project name', status: 'Failure', url: 'http://www.example.com/' };
		var someProject;

		beforeEach(function () {
			someProject = new CCTrayProject("id");
			spyOnSignal(someProject.on.broken);
			spyOnSignal(someProject.on.fixed);
			spyOnSignal(someProject.on.started);
			spyOnSignal(someProject.on.finished);
		});

		it('should initialize from JSON', function () {
			someProject.update(projectSuccessInfo);

			expect(someProject.webUrl).toBe('http://www.example.com/');
			expect(someProject.name).toBe('project name');
		});

		describe('initialize', function () {

			it('should dispatch broken if build is broken while initializing', function () {
				someProject.update(projectFailureInfo);

				expect(someProject.on.broken).toHaveBeenDispatched();
			});

			it('should not dispatch fixed if initializing', function () {
				someProject.update(projectSuccessInfo);

				expect(someProject.on.fixed).not.toHaveBeenDispatched();
			});

			it('should dispatch started if building while initializing', function () {
				someProject.update({ status: 'Success', activity: 'Building' });

				expect(someProject.on.started).toHaveBeenDispatched();
			});

		});

		it('should dispatch broken if build failed', function () {
			someProject.update(projectSuccessInfo);

			someProject.update(projectFailureInfo);

			expect(someProject.on.broken).toHaveBeenDispatched();
		});

		it('should dispatch fixed if build was fixed', function () {
			someProject.update(projectFailureInfo);

			someProject.update(projectSuccessInfo);

			expect(someProject.on.fixed).toHaveBeenDispatched();
		});

		it('should dispatch started if activity changed to building', function () {
			someProject.update({ status: 'Success', activity: 'Sleeping' });

			someProject.update({ status: 'Success', activity: 'Building' });

			expect(someProject.on.started).toHaveBeenDispatched();
		});

		it('should know if building', function () {
			someProject.update({ status: 'Success', activity: 'Building' });

			expect(someProject.isRunning).toBe(true);
		});

		it('should know if building finished', function () {
			someProject.update({ status: 'Success', activity: 'Building' });
			someProject.update({ status: 'Success', activity: 'Sleeping' });

			expect(someProject.isRunning).toBe(false);
		});

		it('should know if broken', function () {
			someProject.update(projectFailureInfo);

			expect(someProject.isBroken).toBe(true);
		});

		it('should know if sucessful', function () {
			someProject.update(projectSuccessInfo);

			expect(someProject.isBroken).toBe(false);
		});

		it('should dispatch finished if activity changed from building', function () {
			someProject.update({ status: 'Success', activity: 'Building' });

			someProject.update({ status: 'Success', activity: 'Sleeping' });

			expect(someProject.on.finished).toHaveBeenDispatched();
		});

		it('should ignore if status unknown', function () {
			someProject.update({ status: 'Unknown' });

			expect(someProject.on.fixed).not.toHaveBeenDispatched();
			expect(someProject.on.broken).not.toHaveBeenDispatched();
		});

		it('should not signal fixed if previous state unknown', function () {
			someProject.update({ status: 'Unknown' });
			someProject.update({ status: 'Success' });

			expect(someProject.on.fixed).not.toHaveBeenDispatched();
		});
	});
});