define([
		'src/cctray/settingsController',
		'src/cctray/ccRequest',
		'src/common/projectView',
		'jquery',
		'signals',
		'jasmineSignals',
		'text!spec/fixtures/cctray/cruisecontrolnet.xml',
        'xml2json'
	],
	function (controller, ccRequest, projectView, $, signals, jasmineSignals, projectsXml) {

	    describe('cctray/settingsController', function () {

			var settings;
			var mockCcRequest;
			var mockProjectViewShow;
			var mockProjectViewGet;
			var spyOnSignal = jasmineSignals.spyOnSignal;
		    var responseReceived;
		    var errorReceived;
			var projectsJson;
		    
			beforeEach(function () {
			    projectsJson = $.xml2json(projectsXml);
			    responseReceived = new signals.Signal();
			    errorReceived = new signals.Signal();
			    responseReceived.memorize = true;
				errorReceived.memorize = true;
				settings = {
					name: 'My Bamboo CI',
					baseUrl: 'src/cruisecontrol',
					url: 'http://example.com/',
					updateInterval: 10,
					username: 'username1',
					password: 'password1',
					projects: ['AspSQLProvider', 'CruiseControl.NET']
				};
				mockCcRequest = spyOn(ccRequest, 'projects');
				mockCcRequest.andCallFake(function () {
				    responseReceived.dispatch(projectsJson);
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});
				mockProjectViewShow = spyOn(projectView, 'show');
				spyOn(projectView, 'hide');
				spyOn(projectView, 'initialize');
				mockProjectViewGet = spyOn(projectView, 'get').andCallFake(function () {
					return {
						projects: settings.projects
					};
				});
				jasmine.getFixtures().load('cctray/settingsFixture.html');
			});

			function showPlans() {
				controller.show(settings);

				$('.projects-button').click();
			}

			it('should initialize from settings', function () {
				controller.show(settings);

				expect($('.url-input')).toHaveValue(settings.url);
				expect($('.username-input')).toHaveValue(settings.username);
				expect($('.password-input')).toHaveValue(settings.password);
				expect($('.update-interval-input')).toHaveValue(settings.updateInterval);
			});

			it('should initialize empty settings with default values', function () {
				settings.updateInterval = undefined;
				settings.projects = undefined;

				controller.show(settings);

				expect($('.update-interval-input')).toHaveValue(60);
				expect(settings.projects.length).toBe(0);
			});

			it('should initialize projectView', function () {
			    controller.show(settings);

			    expect(projectView.initialize).toHaveBeenCalledWith('project-selection-container');
			});
		    
			it('should focus on url on load', function () {
				controller.show(settings);

				expect($('.url-input:focus').length).toBe(1);
			});

		    describe('Projects', function() {

		        it('should use url and credentials when getting plans', function() {
		            mockCcRequest.andCallFake(function(requestSettings) {
		                expect(requestSettings.username).toBe(settings.username);
		                expect(requestSettings.password).toBe(settings.password);
		                expect(requestSettings.url).toBe(settings.url);
		                responseReceived.dispatch(projectsJson);
		                return {
		                    responseReceived: responseReceived,
		                    errorReceived: errorReceived
		                };
		            });

		            showPlans();

		            expect(mockCcRequest).toHaveBeenCalled();
		        });

		        it('should display projects after button clicked', function() {
		            mockProjectViewShow.andCallFake(function(responseJson) {
		                expect(responseJson.items.length).toBe(9);
		                expect(responseJson.items[0].name).toBe('CruiseControl.NET');
		                expect(responseJson.items[0].group).toBe('CruiseControl.NET');
		                expect(responseJson.items[0].enabled).toBe(true);
		                expect(responseJson.items[0].selected).toBe(true);
		            });

		            showPlans();

		            expect(mockProjectViewShow).toHaveBeenCalled();
		        });

		        it('should disable button while waiting for response', function() {
		            mockCcRequest.andCallFake(function() {
		                expect($('.projects-button')).toBeDisabled();
		                responseReceived.dispatch(projectsJson);
		                return {
		                    responseReceived: responseReceived,
		                    errorReceived: errorReceived
		                };
		            });

		            showPlans();

		            expect($('.projects-button')).not.toBeDisabled();
		            expect(mockCcRequest).toHaveBeenCalled();
		        });

		        it('should hide project view when getting projects', function() {
		            mockCcRequest.andCallFake(function() {
		                expect(projectView.hide).toHaveBeenCalled();
		                responseReceived.dispatch(projectsJson);
		                return {
		                    responseReceived: responseReceived,
		                    errorReceived: errorReceived
		                };
		            });

		            showPlans();

		            expect(mockCcRequest).toHaveBeenCalled();
		        });

		        it('should display error if call failed when getting plans', function() {
		            mockCcRequest.andCallFake(function() {
		                errorReceived.dispatch({ message: 'error message' });
		                return {
		                    responseReceived: responseReceived,
		                    errorReceived: errorReceived
		                };
		            });

		            showPlans();

		            expect($('.alert-error')).toBeVisible();
		            expect($('.error-message')).toHaveText('error message');
		        });

		        it('should clear error when getting plans', function() {
		            $('.error').show();

		            showPlans();

		            expect($('.error')).not.toBeVisible();
		        });

		        it('should enable save button after plans loaded', function() {
		            showPlans();

		            expect($('.save-button')).not.toBeDisabled();
		        });

            });

			it('should signal save with settings', function () {
			    jasmine.getFixtures().load('bamboo/validSettingsFixture.html');
			    var settingsSavedSpy = spyOnSignal(controller.settingsChanged).matching(function (newSettings) {
			        return newSettings.url === settings.url
						&& newSettings.username === settings.username
							&& newSettings.password === settings.password
								&& newSettings.updateInterval === settings.updateInterval
									&& newSettings.projects === settings.projects;
			    });
			    mockProjectViewGet.andCallFake(function () {
			        return {
			            projects: settings.projects
			        };
			    });

			    showPlans();
			    $('.save-button').click();

			    expect(mockProjectViewGet).toHaveBeenCalled();
			    expect(settingsSavedSpy).toHaveBeenDispatched(1);
			});

		});
	});