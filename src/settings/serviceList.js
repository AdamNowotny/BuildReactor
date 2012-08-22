define([
	'signals',
	'jquery',
	'hbs!templates/serviceListItem'
], function (signals, $, serviceListItemTemplate) {

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
		return $('#service-list li.active .service-type-name').text();
	};

	var render = function (settings) {
		var templateData = createTemplateData(settings);
		var html = serviceListItemTemplate(templateData);
		$("#service-list").html(html);
		$('#service-list li').click(function (event) {
			event.preventDefault();
			itemClicked.dispatch(this);
		});
	};

	var createTemplateData = function (settings) {
		var data = [];
		for (var i = 0; i < settings.length; i++) {
			data[i] = {
				index: i,
				icon: settings[i].icon,
				name: settings[i].name
			};
		}
		return {
			services: data
		};
	};

	var selectFirst = function () {
		selectItem($('#service-list li:first')[0]);
	};

	var selectLast = function () {
		selectItem($('#service-list li:last')[0]);
	};

	var selectItem = function (linkElement) {
		var serviceLink = $(linkElement);
		if (serviceLink.hasClass('active')) {
			return;
		}
		$('#service-list li').removeClass('active');
		serviceLink.addClass('active');
		itemSelected.dispatch(linkElement);
	};

	var selectAt = function (index) {
		var lastIndex = $('#service-list li:last').index();
		if (isEmpty()) {
			return;
		}
		if (index > lastIndex) {
			index = lastIndex;
		}
		var menuItem = $('#service-list li').eq(index);
		selectItem(menuItem);
	};

	var isEmpty = function () {
		var lastIndex = $('#service-list li:last').index();
		return lastIndex < 0;
	};

	var getSelectedIndex = function () {
		return $('#service-list li.active').index();
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