define([
	'jquery',
	'hbs!templates/projectView',
	'hbs!templates/projectViewSelection',
	'bootstrap'
], function ($, projectViewTemplate, projectViewSelectionTemplate) {

	'use strict';
	
	var rootElement;
	var view;

	var initialize = function (rootClassName) {
		rootElement = $('.' + rootClassName);
	};

	var show = function (json) {
		updateView(json, json.primaryView);
	};

	var updateView = function (json, viewName) {
		view = viewName;
		var templateJson = createModel(json);
		var html = projectViewSelectionTemplate(templateJson);
		html += projectViewTemplate(templateJson);
		rootElement.html(html);
		rootElement.find('.view-selection').toggle(!!json.views);
		rootElement.find('.view-selection select').val(viewName);
		rootElement.find('.view-selection select').change(function (event) {
			var viewName = $(event.target).val();
			updateView(json, viewName);
		});
		rootElement.collapse({ toggle: false });
		expandGroups(json.items);
		hideItemsNotInView(json.views, viewName);
		rootElement.show();
		hideGroupsWithNoVisibleItems();
	};

	var expandGroups = function (items) {
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
		return {
			groups: groups,
			views: json.views
		};
	};

	var sortBy = function (propertyName, json) {
		json.sort(function (a, b) {
			return ((a[propertyName] < b[propertyName]) ?
				-1 :
				((a[propertyName] > b[propertyName]) ? 1 : 0));
		});
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