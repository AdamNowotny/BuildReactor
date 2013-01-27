define([
	'jquery',
	'hbs!templates/projectView',
	'hbs!templates/projectViewSelection',
	'common/sortBy',
	'rx',
	'bootstrap',
	'rx.jquery'
], function ($, projectViewTemplate, projectViewSelectionTemplate, sortBy, Rx) {

	'use strict';

	var rootElement;

	var initialize = function (rootClassName) {
		rootElement = $('.' + rootClassName);
	};

	var show = function (json) {
		refresh(json);
		initializeViewSelection(json, json.primaryView);
		updateView(json, json.primaryView);

		var filterText = $('.filter .search-query').keyupAsObservable()
			.doAction(resetFilterOnEsc)
			.select(function (e) { return e.target.value;	})
			.distinctUntilChanged()
			.doAction(filterResetToggle)
			.select(projectIdsForText)
			.doAction(toggleProjectsVisibility)
			.doAction(toggleGroupsVisibility)
			.subscribe();
		$('.filter i').clickAsObservable().subscribe(function (e) {
			$('.filter input').val('').keyup().focus();
		});
		$('.filter input').focus();
	};

	var projectIdsForText = function (text) {
		return Rx.Observable.fromArray($('#projects-accordion .project-item')).where(function (el) {
			return filterMatch(el, text);
		}).select(function (el) {
			return $(el).data('id');
		});
	};

	var toggleProjectsVisibility = function (projectIds) {
		$('#projects-accordion .project-item').hide();
		projectIds.doAction(function (id) {
				$('#projects-accordion .project-item[data-id="' + id + '"]').show();
			}).subscribe();
	};

	var toggleGroupsVisibility = function (_) {
		rootElement.find('.group').each(function (i, group) {
			var $group = $(this);
			$group.show();
			$group.find('.collapse').addClass('in');
			var items = $group.find('.project-item:visible').length;
			$(this).toggle(items !== 0);
		});
	};

	var filterMatch = function (el, text) {
		return $(el).text().toLowerCase().indexOf(text.toLowerCase()) >= 0;
	};

	var resetFilterOnEsc = function (e) {
		if (e.keyCode === 27) {
			$('.filter .search-query').val('').keyup();
		}
	};

	var filterResetToggle = function (text) {
		if (text === '') {
			$('.filter i').fadeOut(500);
		} else {
			$('.filter i').fadeIn(500);
		}
	};

	var updateView = function (json, viewName) {
		expandGroups(json.items);
		hideItemsNotInView(json.views, viewName);
		rootElement.show();
		hideGroupsWithNoVisibleItems();
	};

	var refresh = function (json) {
		var templateJson = createModel(json);
		var html = projectViewSelectionTemplate(templateJson);
		html += projectViewTemplate(templateJson);
		rootElement.html(html);
	};

	var initializeViewSelection = function (json, viewName) {
		rootElement.find('.view-selection').toggle(!!json.views);
		rootElement.find('.view-selection select').val(viewName);
		rootElement.find('.view-selection select').change(function (event) {
			var viewName = $(event.target).val();
			updateView(json, viewName);
		});
	};

	var expandGroups = function (items) {
		rootElement.collapse({ toggle: false });
		rootElement.find('.project-item input:checked').each(function () {
			$(this).closest('.collapse').addClass('in');
		});
		if (getGroups(items).length === 1) {
			rootElement.find('.collapse').addClass('in');
		}
	};

	var hideGroupsWithNoVisibleItems = function () {
		rootElement.find('.group').each(function (i, group) {
			var items = $(this).find('.project-item:visible').length;
			if (items === 0) {
				$(this).hide();
			}
		});
	};

	var hideItemsNotInView = function (views, viewName) {
		if (!views) {
			return;
		}
		var view = views.filter(function (view, i) {
			return view.name === viewName;
		});
		var viewItems = view.length ? view[0].items : null;
		$('.project-item').each(function (i, item) {
			$(this).toggle(viewItems.indexOf($(this).data('id')) > -1);
		});
	};

	var createModel = function (json) {
		sortBy('group', json.items);
		var groups = [];
		var groupNames = getGroups(json.items);
		for (var i = 0; i < groupNames.length; i++) {
			var groupName = groupNames[i];
			var itemsForGroup = getItemsForGroup(json.items, groupName);
			groups.push({
				items: itemsForGroup,
				name: groupName,
				id: i
			});
		}
		var model = {};
		if (groups.length > 0) {
			model.groups = groups;
		}
		if (json.views) {
			model.views = json.views;
		}
		return model;
	};

	var getGroups = function (items) {
		var groupList = [];
		items.forEach(function (item) {
			if (groupList.indexOf(item.group) === -1) {
				groupList.push(item.group);
			}
		});
		return groupList;
	};

	var getItemsForGroup = function (items, name) {
		sortBy('name', items);
		var groupItems = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.group === name) {
				groupItems.push(item);
			}
		}
		return groupItems;
	};

	var hide = function () {
		rootElement.hide().html('');
	};

	var get = function () {
		var projects = [];
		rootElement.find('.project-item input:checked').each(function () {
			projects.push($(this).parent('.project-item').data('id'));
		});
		return {
			projects: projects
		};
	};

	return {
		initialize: initialize,
		show: show,
		hide: hide,
		get: get
	};
});