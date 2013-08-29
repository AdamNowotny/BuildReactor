define([
	'options/projectView',
	'jquery'
],
	function (projectView, $) {

		'use strict';

		describe('options/projectView', function () {

			var json;

			beforeEach(function () {
				json = {
					primaryView: 'All',
					views: [
						{
							name: 'All disabled',
							items: [ 2 ]
						},
						{
							name: 'All',
							items: [ 0, 1, 2, 3, 4 ]
						},
						{
							name: 'Unstable',
							items: [ 3, 4 ]
						}
					],
					items: [
						{
							id: 0,
							name: 'CruiseControl.NET',
							group: 'cc',
							isDisabled: false
						},
						{
							id: 1,
							name: 'ccTray',
							group: 'cc',
							isDisabled: false
						},
						{
							id: 2,
							name: 'old ccTray',
							group: 'cc',
							isDisabled: true
						},
						{
							id: 3,
							name: 'Project2-1',
							group: 'group2',
							isDisabled: false
						},
						{
							id: 4,
							name: 'Project3-1',
							group: 'group3',
							isDisabled: false
						}
					],
					selected: [	0, 4 ]
				};
				setFixtures('<div class="container" style="display: none">content</div>');
				projectView.initialize('container');
			});

			function getViewByName(viewName) {
				var view = json.views.filter(function (view, index) {
					return view.name === json.primaryView;
				});
				return view.length ? view[0] : null;
			}

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
							isDisabled: false
						},
						{
							id: 1,
							name: 'ccTray',
							group: 'group 1',
							isDisabled: false
						}
					],
					selected: [ 0 ]
				};

				projectView.show(unsortedJson);

				expect($('.accordion-group a').eq(0)).toHaveText('group 1');
				expect($('.accordion-group a').eq(1)).toHaveText('group 2');
			});

			it('should sort projects by name within a group', function () {
				var unsortedJson = {
					items: [
						{
							id: 0,
							name: 'project 2',
							group: 'some group',
							isDisabled: false
						},
						{
							id: 1,
							name: 'project 1',
							group: 'some group',
							isDisabled: false
						}
					],
					selected: [ 0 ]
				};

				projectView.show(unsortedJson);

				expect($('label span').eq(0)).toHaveText('project 1');
				expect($('label span').eq(1)).toHaveText('project 2');
			});

			it('should indicate disabled plans', function () {
				projectView.show(json);

				expect($('.project-item-name').eq(2)).toHaveClass('muted');
				expect($('.project-item-name').eq(0)).not.toHaveClass('muted');
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

			it('should display as "Projects" group if no group exists', function () {
				var noGroupJson = {
					items: [
						{
							id: 'proj1',
							name: 'project 1',
							group: undefined
						},
						{
							id: 'proj2',
							name: 'project 2',
							group: undefined
						}
					]
				};

				projectView.show(noGroupJson);

				expect($('.accordion-group a').eq(0)).toHaveText('Projects');
			});

			it('should expand if only 1 group present', function () {
				var noGroupJson = {
					items: [
						{
							id: 'proj1',
							name: 'project 1',
							group: 'group'
						},
						{
							id: 'proj2',
							name: 'project 2',
							group: 'group'
						}
					]
				};

				projectView.show(noGroupJson);

				expect($('#project-group-0')).toHaveClass('in');
			});

			it('should get selected keys', function () {
				projectView.show(json);

				var state = projectView.get();

				expect(state.projects.length).toBe(2);
				expect(state.projects[0]).toBe(0);
				expect(state.projects[1]).toBe(4);
			});

			it('should show alert if no projects available', function () {
				json.items = [];
				projectView.show(json);

				expect($('.container .alert').text()).toBe('No projects available');
			});

			describe('views', function () {

				it('should show available views', function () {
					projectView.show(json);

					expect($('.view-selection')).toBeVisible();
					expect($('.view-selection option').length).toBe(json.views.length);
				});

				it('should select primary view', function () {
					projectView.show(json);

					expect($('.view-selection select').val()).toBe(json.primaryView);
				});

				it('should show primary view', function () {
					projectView.show(json);

					expect($('.project-item').length).toBe(getViewByName(json.primaryView).items.length);
				});

				it('should switch to selected view', function () {
					projectView.show(json);

					$('.view-selection select').val('Unstable').change();

					expect($('.view-selection select').val()).toBe('Unstable');
					expect($('.project-item:visible').length).toBe(2);
				});

				it('should clear filter when view changed', function () {
					projectView.show(json);
					$('.filter input').val('cc');

					$('.view-selection select').val('Unstable').change();

					expect($('.filter input')).toHaveValue('');
				});

				it('should focus on filter when view changed', function () {
					projectView.show(json);

					$('.view-selection select').focus().val('Unstable').change();

					expect($(document.activeElement)).toHaveClass('search-query');
				});

				it('should not show view selection if no views defined', function () {
					delete json.primaryView;
					delete json.views;
					projectView.show(json);

					expect($('.view-selection')).not.toBeVisible();
				});

				it('should get selected keys from all views', function () {
					projectView.show(json);
					$('.view-selection select').val('Unstable').change();

					var state = projectView.get();

					expect(state.projects.length).toBe(2);
					expect(state.projects[0]).toBe(0);
					expect(state.projects[1]).toBe(4);
					expect($('.project-item:visible input:checked').length).toBe(1);
				});

				it('should hide groups not in view', function () {
					json.primaryView = 'Unstable';

					projectView.show(json);

					expect($('.group:visible').length).toBe(2);
					expect($('.group:visible .accordion-heading')).not.toHaveText('cc');
				});

			});

			describe('filtering', function () {

				it('should reset filter if icon clicked', function () {
					projectView.show(json);
					$('.filter input').val('something');

					$('.filter i').click();

					expect($('.filter input')).toHaveValue('');
				});

				it('should show projects matching filter', function () {
					projectView.show(json);

					$('.filter input').val('cc').keyup();

					expect($('.project-item[data-id=1]')).toBeVisible();
					expect($('.project-item[data-id=2]')).toBeVisible();
				});

				it('should hide projects not matching filter', function () {
					projectView.show(json);

					$('.filter input').val('cc').keyup();

					expect($('.project-item[data-id=0]')).not.toBeVisible();
					expect($('.project-item[data-id=3]')).not.toBeVisible();
					expect($('.project-item[data-id=4]')).not.toBeVisible();
				});

				it('should not show projects matching filter from other views', function () {
					projectView.show(json);
					$('.view-selection select').val('Unstable').change();

					$('.filter input').val('r').keyup();

					expect($('.project-item[data-id=1]')).not.toBeVisible();
					expect($('.project-item[data-id=2]')).not.toBeVisible();
				});

				it('should activate filter on show', function () {
					projectView.show(json);

					expect($(document.activeElement)).toHaveClass('search-query');
				});


			});

		});
	}
);