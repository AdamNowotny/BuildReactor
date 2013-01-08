define([
	'jquery',
	'hbs!templates/popup',
	'rx'
], function ($, popupTemplate, Rx) {

	'use strict';
	
	function show(state) {
		var model = createModel(state);
		var html = popupTemplate({ services: model });
		$('.service-info-container').html(html);
	}

	function createModel(state) {
		return state.map(function (serviceState) {
			return {
				name: serviceState.name,
				groups: getGroups(serviceState.items)
			};
		});
	}

	function getGroups(items) {
		sortBy('group', items);
		var model = [];
		Rx.Observable.fromArray(items).groupBy(function (item) {
			return item.group || '';
		}).subscribe(function (group) {
			var groupModel = {
				name: group.key,
				items: []
			};
			model.push(groupModel);
			group.subscribe(function (item) {
				groupModel.items.push(item);
			});
		});
		return model;
	}

	var sortBy = function (propertyName, items) {
		items.sort(function (a, b) {
			return ((a[propertyName] < b[propertyName]) ?
				-1 :
				((a[propertyName] > b[propertyName]) ? 1 : 0));
		});
	};

	return {
		show: show
	};
});
