define([
	'common/resourceFinder',
	'signals',
	'jquery',
	'hbs!templates/serviceListItem'
], function (resourceFinder, signals, $, serviceListItemTemplate) {

	'use strict';
	
	var itemClicked = new signals.Signal();
	var itemSelected = new signals.Signal();

	var load = function (settings) {
		render(settings);
		if (!isEmpty()) {
			selectFirst();
		}
	};

	var update = function (settings) {
		var selectedIndex = getSelectedIndex();
		render(settings);
		if (!isEmpty()) {
			selectAt(selectedIndex);
		}
	};

	var getSelectedName = function () {
		return $('.service-list li.active .pill-name').text();
	};

	var render = function (settings) {
		var templateData = createTemplateData(settings);
		var html = serviceListItemTemplate(templateData);
		$(".service-list").html(html);
		$('.service-list li').click(function (event) {
			event.preventDefault();
			itemClicked.dispatch(this);
		});
	};

	var createTemplateData = function (settings) {
		var data = [];
		for (var i = 0; i < settings.length; i++) {
			data[i] = {
				index: i,
				icon: resourceFinder.icon(settings[i].icon),
				name: settings[i].name,
				disabled: settings[i].disabled
			};
		}
		return {
			services: data
		};
	};

	var selectFirst = function () {
		selectItem($('.service-list li:first')[0]);
	};

	var selectLast = function () {
		selectItem($('.service-list li:last')[0]);
	};

	var selectItem = function (linkElement) {
		activateItem(linkElement);
		itemSelected.dispatch(linkElement);
	};

	var activateItem = function (linkElement) {
		if (!linkElement) {
			unselect();
			return;
		}
		var serviceLink = $(linkElement);
		if (serviceLink.hasClass('active')) {
			return;
		}
		unselect();
		serviceLink.addClass('active');
	};

	var unselect = function () {
		$('.service-list li').removeClass('active');
	};

	var selectAt = function (index) {
		var lastIndex = $('.service-list li:last').index();
		if (isEmpty()) {
			return;
		}
		if (index > lastIndex) {
			index = lastIndex;
		}
		var menuItem = $('.service-list li').eq(index);
		activateItem(menuItem);
	};

	var isEmpty = function () {
		var lastIndex = $('.service-list li:last').index();
		return lastIndex < 0;
	};

	var getSelectedIndex = function () {
		return $('.service-list li.active').index();
	};

	return {
		load: load,
		update: update,
		itemClicked: itemClicked,
		itemSelected: itemSelected,
		selectItem: selectItem,
		selectLast: selectLast,
		getSelectedName: getSelectedName
	};
});