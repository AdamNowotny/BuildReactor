define([
	'common/projectView',
	'jquery'
],
	function (projectView, $) {

		'use strict';
		
		describe('common/projectView', function () {

			var json = {
				items: [
					{
						id: 0,
						name: 'CruiseControl.NET',
						group: 'cc',
						enabled: true,
						selected: true
					},
					{
						id: 1,
						name: 'ccTray',
						group: 'cc',
						enabled: true,
						selected: false
					},
					{
						id: 2,
						name: 'old ccTray',
						group: 'cc',
						enabled: false,
						selected: false
					},
					{
						id: 3,
						name: 'Project2-1',
						group: 'group2',
						enabled: true,
						selected: false
					},
					{
						id: 4,
						name: 'Project3-1',
						group: 'group3',
						enabled: true,
						selected: true
					}
				]
			};

			beforeEach(function () {
				jasmine.getFixtures().set('<div class="container">content</div>');
				projectView.initialize('container');
			});

			it('should hide view', function () {
				projectView.hide();

				expect($('.container')).toBeEmpty();
				expect($('.container')).not.toBeVisible();
			});

			it('should show view', function () {
				projectView.hide();
				
				projectView.show(json);

				expect($('.container')).toBeVisible();
			});
			
			it('should show groups', function () {
				projectView.show(json);

				expect($('.accordion-group').length).toBe(3);
			});
			
			it('should sort groups', function () {
				var unsortedJson = {
					items: [
						{
							id: 0,
							name: 'CruiseControl.NET',
							group: 'group 2',
							enabled: true,
							selected: true
						},
						{
							id: 1,
							name: 'ccTray',
							group: 'group 1',
							enabled: true,
							selected: false
						}
					]
				};
				
				projectView.show(unsortedJson);

				expect($('.accordion-group a').eq(0)).toHaveText('group 1');
				expect($('.accordion-group a').eq(1)).toHaveText('group 2');
			});

			it('should sort projects within a group', function () {
				var unsortedJson = {
					items: [
						{
							id: 0,
							name: 'project 2',
							group: 'some group',
							enabled: true,
							selected: true
						},
						{
							id: 1,
							name: 'project 1',
							group: 'some group',
							enabled: true,
							selected: false
						}
					]
				};
				
				projectView.show(unsortedJson);

				expect($('label span').eq(0)).toHaveText('project 1');
				expect($('label span').eq(1)).toHaveText('project 2');
			});

			it('should indicate disabled plans', function () {
				projectView.show(json);

				expect($('.project-item input').eq(2)).toBeDisabled();
				expect($('.project-item input').eq(0)).not.toBeDisabled();
			});

			it('should check selected projects', function () {
				projectView.show(json);

				expect($('.project-item input').eq(0)).toBeChecked();
				expect($('.project-item input').eq(1)).not.toBeChecked();
			});

			it('should expand projects that have monitored plans', function () {
				projectView.show(json);

				expect($('#project-group-0')).toHaveClass('in');
				expect($('#project-group-1')).not.toHaveClass('in');
			});

			it('should get selected keys', function () {
				projectView.show(json);

				var state = projectView.get();

				expect(state.projects.length).toBe(2);
				expect(state.projects[0]).toBe(0);
				expect(state.projects[1]).toBe(4);
			});
		});
	}
);