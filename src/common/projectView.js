define([
	'jquery',
	'text!./projectViewTemplate.hbs',
	'handlebars',
	'bootstrap'
], function ($, planSelectionText, handlebars) {

	'use strict';
	
	var planSelectionTemplate = handlebars.compile(planSelectionText),
		rootElement;

	var initialize = function (rootClassName) {
		rootElement = $('.' + rootClassName);
	};

	var show = function (json) {
		var templateJson = createModel(json),
			html = planSelectionTemplate(templateJson);
		rootElement.html(html);
		rootElement.collapse({ toggle: false});
		rootElement.find('.project-item input:checked').each(function () {
			$(this).closest('.collapse').addClass('in');
		});
		rootElement.show();
	};

	var createModel = function (json) {
		sortBy('group', json.items);
		var groups = [],
			groupNames = getGroups(json.items);
		for (var i = 0; i < groupNames.length; i++) {
			var groupName = groupNames[i],
				itemsForGroup = getItemsForGroup(json.items, groupName);
			groups.push({
				items: itemsForGroup,
				name: groupName,
				id: i
			});
		}
		return {
			groups: groups
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