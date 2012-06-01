define([
		'src/cruisecontrol/projectFactory',
        'jasmineSignals',
        'text!spec/fixtures/cruisecontrol/cruisecontrolnet.xml',
        'xml2json'
	],
	function (projectFactory, jasmineSignals, projectsXml) {

		describe('cruisecontrol/project', function () {

		    var projectJson;
		    var spyOnSignal = jasmineSignals.spyOnSignal;
		    
			beforeEach(function () {
			    var json = $.xml2json(projectsXml);
			    projectJson = json.Project[0];
			});

			it('should initialize from JSON', function () {
			    var project = projectFactory.create(projectJson);

			    expect(project.name).toBe('CruiseControl.NET');
			});

			it('should dispatch buildFailed if build failed', function () {
			    projectJson.lastBuildStatus = 'Success';
			    var project = projectFactory.create(projectJson);
			    projectJson.lastBuildStatus = 'Failure';
			    var buildFailedSpy = spyOnSignal(project.buildFailed);

			    project.update(projectJson);

			    expect(buildFailedSpy).toHaveBeenDispatched();
		    });

		    it('should dispatch buildFixed if build was fixed', function () {
		        projectJson.lastBuildStatus = 'Failure';
		        var project = projectFactory.create(projectJson);
		        projectJson.lastBuildStatus = 'Success';
		        var buildFixedSpy = spyOnSignal(project.buildFixed);

		        project.update(projectJson);

		        expect(buildFixedSpy).toHaveBeenDispatched();
		    });
		});
	});