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

		var filterText = rootElement.find('.filter .search-query').keyupAsObservable()
			.doAction(resetFilterOnEsc)
			.select(function (e) { return e.target.value;	})
			.distinctUntilChanged()
			.doAction(filterResetToggle)
			.select(projectsForText)
			.select(function (projectsText) { return projectsInCurrentView(projectsText, json.views); })
			.doAction(toggleProjectsVisibility)
			.doAction(toggleGroupsVisibility)
			.doAction(showFilterCount)
			.doAction(toggleCheckAll)
			.doAction(highlightFilterText)
			.subscribe();

		rootElement.find('.filter i').clickAsObservable().subscribe(function (e) {
			rootElement.find('.filter input').val('').keyup().focus();
		});
		rootElement.find('.check-all').clickAsObservable()
			.select(function (e) { return $(e.target); })
			.select(function (el) {
				return {
					checked: el.attr('checked') !== undefined,
					projectItems: el.closest('.group').find('.project-item input:visible')
				};
			})
			.subscribe(function (value) {
				if (value.checked) {
					value.projectItems.attr('checked', 'checked');
				} else {
					value.projectItems.removeAttr('checked');
				}
			});
		rootElement.find('.filter input').focus();
	};

	var toggleProjectsVisibility = function (value) {
		rootElement.find('.project-item').hide();
		value.projects.doAction(function (id) {
				rootElement.find('.project-item[data-id="' + id + '"]').show();
			}).subscribe();
	};

	var toggleGroupsVisibility = function () {
		rootElement.find('.group').each(function (i, group) {
			var $group = $(this);
			$group.show();
			$group.find('.collapse').addClass('in');
			var items = $group.find('.project-item:visible').length;
			$(this).toggle(items !== 0);
		});
	};
	var showFilterCount = function (value) {
		$('.group:visible').each(function (i, group) {
			var all = $(this).find('.project-item').length;
			var visible = $(this).find('.project-item:visible').length;
			var text = (visible === all || value.text === '') ? '' : visible + '/' + all;
			$(this).find('.filter-count').text(text);
		});
	};
	var toggleCheckAll = function () {
		Rx.Observable.fromArray(rootElement.find('.group:visible'))
			.select(function (group) {
				return {
					checkAll: $(group).find('.check-all'),
					checkedCount: $(group).find('.project-item:visible input:checked').length,
					visibleCount: $(group).find('.project-item:visible').length
				};
			})
			.doAction(function (groupInfo) {
				if (groupInfo.checkedCount === groupInfo.visibleCount) {
					groupInfo.checkAll.attr('checked', 'checked');
				} else {
					groupInfo.checkAll.removeAttr('checked');
				}
			})
			.subscribe();
	};
	var highlightFilterText = function (projectsText) {
		rootElement.find('.project-item').each(function (i, item) {
			var name = $(item).find('.project-item-name').text();
			var html = name;
			if (projectsText.text !== '') {
				var startAt = name.toLowerCase().indexOf(projectsText.text.toLowerCase());
				if (startAt !== -1) {
					var endAt = startAt + projectsText.text.length;
					var beforeSpan = name.substring(0, startAt);
					var span = '<b>' + name.substring(startAt, endAt) + '</b>';
					var afterSpan = name.substring(endAt, name.length);
					html = beforeSpan + span + afterSpan;
				}
			}
			$(item).find('.project-item-name').html(html);
		});
	};

	var projectsForText = function (text) {
		var filterMatch = function (el, text) {
			return $(el).text().toLowerCase().indexOf(text.toLowerCase()) >= 0;
		};

		return {
			text: text,
			projects: Rx.Observable.fromArray(rootElement.find('.project-item'))
				.where(function (el) { return filterMatch(el, text); })
				.select(function (el) { return $(el).data('id'); })
		};
	};

	var projectsInCurrentView = function (projectText, views) {
		if (!views) { return projectText; }
		var viewName = rootElement.find('.view-selection select').val();
		var view = views.filter(function (view, i) {
			return view.name === viewName;
		});
		var viewItems = view.length ? view[0].items : null;
		return {
			text: projectText.text,
			projects: projectText.projects.where(function (id) {
					return viewItems.indexOf(id) !== -1;
				})
		};
	};

	var resetFilterOnEsc = function (e) {
		if (e.keyCode === 27) {
			rootElement.find('.filter .search-query').val('').keyup();
		}
	};

	var filterResetToggle = function (text) {
		if (text === '') {
			rootElement.find('.filter i').fadeOut(500);
		} else {
			rootElement.find('.filter i').fadeIn(500);
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
			$('.filter input').val('').keyup().focus();
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
		rootElement.find('.project-item').each(function (i, item) {
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