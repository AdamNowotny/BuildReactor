define([
		'./bambooSettingsController',
		'./bambooRequest',
		'signals',
		'jquery',
		'text!./settings.ejs',
		'text!./planSelection.ejs'
	], function (settingsController, BambooRequest, signals, $, settingsTemplateText, planSelectionText) {

	    var settingsTemplate = new EJS({ text: settingsTemplateText });
	    var planSelectionTemplate = new EJS({ text: planSelectionText });

	    var BambooSettingsController = function (settings) {
	        this.settings = settings;
	        this.saveClicked = new signals.Signal();
	        this.show = function (contentDivId) {
	            settingsTemplate.update(contentDivId, { name: this.settings.name });
	            this.initialize(contentDivId);
	        };
	    };

	    BambooSettingsController.prototype.initialize = function (contentDivId) {
	        var contentDiv = $('#' + contentDivId);
	        contentDiv.find('.url-input').val(this.settings.url);
	        contentDiv.find('.username-input').val(this.settings.username);
	        contentDiv.find('.password-input').val(this.settings.password);
	        contentDiv.find('.update-interval-input').val(this.settings.updateInterval);
	        contentDiv.find('.plans-button').click(updatePlans);
	        contentDiv.find('.save-button').click(save);
	        contentDiv.find('.bamboo-settings-form').submit(function () {
	            return false;
	        });
	        var self = this;

	        function save() {
	            var plans = contentDiv.find('.plan-selection-container .plan input:checked').map(function () {
	                return this.name;
	            }).get();
	            var settings = {
	                name: 'Atlassian Bamboo CI',
	                service: 'bamboo/bambooBuildService',
	                settingsController: 'bamboo/bambooSettingsController',
	                url: contentDiv.find('.url-input').val(),
	                username: contentDiv.find('.username-input').val(),
	                password: contentDiv.find('.password-input').val(),
	                updateInterval: parseInt(contentDiv.find('.update-interval-input').val()),
	                plans: plans
	            };
	            alert('Settings saved');
	            self.saveClicked.dispatch(settings);
	        };

	        function updatePlans() {
	            $('.plans-button').attr('disabled', 'disabled');
	            $('.error').hide();
	            var plansRequest = new BambooRequest(getRequestSettings());
	            plansRequest.responseReceived.addOnce(function (response) {
	                response.projects.project.sort(function (a, b) {
	                    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
	                });
	                renderPlans(response);
	            });
	            plansRequest.errorReceived.addOnce(renderError);
	            plansRequest.projects();

	            function getRequestSettings() {
	                var baseUrl = contentDiv.find('.url-input').val();
	                var username = contentDiv.find('.username-input').val();
	                var password = contentDiv.find('.password-input').val();
	                return {
	                    url: baseUrl,
	                    username: username,
	                    password: password
	                };
	            }

	            function renderPlans(response) {
	                console.log('BambooSettingsController: Plans received', response);
	                $('.plans-button').removeAttr('disabled');
	                $('.save-button').removeAttr('disabled');
	                var projectsHtml = planSelectionTemplate.render({
	                    projects: response.projects.project,
	                    selectedPlans: self.settings.plans
	                });
	                contentDiv.find('.plan-selection-container').html(projectsHtml);
	                contentDiv.find('.plan-selection-container .project').click(function () {
	                    $(this).next('.plans').toggle('fast');
	                });
	                contentDiv.find('.plan-selection-container .plan input:checked').closest('.plans').show();
	            }

	            function renderError(ajaxError) {
	                console.error('BambooSettingsController: Ajax request failed: ' + ajaxError.message, ajaxError);
	                $('.plans-button').removeAttr('disabled');
	                $('.error-message').text(ajaxError.message);
	                $('.error').show();
	            }
	        }
	    };

	    return BambooSettingsController;
	});