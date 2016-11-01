webpackJsonp([4],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(62);

	__webpack_require__(71);

	__webpack_require__(106);

	__webpack_require__(32);

	__webpack_require__(108);

	__webpack_require__(109);

	__webpack_require__(113);

	__webpack_require__(151);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	var _coreLogger = __webpack_require__(101);

	var _coreLogger2 = _interopRequireDefault(_coreLogger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _coreLogger2.default)();
	_core2.default.init();

	_angular2.default.element(document).ready(function () {
		_angular2.default.bootstrap(document, ['settings']);
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 107 */,
/* 108 */
/***/ function(module, exports) {

	/*
	 * HTML5 Sortable jQuery Plugin
	 * https://github.com/voidberg/html5sortable
	 *
	 * Original code copyright 2012 Ali Farhadi.
	 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
	 *
	 *
	 * Released under the MIT license.
	 */
	'use strict';
	/*
	 * variables global to the plugin
	 */
	var dragging;
	var draggingHeight;
	var placeholders = $();
	var sortables = [];
	/*
	 * remove event handlers from items
	 * @param [jquery Collection] items
	 * @info event.h5s (jquery way of namespacing events, to bind multiple handlers to the event)
	 */
	var _removeItemEvents = function(items) {
	  items.off('dragstart.h5s');
	  items.off('dragend.h5s');
	  items.off('selectstart.h5s');
	  items.off('dragover.h5s');
	  items.off('dragenter.h5s');
	  items.off('drop.h5s');
	};
	/*
	 * remove event handlers from sortable
	 * @param [jquery Collection] sortable
	 * @info event.h5s (jquery way of namespacing events, to bind multiple handlers to the event)
	 */
	var _removeSortableEvents = function(sortable) {
	  sortable.off('dragover.h5s');
	  sortable.off('dragenter.h5s');
	  sortable.off('drop.h5s');
	};
	/*
	 * attache ghost to dataTransfer object
	 * @param [event] original event
	 * @param [object] ghost-object with item, x and y coordinates
	 */
	var _attachGhost = function(event, ghost) {
	  // this needs to be set for HTML5 drag & drop to work
	  event.dataTransfer.effectAllowed = 'move';
	  event.dataTransfer.setData('text', '');

	  // check if setDragImage method is available
	  if (event.dataTransfer.setDragImage) {
	    event.dataTransfer.setDragImage(ghost.item, ghost.x, ghost.y);
	  }
	};
	/**
	 * _addGhostPos clones the dragged item and adds it as a Ghost item
	 * @param [object] event - the event fired when dragstart is triggered
	 * @param [object] ghost - .item = node, draggedItem = jQuery collection
	 */
	var _addGhostPos = function(e, ghost) {
	  if (!ghost.x) {
	    ghost.x = parseInt(e.pageX - ghost.draggedItem.offset().left);
	  }
	  if (!ghost.y) {
	    ghost.y = parseInt(e.pageY - ghost.draggedItem.offset().top);
	  }
	  return ghost;
	};
	/**
	 * _makeGhost decides which way to make a ghost and passes it to attachGhost
	 * @param [jQuery selection] $draggedItem - the item that the user drags
	 */
	var _makeGhost = function($draggedItem) {
	  return {
	    item: $draggedItem[0],
	    draggedItem: $draggedItem
	  };
	};
	/**
	 * _getGhost constructs ghost and attaches it to dataTransfer
	 * @param [event] event - the original drag event object
	 * @param [jQuery selection] $draggedItem - the item that the user drags
	 * @param [object] ghostOpt - the ghost options
	 */
	// TODO: could $draggedItem be replaced by event.target in all instances
	var _getGhost = function(event, $draggedItem) {
	  // add ghost item & draggedItem to ghost object
	  var ghost = _makeGhost($draggedItem);
	  // attach ghost position
	  ghost = _addGhostPos(event, ghost);
	  // attach ghost to dataTransfer
	  _attachGhost(event, ghost);
	};
	/*
	 * return options if not set on sortable already
	 * @param [object] soptions
	 * @param [object] options
	 */
	var _getOptions = function(soptions, options) {
	  if (typeof soptions === 'undefined') {
	    return options;
	  }
	  return soptions;
	};
	/*
	 * remove data from sortable
	 * @param [jquery Collection] a single sortable
	 */
	var _removeSortableData = function(sortable) {
	  sortable.removeData('opts');
	  sortable.removeData('connectWith');
	  sortable.removeData('items');
	  sortable.removeAttr('aria-dropeffect');
	};
	/*
	 * remove data from items
	 * @param [jquery Collection] items
	 */
	var _removeItemData = function(items) {
	  items.removeAttr('aria-grabbed');
	  items.removeAttr('draggable');
	  items.removeAttr('role');
	};
	/*
	 * check if two lists are connected
	 * @param [jquery Collection] items
	 */
	var _listsConnected = function(curList, destList) {
	  if (curList[0] === destList[0]) {
	    return true;
	  }
	  if (curList.data('connectWith') !== undefined) {
	    return curList.data('connectWith') === destList.data('connectWith');
	  }
	  return false;
	};
	/*
	 * destroy the sortable
	 * @param [jquery Collection] a single sortable
	 */
	var _destroySortable = function(sortable) {
	  var opts = sortable.data('opts') || {};
	  var items = sortable.children(opts.items);
	  var handles = opts.handle ? items.find(opts.handle) : items;
	  // remove event handlers & data from sortable
	  _removeSortableEvents(sortable);
	  _removeSortableData(sortable);
	  // remove event handlers & data from items
	  handles.off('mousedown.h5s');
	  _removeItemEvents(items);
	  _removeItemData(items);
	};
	/*
	 * enable the sortable
	 * @param [jquery Collection] a single sortable
	 */
	var _enableSortable = function(sortable) {
	  var opts = sortable.data('opts');
	  var items = sortable.children(opts.items);
	  var handles = opts.handle ? items.find(opts.handle) : items;
	  sortable.attr('aria-dropeffect', 'move');
	  handles.attr('draggable', 'true');
	  // IE FIX for ghost
	  // can be disabled as it has the side effect that other events
	  // (e.g. click) will be ignored
	  var spanEl = (document || window.document).createElement('span');
	  if (typeof spanEl.dragDrop === 'function' && !opts.disableIEFix) {
	    handles.on('mousedown.h5s', function() {
	      if (items.index(this) !== -1) {
	        this.dragDrop();
	      } else {
	        $(this).parents(opts.items)[0].dragDrop();
	      }
	    });
	  }
	};
	/*
	 * disable the sortable
	 * @param [jquery Collection] a single sortable
	 */
	var _disableSortable = function(sortable) {
	  var opts = sortable.data('opts');
	  var items = sortable.children(opts.items);
	  var handles = opts.handle ? items.find(opts.handle) : items;
	  sortable.attr('aria-dropeffect', 'none');
	  handles.attr('draggable', false);
	  handles.off('mousedown.h5s');
	};
	/*
	 * reload the sortable
	 * @param [jquery Collection] a single sortable
	 * @description events need to be removed to not be double bound
	 */
	var _reloadSortable = function(sortable) {
	  var opts = sortable.data('opts');
	  var items = sortable.children(opts.items);
	  var handles = opts.handle ? items.find(opts.handle) : items;
	  // remove event handlers from items
	  _removeItemEvents(items);
	  handles.off('mousedown.h5s');
	  // remove event handlers from sortable
	  _removeSortableEvents(sortable);
	};
	/*
	 * public sortable object
	 * @param [object|string] options|method
	 */
	var sortable = function(selector, options) {

	  var $sortables = $(selector);
	  var method = String(options);

	  options = $.extend({
	    connectWith: false,
	    placeholder: null,
	    // dragImage can be null or a jQuery element
	    dragImage: null,
	    disableIEFix: false,
	    placeholderClass: 'sortable-placeholder',
	    draggingClass: 'sortable-dragging',
	    hoverClass: false
	  }, options);

	  /* TODO: maxstatements should be 25, fix and remove line below */
	  /*jshint maxstatements:false */
	  return $sortables.each(function() {

	    var $sortable = $(this);

	    if (/enable|disable|destroy/.test(method)) {
	      sortable[method]($sortable);
	      return;
	    }

	    // get options & set options on sortable
	    options = _getOptions($sortable.data('opts'), options);
	    $sortable.data('opts', options);
	    // reset sortable
	    _reloadSortable($sortable);
	    // initialize
	    var items = $sortable.children(options.items);
	    var index;
	    var startParent;
	    var newParent;
	    var placeholder = (options.placeholder === null) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="' + options.placeholderClass + '"/>') : $(options.placeholder).addClass(options.placeholderClass);

	    // setup sortable ids
	    if (!$sortable.attr('data-sortable-id')) {
	      var id = sortables.length;
	      sortables[id] = $sortable;
	      $sortable.attr('data-sortable-id', id);
	      items.attr('data-item-sortable-id', id);
	    }

	    $sortable.data('items', options.items);
	    placeholders = placeholders.add(placeholder);
	    if (options.connectWith) {
	      $sortable.data('connectWith', options.connectWith);
	    }

	    _enableSortable($sortable);
	    items.attr('role', 'option');
	    items.attr('aria-grabbed', 'false');

	    // Mouse over class
	    if (options.hoverClass) {
	      var hoverClass = 'sortable-over';
	      if (typeof options.hoverClass === 'string') {
	        hoverClass = options.hoverClass;
	      }

	      items.hover(function() {
	        $(this).addClass(hoverClass);
	      }, function() {
	        $(this).removeClass(hoverClass);
	      });
	    }

	    // Handle drag events on draggable items
	    items.on('dragstart.h5s', function(e) {
	      e.stopImmediatePropagation();

	      if (options.dragImage) {
	        _attachGhost(e.originalEvent, {
	          item: options.dragImage,
	          x: 0,
	          y: 0
	        });
	        console.log('WARNING: dragImage option is deprecated' +
	        ' and will be removed in the future!');
	      } else {
	        // add transparent clone or other ghost to cursor
	        _getGhost(e.originalEvent, $(this), options.dragImage);
	      }
	      // cache selsection & add attr for dragging
	      dragging = $(this);
	      dragging.addClass(options.draggingClass);
	      dragging.attr('aria-grabbed', 'true');
	      // grab values
	      index = dragging.index();
	      draggingHeight = dragging.height();
	      startParent = $(this).parent();
	      // trigger sortstar update
	      dragging.parent().triggerHandler('sortstart', {
	        item: dragging,
	        placeholder: placeholder,
	        startparent: startParent
	      });
	    });
	    // Handle drag events on draggable items
	    items.on('dragend.h5s', function() {
	      if (!dragging) {
	        return;
	      }
	      // remove dragging attributes and show item
	      dragging.removeClass(options.draggingClass);
	      dragging.attr('aria-grabbed', 'false');
	      dragging.show();

	      placeholders.detach();
	      newParent = $(this).parent();
	      dragging.parent().triggerHandler('sortstop', {
	        item: dragging,
	        startparent: startParent,
	      });
	      if (index !== dragging.index() ||
	          startParent.get(0) !== newParent.get(0)) {
	        dragging.parent().triggerHandler('sortupdate', {
	          item: dragging,
	          index: newParent.children(newParent.data('items')).index(dragging),
	          oldindex: items.index(dragging),
	          elementIndex: dragging.index(),
	          oldElementIndex: index,
	          startparent: startParent,
	          endparent: newParent
	        });
	      }
	      dragging = null;
	      draggingHeight = null;
	    });
	    // Handle drop event on sortable & placeholder
	    // TODO: REMOVE placeholder?????
	    $(this).add([placeholder]).on('drop.h5s', function(e) {
	      if (!_listsConnected($sortable, $(dragging).parent())) {
	        return;
	      }

	      e.stopPropagation();
	      placeholders.filter(':visible').after(dragging);
	      dragging.trigger('dragend.h5s');
	      return false;
	    });

	    // Handle dragover and dragenter events on draggable items
	    items.add([this]).on('dragover.h5s dragenter.h5s', function(e) {
	      if (!_listsConnected($sortable, $(dragging).parent())) {
	        return;
	      }

	      e.preventDefault();
	      e.originalEvent.dataTransfer.dropEffect = 'move';
	      if (items.is(this)) {
	        var thisHeight = $(this).height();
	        if (options.forcePlaceholderSize) {
	          placeholder.height(draggingHeight);
	        }

	        // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
	        if (thisHeight > draggingHeight) {
	          // Dead zone?
	          var deadZone = thisHeight - draggingHeight;
	          var offsetTop = $(this).offset().top;
	          if (placeholder.index() < $(this).index() &&
	              e.originalEvent.pageY < offsetTop + deadZone) {
	            return false;
	          }
	          if (placeholder.index() > $(this).index() &&
	              e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
	            return false;
	          }
	        }

	        dragging.hide();
	        if (placeholder.index() < $(this).index()) {
	          $(this).after(placeholder);
	        } else {
	          $(this).before(placeholder);
	        }
	        placeholders.not(placeholder).detach();
	      } else {
	        if (!placeholders.is(this) && !$(this).children(options.items).length) {
	          placeholders.detach();
	          $(this).append(placeholder);
	        }
	      }
	      return false;
	    });
	  });
	};

	sortable.destroy = function(sortable) {
	  _destroySortable(sortable);
	};

	sortable.enable = function(sortable) {
	  _enableSortable(sortable);
	};

	sortable.disable = function(sortable) {
	  _disableSortable(sortable);
	};

	$.fn.sortable = function(options) {
	  return sortable(this, options);
	};
	/* start-testing */
	sortable.__testing = {
	  // add internal methods here for testing purposes
	  _removeSortableEvents: _removeSortableEvents,
	  _removeItemEvents: _removeItemEvents,
	  _removeItemData: _removeItemData,
	  _removeSortableData: _removeSortableData,
	  _listsConnected: _listsConnected,
	  _getOptions: _getOptions,
	  _attachGhost: _attachGhost,
	  _addGhostPos: _addGhostPos,
	  _getGhost: _getGhost,
	  _makeGhost: _makeGhost
	};
	module.exports = sortable;
	/* end-testing */


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(110);

	__webpack_require__(82);

	__webpack_require__(86);

	__webpack_require__(111);

	__webpack_require__(112);

	__webpack_require__(90);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _angular2.default.module('settings', ['ngRoute', 'ui.bootstrap', 'ui.highlight', 'ui.indeterminate', 'htmlSortable', 'app.directives']);

/***/ },
/* 110 */
/***/ function(module, exports) {

	/* ========================================================================
	 * Bootstrap: modal.js v3.3.7
	 * http://getbootstrap.com/javascript/#modals
	 * ========================================================================
	 * Copyright 2011-2016 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */


	+function ($) {
	  'use strict';

	  // MODAL CLASS DEFINITION
	  // ======================

	  var Modal = function (element, options) {
	    this.options             = options
	    this.$body               = $(document.body)
	    this.$element            = $(element)
	    this.$dialog             = this.$element.find('.modal-dialog')
	    this.$backdrop           = null
	    this.isShown             = null
	    this.originalBodyPad     = null
	    this.scrollbarWidth      = 0
	    this.ignoreBackdropClick = false

	    if (this.options.remote) {
	      this.$element
	        .find('.modal-content')
	        .load(this.options.remote, $.proxy(function () {
	          this.$element.trigger('loaded.bs.modal')
	        }, this))
	    }
	  }

	  Modal.VERSION  = '3.3.7'

	  Modal.TRANSITION_DURATION = 300
	  Modal.BACKDROP_TRANSITION_DURATION = 150

	  Modal.DEFAULTS = {
	    backdrop: true,
	    keyboard: true,
	    show: true
	  }

	  Modal.prototype.toggle = function (_relatedTarget) {
	    return this.isShown ? this.hide() : this.show(_relatedTarget)
	  }

	  Modal.prototype.show = function (_relatedTarget) {
	    var that = this
	    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

	    this.$element.trigger(e)

	    if (this.isShown || e.isDefaultPrevented()) return

	    this.isShown = true

	    this.checkScrollbar()
	    this.setScrollbar()
	    this.$body.addClass('modal-open')

	    this.escape()
	    this.resize()

	    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

	    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
	      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
	        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
	      })
	    })

	    this.backdrop(function () {
	      var transition = $.support.transition && that.$element.hasClass('fade')

	      if (!that.$element.parent().length) {
	        that.$element.appendTo(that.$body) // don't move modals dom position
	      }

	      that.$element
	        .show()
	        .scrollTop(0)

	      that.adjustDialog()

	      if (transition) {
	        that.$element[0].offsetWidth // force reflow
	      }

	      that.$element.addClass('in')

	      that.enforceFocus()

	      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

	      transition ?
	        that.$dialog // wait for modal to slide in
	          .one('bsTransitionEnd', function () {
	            that.$element.trigger('focus').trigger(e)
	          })
	          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
	        that.$element.trigger('focus').trigger(e)
	    })
	  }

	  Modal.prototype.hide = function (e) {
	    if (e) e.preventDefault()

	    e = $.Event('hide.bs.modal')

	    this.$element.trigger(e)

	    if (!this.isShown || e.isDefaultPrevented()) return

	    this.isShown = false

	    this.escape()
	    this.resize()

	    $(document).off('focusin.bs.modal')

	    this.$element
	      .removeClass('in')
	      .off('click.dismiss.bs.modal')
	      .off('mouseup.dismiss.bs.modal')

	    this.$dialog.off('mousedown.dismiss.bs.modal')

	    $.support.transition && this.$element.hasClass('fade') ?
	      this.$element
	        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
	        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
	      this.hideModal()
	  }

	  Modal.prototype.enforceFocus = function () {
	    $(document)
	      .off('focusin.bs.modal') // guard against infinite focus loop
	      .on('focusin.bs.modal', $.proxy(function (e) {
	        if (document !== e.target &&
	            this.$element[0] !== e.target &&
	            !this.$element.has(e.target).length) {
	          this.$element.trigger('focus')
	        }
	      }, this))
	  }

	  Modal.prototype.escape = function () {
	    if (this.isShown && this.options.keyboard) {
	      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
	        e.which == 27 && this.hide()
	      }, this))
	    } else if (!this.isShown) {
	      this.$element.off('keydown.dismiss.bs.modal')
	    }
	  }

	  Modal.prototype.resize = function () {
	    if (this.isShown) {
	      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
	    } else {
	      $(window).off('resize.bs.modal')
	    }
	  }

	  Modal.prototype.hideModal = function () {
	    var that = this
	    this.$element.hide()
	    this.backdrop(function () {
	      that.$body.removeClass('modal-open')
	      that.resetAdjustments()
	      that.resetScrollbar()
	      that.$element.trigger('hidden.bs.modal')
	    })
	  }

	  Modal.prototype.removeBackdrop = function () {
	    this.$backdrop && this.$backdrop.remove()
	    this.$backdrop = null
	  }

	  Modal.prototype.backdrop = function (callback) {
	    var that = this
	    var animate = this.$element.hasClass('fade') ? 'fade' : ''

	    if (this.isShown && this.options.backdrop) {
	      var doAnimate = $.support.transition && animate

	      this.$backdrop = $(document.createElement('div'))
	        .addClass('modal-backdrop ' + animate)
	        .appendTo(this.$body)

	      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
	        if (this.ignoreBackdropClick) {
	          this.ignoreBackdropClick = false
	          return
	        }
	        if (e.target !== e.currentTarget) return
	        this.options.backdrop == 'static'
	          ? this.$element[0].focus()
	          : this.hide()
	      }, this))

	      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

	      this.$backdrop.addClass('in')

	      if (!callback) return

	      doAnimate ?
	        this.$backdrop
	          .one('bsTransitionEnd', callback)
	          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
	        callback()

	    } else if (!this.isShown && this.$backdrop) {
	      this.$backdrop.removeClass('in')

	      var callbackRemove = function () {
	        that.removeBackdrop()
	        callback && callback()
	      }
	      $.support.transition && this.$element.hasClass('fade') ?
	        this.$backdrop
	          .one('bsTransitionEnd', callbackRemove)
	          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
	        callbackRemove()

	    } else if (callback) {
	      callback()
	    }
	  }

	  // these following methods are used to handle overflowing modals

	  Modal.prototype.handleUpdate = function () {
	    this.adjustDialog()
	  }

	  Modal.prototype.adjustDialog = function () {
	    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

	    this.$element.css({
	      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
	      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
	    })
	  }

	  Modal.prototype.resetAdjustments = function () {
	    this.$element.css({
	      paddingLeft: '',
	      paddingRight: ''
	    })
	  }

	  Modal.prototype.checkScrollbar = function () {
	    var fullWindowWidth = window.innerWidth
	    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
	      var documentElementRect = document.documentElement.getBoundingClientRect()
	      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
	    }
	    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
	    this.scrollbarWidth = this.measureScrollbar()
	  }

	  Modal.prototype.setScrollbar = function () {
	    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
	    this.originalBodyPad = document.body.style.paddingRight || ''
	    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
	  }

	  Modal.prototype.resetScrollbar = function () {
	    this.$body.css('padding-right', this.originalBodyPad)
	  }

	  Modal.prototype.measureScrollbar = function () { // thx walsh
	    var scrollDiv = document.createElement('div')
	    scrollDiv.className = 'modal-scrollbar-measure'
	    this.$body.append(scrollDiv)
	    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
	    this.$body[0].removeChild(scrollDiv)
	    return scrollbarWidth
	  }


	  // MODAL PLUGIN DEFINITION
	  // =======================

	  function Plugin(option, _relatedTarget) {
	    return this.each(function () {
	      var $this   = $(this)
	      var data    = $this.data('bs.modal')
	      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

	      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
	      if (typeof option == 'string') data[option](_relatedTarget)
	      else if (options.show) data.show(_relatedTarget)
	    })
	  }

	  var old = $.fn.modal

	  $.fn.modal             = Plugin
	  $.fn.modal.Constructor = Modal


	  // MODAL NO CONFLICT
	  // =================

	  $.fn.modal.noConflict = function () {
	    $.fn.modal = old
	    return this
	  }


	  // MODAL DATA-API
	  // ==============

	  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
	    var $this   = $(this)
	    var href    = $this.attr('href')
	    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
	    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

	    if ($this.is('a')) e.preventDefault()

	    $target.one('show.bs.modal', function (showEvent) {
	      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
	      $target.one('hidden.bs.modal', function () {
	        $this.is(':visible') && $this.trigger('focus')
	      })
	    })
	    Plugin.call($target, option, this)
	  })

	}(jQuery);


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var angular = __webpack_require__(83);

	'use strict';

	/**
	 * Wraps the
	 * @param text {string} haystack to search through
	 * @param search {string} needle to search for
	 * @param [caseSensitive] {boolean} optional boolean to use case-sensitive searching
	 */
	angular.module('ui.highlight',[]).filter('highlight', function () {
	  return function (text, search, caseSensitive) {
	    if (text && (search || angular.isNumber(search))) {
	      text = text.toString();
	      search = search.toString();
	      if (caseSensitive) {
	        return text.split(search).join('<span class="ui-match">' + search + '</span>');
	      } else {
	        return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
	      }
	    } else {
	      return text;
	    }
	  };
	});



/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var angular = __webpack_require__(83);

	'use strict';

	/**
	 * Provides an easy way to toggle a checkboxes indeterminate property
	 *
	 * @example <input type="checkbox" ui-indeterminate="isUnkown">
	 */
	angular.module('ui.indeterminate',[]).directive('uiIndeterminate', [
	  function () {
	    return {
	      compile: function(tElm, tAttrs) {
	        if (!tAttrs.type || tAttrs.type.toLowerCase() !== 'checkbox') {
	          return angular.noop;
	        }

	        return function ($scope, elm, attrs) {
	          $scope.$watch(attrs.uiIndeterminate, function(newVal) {
	            elm[0].indeterminate = !!newVal;
	          });
	        };
	      }
	    };
	  }]);



/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(114);

	__webpack_require__(130);

	__webpack_require__(136);

	__webpack_require__(137);

	__webpack_require__(140);

	__webpack_require__(142);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('SettingsCtrl', function ($scope, $route) {
		$scope.serviceId = null;
		$scope.serviceTypeId = null;

		var update = function update() {
			if ($scope.view === 'service') {
				updateForExistingService();
			} else if ($scope.view === 'new') {
				updateForNewService();
			}
		};

		var updateForExistingService = function updateForExistingService() {
			if ($scope.serviceTypes && $scope.serviceConfigs && $scope.serviceId) {
				$scope.config = find($scope.serviceConfigs, 'name', $scope.serviceId) || {};
				$scope.service = find($scope.serviceTypes, 'baseUrl', $scope.config.baseUrl);
			}
		};

		var updateForNewService = function updateForNewService() {
			if ($scope.serviceTypes && $scope.serviceId && $scope.serviceTypeId) {
				$scope.service = find($scope.serviceTypes, 'baseUrl', $scope.serviceTypeId);
				$scope.config = _angular2.default.copy($scope.service.defaultConfig);
				$scope.config.name = $scope.serviceId;
			} else {
				$scope.config = null;
				$scope.service = null;
			}
		};

		var find = function find(list, field, value) {
			var item = list.filter(function (item) {
				return item[field] === value;
			})[0];
			return item ? item : null;
		};

		_core2.default.configurations.subscribe(function (configs) {
			$scope.$evalAsync(function () {
				$scope.serviceConfigs = configs;
				update();
			});
		});

		_core2.default.availableServices(function (types) {
			$scope.serviceTypes = types;
			update();
		});

		$scope.$on('$routeChangeSuccess', function (event, routeData) {
			$scope.serviceId = routeData.params.serviceName || null;
			$scope.serviceTypeId = routeData.params.serviceTypeId || null;
			$scope.view = $route.current.view;
			update();
		});
	});

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(115);

	__webpack_require__(117);

	__webpack_require__(119);

	__webpack_require__(121);

	__webpack_require__(125);

	__webpack_require__(128);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('ServiceSettingsCtrl', function ($scope, $location) {

		var config;

		var reset = function reset() {
			$scope.projects = {
				all: [],
				selected: null
			};
			$scope.views = {
				all: [],
				selected: null,
				selectedItems: null
			};
			$scope.projectsError = null;
			$scope.isLoading = false;
			$scope.filterQuery = '';
		};

		var getItemsForView = function getItemsForView(views, viewName) {
			var view = views.filter(function (view) {
				return view.name === viewName;
			});
			return view.length ? view[0].items : null;
		};

		var showError = function showError(errorResponse) {
			reset();
			$scope.projectsError = errorResponse;
		};

		var showProjects = function showProjects(projects) {
			$scope.projectsError = null;
			$scope.projects = {
				all: projects.items,
				selected: projects.selected
			};
			$scope.views = {
				all: projects.views || [],
				selected: projects.primaryView
			};
		};

		$scope.show = function () {
			reset();
			$scope.isLoading = true;
			_core2.default.availableProjects(config, function (response) {
				$scope.$evalAsync(function () {
					$scope.isLoading = false;
					if (response.error) {
						showError(response.error);
					} else {
						showProjects(response.projects);
					}
				});
			});
		};

		$scope.$watch('views.selected', function (viewName) {
			$scope.views.selectedItems = getItemsForView($scope.views.all, viewName);
		});

		$scope.save = function () {
			_core2.default.saveService(config);
			$scope.saving = true;
			$scope.projects.selected = config.projects;
			$location.path('/service/' + config.name);
		};

		$scope.$on('dynamicForm.changed', function (event, updatedConfig) {
			config = updatedConfig;
		});

		$scope.$on('filterQuery.changed', function (event, query) {
			$scope.filterQuery = query;
		});

		$scope.$on('projectList.change', function (event, selectedProjects) {
			if (config) {
				config.projects = selectedProjects;
			}
		});

		reset();
	});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _alert = __webpack_require__(116);

	var _alert2 = _interopRequireDefault(_alert);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('brAlert', function ($timeout) {
		return {
			scope: {
				visible: '=show'
			},
			templateUrl: _alert2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.$watch('visible', function (value) {
					if (value === true) {
						$timeout(function () {
							$scope.visible = false;
						}, 3000);
					}
				});
			}
		};
	});

/***/ },
/* 116 */
/***/ function(module, exports) {

	var path = 'settings/directives/alert/alert.html';
	var html = "<div class=\"alert-saved alert alert-success alert-hide\" ng-class=\"{ 'alert-hide': !visible }\">\n\t<i class=\"fa fa-check fa-lg\"></i> Settings saved\n</div>";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _dynamicForm = __webpack_require__(118);

	var _dynamicForm2 = _interopRequireDefault(_dynamicForm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('dynamicForm', function () {
		return {
			scope: {
				service: '=',
				config: '='
			},
			templateUrl: _dynamicForm2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.isDefined = _angular2.default.isDefined;

				var addMissingProperties = function addMissingProperties(defaultConfig, config) {
					for (var prop in defaultConfig) {
						if (defaultConfig.hasOwnProperty(prop) && !_angular2.default.isDefined(config[prop])) {
							config[prop] = defaultConfig[prop];
						}
					}
				};

				$scope.$watchCollection('config', function (config) {
					$scope.$emit('dynamicForm.changed', _angular2.default.copy(config));
				});

				$scope.$watch('service', function (service) {
					if (service && service.defaultConfig) {
						addMissingProperties(service.defaultConfig, $scope.config);
					}
				});
			}
		};
	});

/***/ },
/* 118 */
/***/ function(module, exports) {

	var path = 'settings/service/directives/dynamicForm/dynamicForm.html';
	var html = "<fieldset>\n\t<div class=\"form-group\" ng-show=\"isDefined(config.url)\">\n\t\t<div class=\"input-group\">\n\t\t\t<span class=\"input-group-addon\"><i class=\"fa fa-globe fa-fw\"></i></span>\n\t\t\t<input type=\"text\" class=\"form-control\" ng-required placeholder=\"{{ service.urlHint }}\" ng-model=\"config.url\">\n\t\t</div>\n\t\t<p class=\"help-block\">{{ service.urlHelp }}</p>\n\t</div>\n\n\t<div class=\"form-group\" ng-show=\"isDefined(config.username)\">\n\t\t<div class=\"input-group\">\n\t\t\t<span class=\"input-group-addon\"><i class=\"fa fa-user fa-fw\"></i></span>\n\t\t\t<input type=\"text\" class=\"form-control\" placeholder=\"Username\" ng-model=\"config.username\">\n\t\t</div>\n\t</div>\n\t<div class=\"form-group\" ng-show=\"isDefined(config.password)\">\n\t\t<div class=\"input-group\">\n\t\t\t<span class=\"input-group-addon\"><i class=\"fa fa-key fa-fw\"></i></span>\n\t\t\t<input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"config.password\">\n\t\t</div>\n\t</div>\n\t<div class=\"form-group\" ng-show=\"isDefined(config.branch)\">\n\t\t<div class=\"input-group\">\n\t\t\t<span class=\"input-group-addon\"><i class=\"fa fa-code-fork fa-fw\"></i></span>\n\t\t\t<input type=\"text\" class=\"form-control\" placeholder=\"Branch, f.e. refs/heads/release\" ng-model=\"config.branch\">\n\t\t</div>\n\t</div>\n\t<div class=\"form-group number\" ng-show=\"isDefined(config.updateInterval)\">\n\t\t<label for=\"update-interval\">Update interval</label>\n\t\t<div class=\"input-append input-group\" data-name=\"updateInterval\">\n\t\t\t<span class=\"input-group-addon\"><i class=\"fa fa-repeat fa-fw\"></i></span>\n\t\t\t<input type=\"number\" name=\"update-interval\" class=\"form-control input-mini\" min=\"1\" ng-model=\"config.updateInterval\">\n\t\t\t<span class=\"input-group-addon\">sec</span>\n\t\t</div>\n\t</div>\n</fieldset>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _filterQuery = __webpack_require__(120);

	var _filterQuery2 = _interopRequireDefault(_filterQuery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var KEY_ESC = 27;

	exports.default = _app2.default.directive('filterQuery', function () {
		return {
			scope: {},
			templateUrl: _filterQuery2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.query = '';

				$scope.keyDown = function (event) {
					if (event.keyCode === KEY_ESC) {
						$scope.query = '';
					}
				};

				$scope.$watch('query', function (query) {
					$scope.$emit('filterQuery.changed', query);
				});
			}
		};
	});

/***/ },
/* 120 */
/***/ function(module, exports) {

	var path = 'settings/service/directives/filterQuery/filterQuery.html';
	var html = "<div class=\"filter-query\">\n\t<input ng-model=\"query\" class=\"search-query form-control\" type=\"text\" placeholder=\"Search...\" ng-keydown=\"keyDown($event)\">\n\t<i class=\"fa fa-times-circle-o fa-2x\" ng-show=\"query\" ng-click=\"query = ''\"></i>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(122);

	__webpack_require__(123);

	__webpack_require__(111);

	__webpack_require__(112);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _projectList = __webpack_require__(124);

	var _projectList2 = _interopRequireDefault(_projectList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getGroupNamesFromProjects = function getGroupNamesFromProjects(projects) {
		return projects.filter(function (project) {
			return project.isInView;
		}).map(function (item) {
			return item.group;
		}).reduce(function (agg, group) {
			if (agg.indexOf(group) < 0) {
				agg.push(group);
			}
			return agg;
		}, []) || null;
	};

	var getVisibleProjectsForGroup = function getVisibleProjectsForGroup(projects, groupName) {
		return projects.filter(function (project) {
			return project.isInView && project.group === groupName;
		});
	};

	var getSelectedProjects = function getSelectedProjects(projects) {
		return projects.filter(function (project) {
			return project.isSelected;
		});
	};

	var createGroups = function createGroups(projects) {
		var groupNames = getGroupNamesFromProjects(projects);
		var groups = groupNames.map(function (groupName) {
			var groupProjects = getVisibleProjectsForGroup(projects, groupName);
			var selectedProjects = getSelectedProjects(groupProjects);
			return {
				name: groupName,
				projects: groupProjects,
				expanded: selectedProjects.length > 0 || groupNames.length === 1,
				visibleCount: groupProjects.length,
				projectsCount: groupProjects.length,
				allSelected: selectedProjects.length === groupProjects.length,
				someSelected: selectedProjects.length !== 0 && selectedProjects.length !== groupProjects.length,
				visible: groupProjects.length !== 0
			};
		});
		return groups.length ? groups : null;
	};

	var updateCheckAll = function updateCheckAll(groups) {
		(groups || []).forEach(function (group) {
			var selectedProjects = getSelectedProjects(group.projects);
			group.someSelected = selectedProjects.length !== 0 && selectedProjects.length !== group.projects.length;
			group.allSelected = selectedProjects.length === group.projects.length;
		});
	};

	exports.default = _app2.default.directive('projectList', function ($sce, highlightFilter) {
		return {
			scope: {
				projects: '=projects',
				selected: '=',
				viewItems: '=',
				filterQuery: '=filter'
			},
			templateUrl: _projectList2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.groups = null;
				$scope.selected = [];

				$scope.$watch('projects', function (projects) {
					$scope.selected = $scope.selected || [];
					$scope.projectList = _angular2.default.copy($scope.projects);
					$scope.projectList.forEach(function (project) {
						project.isSelected = $scope.selected.indexOf(project.id) > -1;
						project.isInView = !$scope.viewItems || $scope.viewItems.indexOf(project.id) > -1;
					});
					$scope.groups = createGroups($scope.projectList);
					highlightNames($scope.projectList, $scope.filterQuery);
				});

				$scope.$watch('viewItems', function (viewItems) {
					($scope.projectList || []).forEach(function (project) {
						project.isInView = !viewItems || viewItems.indexOf(project.id) > -1;
					});
					$scope.groups = createGroups($scope.projectList);
				});

				$scope.$watch('projectList', function (projects) {
					var selectedIds = getSelectedProjects(projects).map(function (project) {
						return project.id;
					});
					updateCheckAll($scope.groups);
					if ($scope.groups) $scope.$emit('projectList.change', selectedIds);
				}, true);

				$scope.$watch('filterQuery', function (query) {
					($scope.groups || []).forEach(function (group) {
						group.visibleCount = group.projects.filter(function (project) {
							return $scope.search(project);
						}).length;
					});
					highlightNames($scope.projectList, $scope.filterQuery);
				});

				$scope.search = function (project) {
					return project.name.toLowerCase().indexOf($scope.filterQuery.toLowerCase()) > -1;
				};

				$scope.checkAll = function (group) {
					group.projects.forEach(function (project) {
						project.isSelected = group.allSelected;
					});
				};

				var highlightNames = function highlightNames(projects, highlightText) {
					projects.forEach(function (project) {
						var nameHtml = highlightFilter(project.name, highlightText);
						project.nameHtml = $sce.trustAsHtml(nameHtml);
					});
				};
			}
		};
	});

/***/ },
/* 122 */
/***/ function(module, exports) {

	/* ========================================================================
	 * Bootstrap: collapse.js v3.3.7
	 * http://getbootstrap.com/javascript/#collapse
	 * ========================================================================
	 * Copyright 2011-2016 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */

	/* jshint latedef: false */

	+function ($) {
	  'use strict';

	  // COLLAPSE PUBLIC CLASS DEFINITION
	  // ================================

	  var Collapse = function (element, options) {
	    this.$element      = $(element)
	    this.options       = $.extend({}, Collapse.DEFAULTS, options)
	    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
	                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
	    this.transitioning = null

	    if (this.options.parent) {
	      this.$parent = this.getParent()
	    } else {
	      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
	    }

	    if (this.options.toggle) this.toggle()
	  }

	  Collapse.VERSION  = '3.3.7'

	  Collapse.TRANSITION_DURATION = 350

	  Collapse.DEFAULTS = {
	    toggle: true
	  }

	  Collapse.prototype.dimension = function () {
	    var hasWidth = this.$element.hasClass('width')
	    return hasWidth ? 'width' : 'height'
	  }

	  Collapse.prototype.show = function () {
	    if (this.transitioning || this.$element.hasClass('in')) return

	    var activesData
	    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

	    if (actives && actives.length) {
	      activesData = actives.data('bs.collapse')
	      if (activesData && activesData.transitioning) return
	    }

	    var startEvent = $.Event('show.bs.collapse')
	    this.$element.trigger(startEvent)
	    if (startEvent.isDefaultPrevented()) return

	    if (actives && actives.length) {
	      Plugin.call(actives, 'hide')
	      activesData || actives.data('bs.collapse', null)
	    }

	    var dimension = this.dimension()

	    this.$element
	      .removeClass('collapse')
	      .addClass('collapsing')[dimension](0)
	      .attr('aria-expanded', true)

	    this.$trigger
	      .removeClass('collapsed')
	      .attr('aria-expanded', true)

	    this.transitioning = 1

	    var complete = function () {
	      this.$element
	        .removeClass('collapsing')
	        .addClass('collapse in')[dimension]('')
	      this.transitioning = 0
	      this.$element
	        .trigger('shown.bs.collapse')
	    }

	    if (!$.support.transition) return complete.call(this)

	    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

	    this.$element
	      .one('bsTransitionEnd', $.proxy(complete, this))
	      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
	  }

	  Collapse.prototype.hide = function () {
	    if (this.transitioning || !this.$element.hasClass('in')) return

	    var startEvent = $.Event('hide.bs.collapse')
	    this.$element.trigger(startEvent)
	    if (startEvent.isDefaultPrevented()) return

	    var dimension = this.dimension()

	    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

	    this.$element
	      .addClass('collapsing')
	      .removeClass('collapse in')
	      .attr('aria-expanded', false)

	    this.$trigger
	      .addClass('collapsed')
	      .attr('aria-expanded', false)

	    this.transitioning = 1

	    var complete = function () {
	      this.transitioning = 0
	      this.$element
	        .removeClass('collapsing')
	        .addClass('collapse')
	        .trigger('hidden.bs.collapse')
	    }

	    if (!$.support.transition) return complete.call(this)

	    this.$element
	      [dimension](0)
	      .one('bsTransitionEnd', $.proxy(complete, this))
	      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
	  }

	  Collapse.prototype.toggle = function () {
	    this[this.$element.hasClass('in') ? 'hide' : 'show']()
	  }

	  Collapse.prototype.getParent = function () {
	    return $(this.options.parent)
	      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
	      .each($.proxy(function (i, element) {
	        var $element = $(element)
	        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
	      }, this))
	      .end()
	  }

	  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
	    var isOpen = $element.hasClass('in')

	    $element.attr('aria-expanded', isOpen)
	    $trigger
	      .toggleClass('collapsed', !isOpen)
	      .attr('aria-expanded', isOpen)
	  }

	  function getTargetFromTrigger($trigger) {
	    var href
	    var target = $trigger.attr('data-target')
	      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

	    return $(target)
	  }


	  // COLLAPSE PLUGIN DEFINITION
	  // ==========================

	  function Plugin(option) {
	    return this.each(function () {
	      var $this   = $(this)
	      var data    = $this.data('bs.collapse')
	      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

	      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
	      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
	      if (typeof option == 'string') data[option]()
	    })
	  }

	  var old = $.fn.collapse

	  $.fn.collapse             = Plugin
	  $.fn.collapse.Constructor = Collapse


	  // COLLAPSE NO CONFLICT
	  // ====================

	  $.fn.collapse.noConflict = function () {
	    $.fn.collapse = old
	    return this
	  }


	  // COLLAPSE DATA-API
	  // =================

	  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
	    var $this   = $(this)

	    if (!$this.attr('data-target')) e.preventDefault()

	    var $target = getTargetFromTrigger($this)
	    var data    = $target.data('bs.collapse')
	    var option  = data ? 'toggle' : $this.data()

	    Plugin.call($target, option)
	  })

	}(jQuery);


/***/ },
/* 123 */
/***/ function(module, exports) {

	/* ========================================================================
	 * Bootstrap: transition.js v3.3.7
	 * http://getbootstrap.com/javascript/#transitions
	 * ========================================================================
	 * Copyright 2011-2016 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */


	+function ($) {
	  'use strict';

	  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
	  // ============================================================

	  function transitionEnd() {
	    var el = document.createElement('bootstrap')

	    var transEndEventNames = {
	      WebkitTransition : 'webkitTransitionEnd',
	      MozTransition    : 'transitionend',
	      OTransition      : 'oTransitionEnd otransitionend',
	      transition       : 'transitionend'
	    }

	    for (var name in transEndEventNames) {
	      if (el.style[name] !== undefined) {
	        return { end: transEndEventNames[name] }
	      }
	    }

	    return false // explicit for ie8 (  ._.)
	  }

	  // http://blog.alexmaccaw.com/css-transitions
	  $.fn.emulateTransitionEnd = function (duration) {
	    var called = false
	    var $el = this
	    $(this).one('bsTransitionEnd', function () { called = true })
	    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
	    setTimeout(callback, duration)
	    return this
	  }

	  $(function () {
	    $.support.transition = transitionEnd()

	    if (!$.support.transition) return

	    $.event.special.bsTransitionEnd = {
	      bindType: $.support.transition.end,
	      delegateType: $.support.transition.end,
	      handle: function (e) {
	        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
	      }
	    }
	  })

	}(jQuery);


/***/ },
/* 124 */
/***/ function(module, exports) {

	var path = 'settings/service/directives/projectList/projectList.html';
	var html = "<div class=\"panel-group\" id=\"projects-accordion\">\n\t<div class=\"panel panel-default\" ng-repeat=\"group in groups\" ng-show=\"group.visible\">\n\t\t<div class=\"panel-heading\">\n\t\t\t<h4 class=\"panel-title\">\n\t\t\t\t<input type=\"checkbox\" class=\"check-all\" ng-change=\"checkAll(group)\" ng-model=\"group.allSelected\" ui-indeterminate=\"group.someSelected\">\n\t\t\t\t<a data-toggle=\"collapse\" href=\"#project-group-{{ $index }}\">\n\t\t\t\t\t<span class=\"group-name\">{{ group.name || 'Projects' }}</span>\n\t\t\t\t\t<span class=\"filter-count badge\" title=\"Visible / All projects in group\">\n\t\t\t\t\t\t<span ng-show=\"group.visibleCount != group.projectsCount\">{{ group.visibleCount }} / </span>{{ group.projectsCount }}\n\t\t\t\t\t</span>\n\t\t\t\t</a>\n\t\t\t</h4>\n\t\t</div>\n\t\t<div class=\"panel-collapse collapse\" ng-class=\"{ in: group.expanded }\" id=\"project-group-{{ $index }}\">\n\t\t\t<div class=\"panel-body\">\n\t\t\t\t<label class=\"checkbox\" ng-repeat=\"item in group.projects | filter:search\">\n\t\t\t\t\t<input type=\"checkbox\" ng-model=\"item.isSelected\">\n\t\t\t\t\t<span class=\"project-name\" ng-class=\"{ 'text-muted': item.isDisabled }\" ng-bind-html=\"item.nameHtml\"></span>\n\t\t\t\t\t<span class=\"pull-right\">\n\t\t\t\t\t\t<span class=\"label label-default\" ng-show=\"item.isDisabled\">Disabled</span>\n\t\t\t\t\t</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"alert alert-info\" ng-show=\"!groups\">No projects available</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(126);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	var _selectedProjects = __webpack_require__(127);

	var _selectedProjects2 = _interopRequireDefault(_selectedProjects);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('selectedProjects', function () {
		return {
			scope: {
				projects: '=',
				serviceName: '@'
			},
			templateUrl: _selectedProjects2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {

				$scope.sortableCallback = function (startModel, destModel, start, end) {
					_core2.default.setBuildOrder($scope.serviceName, destModel);
				};
			}
		};
	});

/***/ },
/* 126 */
/***/ function(module, exports) {

	/*
	 * AngularJS integration with the HTML5 Sortable jQuery Plugin
	 * https://github.com/voidberg/html5sortable
	 *
	 * Copyright 2013, Alexandru Badiu <andu@ctrlz.ro>
	 *
	 * Thanks to the following contributors: samantp.
	 *
	 * Released under the MIT license.
	 */
	;(function(angular) {
	  'use strict';

	  angular.module('htmlSortable', [])
	    .directive('htmlSortable', [
	      '$timeout', '$parse', function($timeout, $parse) {
	        return {
	          require: '?ngModel',
	          // TODO: fix this, if you know angular
	          link: function(scope, element, attrs, ngModel) { // jshint ignore:line
	            var opts;
	            var model;
	            var scallback = angular.noop;

	            if (attrs.htmlSortableCallback) {
	              scallback = $parse(attrs.htmlSortableCallback);
	            }

	            opts = angular.extend({}, scope.$eval(attrs.htmlSortable));
	            element.sortable(opts);

	            if (ngModel) {
	              model = $parse(attrs.ngModel);

	              ngModel.$render = function() {
	                $timeout(function() {
	                  element.sortable('reload');
	                }, 50);
	              };

	              scope.$watch(model, function() {
	                $timeout(function() {
	                  element.sortable('reload');
	                }, 50);
	              }, true);

	              element.sortable().bind('sortupdate', function(e, data) {
	                var $source = data.startparent.attr('ng-model') || data.startparent.attr('data-ng-model');
	                var $dest   = data.endparent.attr('ng-model') || data.endparent.attr('data-ng-model');

	                var $sourceModel = $parse($source);
	                var $destModel = $parse($dest);

	                var $start = data.oldindex;
	                var $end   = data.item.index();

	                scope.$apply(function() {
	                  // TODO: fix this, if you know angular
	                  //jscs:disable
	                  if ($sourceModel(data.startparent.scope()) === $destModel(data.endparent.scope())) {
	                    //jscs:enable
	                    var $items = $sourceModel(data.startparent.scope());
	                    $items.splice($end, 0, $items.splice($start, 1)[0]);
	                    $sourceModel.assign(scope, $items);
	                  } else {
	                    var $item = $sourceModel(data.startparent.scope())[$start];
	                    var $sourceItems = $sourceModel(data.startparent.scope());
	                    var $destItems = $destModel(data.endparent.scope()) || [];

	                    $sourceItems.splice($start, 1);
	                    $destItems.splice($end, 0, $item);

	                    $sourceModel.assign(scope, $sourceItems);
	                    $destModel.assign(scope, $destItems);
	                  }
	                });

	                scallback(scope, {
	                  startModel: $sourceModel(data.startparent.scope()),
	                  destModel: $destModel(data.endparent.scope()),
	                  start: $start,
	                  end: $end
	                });
	              });
	            }
	          }
	        };
	      }
	    ]);
	}(angular));


/***/ },
/* 127 */
/***/ function(module, exports) {

	var path = 'settings/service/directives/selectedProjects/selectedProjects.html';
	var html = "<div class=\"selected-projects panel panel-default\" ng-show=\"projects\">\n\t<div class=\"panel-heading\">\n\t\tMonitored builds\n\t</div>\n\t<div class=\"list-group\" html-sortable ng-model=\"projects\" html-sortable-callback=\"sortableCallback\">\n\t\t<a class=\"list-group-item\" ng-repeat=\"item in projects\">\n\t\t\t<span class=\"handle\">::</span>\n\t\t\t<span class=\"project-name\">{{ item }}</span>\n\t\t</a>\n\t</ul>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _viewSelection = __webpack_require__(129);

	var _viewSelection2 = _interopRequireDefault(_viewSelection);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('viewSelection', function () {
		return {
			scope: {
				views: '=',
				selected: '='
			},
			templateUrl: _viewSelection2.default
		};
	});

/***/ },
/* 129 */
/***/ function(module, exports) {

	var path = 'settings/service/directives/viewSelection/viewSelection.html';
	var html = "<div class=\"view-selection well well-sm\">\n\t<form class=\"form-inline\" action=\"\" role=\"form\">\n\t\t<div class=\"form-group\">\n\t\t\t<select\n\t\t\t\tclass=\"form-control\"\n\t\t\t\tng-model=\"selected\"\n\t\t\t\tng-options=\"view.name as view.name for view in views\"></select>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<label for=\"inputEmail\">View</label>\n\t\t</div>\n\t</form>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(131);

	__webpack_require__(134);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('AddServiceCtrl', function ($scope, $routeParams, $location) {
		$scope.selectedTypeId = $routeParams.serviceTypeId;

		$scope.$on('serviceNamePanel.added', function (event, serviceName) {
			$location.path('/new/' + $routeParams.serviceTypeId + '/' + serviceName);
			$location.search('serviceTypeId', null);
		});

		$scope.$on('thumbnails.selected', function (event, serviceTypeId) {
			$location.search('serviceTypeId', serviceTypeId).replace();
		});
	});

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(132);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	var _serviceNamePanel = __webpack_require__(133);

	var _serviceNamePanel2 = _interopRequireDefault(_serviceNamePanel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('serviceNamePanel', function () {
		return {
			scope: {
				active: '='
			},
			templateUrl: _serviceNamePanel2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.serviceName = '';

				$scope.add = function () {
					$scope.$emit('serviceNamePanel.added', $scope.serviceName);
				};

				$scope.$watch('serviceName', function (name) {
					$scope.exists = $scope.services ? $scope.services.filter(function (service) {
						return service.name === name;
					}).length > 0 : false;
				});

				_core2.default.configurations.subscribe(function (configs) {
					$scope.services = configs;
				});
			}
		};
	});

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('focusIf', function () {
		return {
			restrict: 'A',
			link: function link(scope, element, attrs) {
				scope.$watch(attrs.focusIf, function (value) {
					if (value) {
						scope.$evalAsync(function () {
							element[0].focus();
						});
					}
				});
			}
		};
	});

/***/ },
/* 133 */
/***/ function(module, exports) {

	var path = 'settings/add/directives/serviceNamePanel/serviceNamePanel.html';
	var html = "<div class=\"panel-footer\">\n\t<form class=\"service-add-form form-inline\" ng-submit=\"add()\">\n\t\t<div class=\"form-actions\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<input type=\"text\"\n\t\t\t\t\tclass=\"form-control\"\n\t\t\t\t\tname=\"service-add-name\"\n\t\t\t\t\tid=\"service-add-name\"\n\t\t\t\t\tplaceholder=\"Name\"\n\t\t\t\t\tng-disabled=\"!active\"\n\t\t\t\t\tng-model=\"serviceName\"\n\t\t\t\t\tfocus-if=\"active\">\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<button type=\"submit\"\n\t\t\t\t\tclass=\"btn btn-primary\"\n\t\t\t\t\tng-disabled=\"!serviceName || exists\">Add</button>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _thumbnails = __webpack_require__(135);

	var _thumbnails2 = _interopRequireDefault(_thumbnails);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('thumbnails', function () {
		return {
			scope: {
				serviceTypes: '=',
				selected: '='
			},
			templateUrl: _thumbnails2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.select = function (serviceTypeId) {
					$scope.selected = serviceTypeId;
					$scope.$emit('thumbnails.selected', serviceTypeId);
				};
			}
		};
	});

/***/ },
/* 135 */
/***/ function(module, exports) {

	var path = 'settings/add/directives/thumbnails/thumbnails.html';
	var html = "<div class=\"thumbnails\" ng-model=\"serviceTypes\">\n\t<a\n\t\tng-repeat=\"service in serviceTypes\"\n\t\tng-class=\"{ thumbnail: true, active: service.baseUrl === selected }\"\n\t\tng-click=\"select(service.baseUrl)\">\n\t\t<div class=\"thumbnail-image\">\n\t\t\t<img ng-src=\"{{ service.logo }}\" alt=\"{{ service.typeName }}\">\n\t\t</div>\n\t\t<div class=\"caption\">{{ service.typeName }}</div>\n\t</a>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(88);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('ViewSettingsCtrl', function ($scope) {
		_core2.default.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.viewConfig = config;
			});
		});

		_core2.default.activeProjects.subscribe(function (projects) {
			$scope.$evalAsync(function () {
				$scope.activeProjects = projects;
			});
		});

		$scope.save = function (config) {
			if (config.columns < 0) {
				config.columns = 0;
			}
			if (config.columns > 20) {
				config.columns = 20;
			}
			_core2.default.setViews(_angular2.default.copy(config));
		};

		$scope.setField = function (name, value) {
			var changed = $scope.viewConfig[name] !== value;
			if (changed) {
				$scope.viewConfig[name] = value;
				_core2.default.setViews(_angular2.default.copy($scope.viewConfig));
			}
		};

		$scope.setTheme = function (theme) {
			var changed = $scope.viewConfig.theme !== theme;
			if (changed) {
				$scope.viewConfig.theme = theme;
				_core2.default.setViews(_angular2.default.copy($scope.viewConfig));
			}
		};
	});

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	__webpack_require__(138);

	__webpack_require__(115);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('ConfigurationCtrl', function ($scope, $http) {
	    $scope.includePasswords = false;

	    _core2.default.configurations.subscribe(function (config) {
	        $scope.$evalAsync(function () {
	            $scope.config = config;
	        });
	    });

	    $scope.$on('jsonEditor.changed', function (event, json) {
	        $scope.saving = true;
	        _core2.default.saveConfig(json);
	    });

	    $scope.showLocalConfig = function () {
	        var displayConfig = _angular2.default.copy($scope.config);
	        if (!$scope.includePasswords) {
	            displayConfig.forEach(function (serviceConfig) {
	                delete serviceConfig.username;
	                delete serviceConfig.password;
	            });
	        }
	        $scope.displayConfig = displayConfig;
	    };

	    $scope.showFromUrl = function (url) {
	        $http({
	            method: 'GET',
	            url: url
	        }).then(function successCallback(response) {
	            $scope.displayConfig = response.data;
	            $scope.urlError = null;
	        }, function errorCallback() {
	            var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	            $scope.urlError = response.statusText || 'Request failed. Status = ' + response.status;
	        });
	    };
	});

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _jsonEditor = __webpack_require__(139);

	var _jsonEditor2 = _interopRequireDefault(_jsonEditor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('jsonEditor', function () {
	    return {
	        scope: {
	            json: '='
	        },
	        templateUrl: _jsonEditor2.default,
	        controller: function controller($scope, $element, $attrs, $transclude) {

	            $scope.$watch('json', function (json) {
	                $scope.content = JSON.stringify(json, null, 2) || "";
	            });

	            $scope.$watch('content', function (content) {
	                try {
	                    var obj = JSON.parse(content);
	                    if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj.length > -1) {
	                        showError(null);
	                    } else {
	                        showError('Configuration validation error');
	                    }
	                } catch (ex) {
	                    showError(ex.message || 'JSON Validation error');
	                }
	            });

	            var showError = function showError(message) {
	                $scope.saveEnabled = !message;
	                $scope.error = message;
	            };

	            $scope.save = function () {
	                $scope.$emit('jsonEditor.changed', JSON.parse($scope.content));
	            };
	        }
	    };
	});

/***/ },
/* 139 */
/***/ function(module, exports) {

	var path = 'settings/configuration/directives/jsonEditor/jsonEditor.html';
	var html = "<div class=\"jsoneditor\">\n\t<textarea ng-model=\"content\" class=\"form-control\"></textarea>\n\t<div class=\"editor-button\">\n\t\t<button type=\"button\" class=\"btn btn-danger\" ng-click=\"save()\" ng-disabled=\"!saveEnabled\">\n\t\t\t<i class=\"fa fa-save\"></i> Save\n\t\t</button>\n\t\t<span class=\"editor-error\">{{ error }}</span>\n\t</div>\n\n</div>";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(126);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	var _sidebar = __webpack_require__(141);

	var _sidebar2 = _interopRequireDefault(_sidebar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('sidebar', function () {
		return {
			scope: {
				services: '=',
				configs: '=',
				currentService: '=',
				currentConfig: '=',
				view: '='
			},
			templateUrl: _sidebar2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.sortableCallback = function (startModel, destModel, start, end) {
					var items = destModel.map(function (service) {
						return service.name;
					});
					_core2.default.setOrder(items);
				};

				$scope.$watch('services', function (services) {
					$scope.serviceIcons = {};
					(services || []).forEach(function (service) {
						$scope.serviceIcons[service.baseUrl] = service.icon;
					});
				});
			}
		};
	});

/***/ },
/* 141 */
/***/ function(module, exports) {

	var path = 'settings/directives/sidebar/sidebar.html';
	var html = "<div class=\"sidebar-nav\">\n\t<div class=\"scrollable\">\n\t\t<ul class=\"service-list nav nav-pills nav-stacked\"\n\t\t    html-sortable\n\t\t    html-sortable-callback=\"sortableCallback\"\n\t\t    ng-model=\"configs\">\n\t\t\t<li\n\t\t\t\tng-repeat=\"config in configs\"\n\t\t\t\tng-class=\"{ muted: config.disabled, active: view == 'service' && config.name === currentConfig.name }\">\n\t\t\t\t<a ng-href=\"#/service/{{ config.name }}\" class=\"nav-pill\">\n\t\t\t\t\t<span class=\"handle\">::</span>\n\t\t\t\t\t<img class=\"pill-icon\" ng-src=\"{{ serviceIcons[config.baseUrl] }}\">\n\t\t\t\t\t<span class=\"pill-name\">{{ config.name }}</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t</ul>\n\t\t<hr class=\"service-list-separator\" ng-show=\"configs.length\">\n\t\t<ul class=\"actions nav nav-pills nav-stacked\">\n\t\t\t<li ng-class=\"{ active: view == 'new', muted: currentConfig.disabled }\" ng-show=\"view == 'new' && currentConfig\">\n\t\t\t\t<a href=\"#\">\n\t\t\t\t\t<img class=\"pill-icon\" ng-src=\"{{ serviceIcons[currentConfig.baseUrl] }}\">\n\t\t\t\t\t<span class=\"pill-name\">{{ currentConfig.name }}</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li ng-class=\"{ active: view == 'new'  && !currentConfig }\">\n\t\t\t\t<a ng-href=\"#/new\">\n\t\t\t\t\t<i class=\"pill-icon fa fa-plus-circle fa-3x\"></i>\n\t\t\t\t\t<span class=\"pill-name\">Add</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li ng-class=\"{ active: view == 'view' }\">\n\t\t\t\t<a ng-href=\"#/view\">\n\t\t\t\t\t<i class=\"pill-icon fa fa-desktop fa-3x\"></i>\n\t\t\t\t\t<span class=\"pill-name\">View</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li ng-class=\"{ active: view == 'configuration' }\">\n\t\t\t\t<a ng-href=\"#/configuration\">\n\t\t\t\t\t<i class=\"pill-icon fa fa-cogs fa-3x\"></i>\n\t\t\t\t\t<span class=\"pill-name\">Configuration</span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(143);

	__webpack_require__(86);

	__webpack_require__(144);

	__webpack_require__(146);

	__webpack_require__(147);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	var _removeModal = __webpack_require__(148);

	var _removeModal2 = _interopRequireDefault(_removeModal);

	var _renameModal = __webpack_require__(149);

	var _renameModal2 = _interopRequireDefault(_renameModal);

	var _topnav = __webpack_require__(150);

	var _topnav2 = _interopRequireDefault(_topnav);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('topnav', function ($uibModal, $location) {
		return {
			scope: {
				service: '=currentService',
				showActions: '='
			},
			templateUrl: _topnav2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {

				$scope.$watch('service', function (selectedService) {
					if (selectedService) {
						$scope.isActive = $scope.showActions;
						$scope.isEnabled = !selectedService.disabled;
					} else {
						$scope.isActive = false;
					}
				});

				$scope.$on('onOffSwitch.change', function (event, isEnabled) {
					if (!$scope.service) {
						return;
					}
					if (isEnabled) {
						_core2.default.enableService($scope.service.name);
					} else {
						_core2.default.disableService($scope.service.name);
					}
				});

				$scope.remove = function () {
					$uibModal.open({
						templateUrl: _removeModal2.default,
						controller: 'RemoveModalCtrl',
						scope: $scope,
						resolve: {
							serviceName: function serviceName() {
								return $scope.service.name;
							}
						}
					}).result.then(function (serviceName) {
						_core2.default.removeService(serviceName);
						$location.path('/new/').replace();
					});
				};

				$scope.rename = function () {
					$uibModal.open({
						templateUrl: _renameModal2.default,
						controller: 'RenameModalCtrl',
						resolve: {
							serviceName: function serviceName() {
								return $scope.service.name;
							}
						}
					}).result.then(function (serviceName) {
						_core2.default.renameService($scope.service.name, serviceName);
						$location.path('/service/' + serviceName).replace();
					});
				};
			}
		};
	});

/***/ },
/* 143 */
/***/ function(module, exports) {

	/* ========================================================================
	 * Bootstrap: dropdown.js v3.3.7
	 * http://getbootstrap.com/javascript/#dropdowns
	 * ========================================================================
	 * Copyright 2011-2016 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */


	+function ($) {
	  'use strict';

	  // DROPDOWN CLASS DEFINITION
	  // =========================

	  var backdrop = '.dropdown-backdrop'
	  var toggle   = '[data-toggle="dropdown"]'
	  var Dropdown = function (element) {
	    $(element).on('click.bs.dropdown', this.toggle)
	  }

	  Dropdown.VERSION = '3.3.7'

	  function getParent($this) {
	    var selector = $this.attr('data-target')

	    if (!selector) {
	      selector = $this.attr('href')
	      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
	    }

	    var $parent = selector && $(selector)

	    return $parent && $parent.length ? $parent : $this.parent()
	  }

	  function clearMenus(e) {
	    if (e && e.which === 3) return
	    $(backdrop).remove()
	    $(toggle).each(function () {
	      var $this         = $(this)
	      var $parent       = getParent($this)
	      var relatedTarget = { relatedTarget: this }

	      if (!$parent.hasClass('open')) return

	      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

	      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

	      if (e.isDefaultPrevented()) return

	      $this.attr('aria-expanded', 'false')
	      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
	    })
	  }

	  Dropdown.prototype.toggle = function (e) {
	    var $this = $(this)

	    if ($this.is('.disabled, :disabled')) return

	    var $parent  = getParent($this)
	    var isActive = $parent.hasClass('open')

	    clearMenus()

	    if (!isActive) {
	      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
	        // if mobile we use a backdrop because click events don't delegate
	        $(document.createElement('div'))
	          .addClass('dropdown-backdrop')
	          .insertAfter($(this))
	          .on('click', clearMenus)
	      }

	      var relatedTarget = { relatedTarget: this }
	      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

	      if (e.isDefaultPrevented()) return

	      $this
	        .trigger('focus')
	        .attr('aria-expanded', 'true')

	      $parent
	        .toggleClass('open')
	        .trigger($.Event('shown.bs.dropdown', relatedTarget))
	    }

	    return false
	  }

	  Dropdown.prototype.keydown = function (e) {
	    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

	    var $this = $(this)

	    e.preventDefault()
	    e.stopPropagation()

	    if ($this.is('.disabled, :disabled')) return

	    var $parent  = getParent($this)
	    var isActive = $parent.hasClass('open')

	    if (!isActive && e.which != 27 || isActive && e.which == 27) {
	      if (e.which == 27) $parent.find(toggle).trigger('focus')
	      return $this.trigger('click')
	    }

	    var desc = ' li:not(.disabled):visible a'
	    var $items = $parent.find('.dropdown-menu' + desc)

	    if (!$items.length) return

	    var index = $items.index(e.target)

	    if (e.which == 38 && index > 0)                 index--         // up
	    if (e.which == 40 && index < $items.length - 1) index++         // down
	    if (!~index)                                    index = 0

	    $items.eq(index).trigger('focus')
	  }


	  // DROPDOWN PLUGIN DEFINITION
	  // ==========================

	  function Plugin(option) {
	    return this.each(function () {
	      var $this = $(this)
	      var data  = $this.data('bs.dropdown')

	      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
	      if (typeof option == 'string') data[option].call($this)
	    })
	  }

	  var old = $.fn.dropdown

	  $.fn.dropdown             = Plugin
	  $.fn.dropdown.Constructor = Dropdown


	  // DROPDOWN NO CONFLICT
	  // ====================

	  $.fn.dropdown.noConflict = function () {
	    $.fn.dropdown = old
	    return this
	  }


	  // APPLY TO STANDARD DROPDOWN ELEMENTS
	  // ===================================

	  $(document)
	    .on('click.bs.dropdown.data-api', clearMenus)
	    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
	    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
	    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
	    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

	}(jQuery);


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _onOffSwitch = __webpack_require__(145);

	var _onOffSwitch2 = _interopRequireDefault(_onOffSwitch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.directive('onOffSwitch', function () {
		return {
			scope: {
				onOff: '=onOff'
			},
			templateUrl: _onOffSwitch2.default,
			controller: function controller($scope, $element, $attrs, $transclude) {
				$scope.$watch('onOff', function (onOff) {
					$scope.switch = onOff ? 'on' : 'off';
				});

				$scope.userSwitch = function (newValue) {
					$scope.$emit('onOffSwitch.change', newValue === 'on');
				};
			}
		};
	});

/***/ },
/* 145 */
/***/ function(module, exports) {

	var path = 'settings/directives/onOffSwitch/onOffSwitch.html';
	var html = "<div class=\"toggle-bg toggle-alternate {{ switch }}\">\n\t<label class=\"{{ switch }}\">{{ switch }}</label>\n\t<input type=\"radio\" name=\"toggle\" value=\"off\" ng-model=\"switch\" ng-click=\"userSwitch(switch)\">\n\t<input type=\"radio\" name=\"toggle\" value=\"on\" ng-model=\"switch\" ng-click=\"userSwitch(switch)\">\n\t<span class=\"switch {{ switch }}\"></span>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(86);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('RemoveModalCtrl', function ($scope, $uibModalInstance, serviceName) {
		$scope.serviceName = serviceName;

		$scope.remove = function () {
			$uibModalInstance.close($scope.serviceName);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(86);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('RenameModalCtrl', function ($scope, $uibModalInstance, serviceName) {
		$scope.service = { name: serviceName };

		_core2.default.configurations.subscribe(function (configs) {
			$scope.services = configs;
		});

		$scope.$watch('service.name', function (name) {
			$scope.exists = $scope.services ? $scope.services.filter(function (service) {
				return service.name === name;
			}).length > 0 : false;
		});

		$scope.rename = function () {
			$uibModalInstance.close($scope.service.name);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

/***/ },
/* 148 */
/***/ function(module, exports) {

	var path = 'settings/directives/topnav/removeModal.html';
	var html = "<div class=\"modal-header\">\n\t<button type=\"button\" class=\"close\" ng-click=\"cancel()\">&times;</button>\n\t<h4 class=\"modal-title\"><span class=\"fa fa-check-square-o\"></span> Confirmation</h4>\n</div>\n<div class=\"modal-body\">\n\tRemove service <b>{{ serviceName }}</b> ?\n</div>\n<div class=\"modal-footer\">\n\t<button class=\"btn btn-danger\" ng-click=\"remove()\">Remove</button>\n\t<button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 149 */
/***/ function(module, exports) {

	var path = 'settings/directives/topnav/renameModal.html';
	var html = "<form action=\"\">\n\t<div class=\"modal-header\">\n\t\t<button type=\"button\" class=\"close\" ng-click=\"cancel()\">&times;</button>\n\t\t<h4 class=\"modal-title\"><span class=\"fa fa-pencil\"></span> Rename</h4>\n\t</div>\n\t<div class=\"modal-body\">\n\t\t<p>New name:</p>\n\t\t<input type=\"text\" class=\"form-control\" ng-model=\"service.name\">\n\t</div>\n\t<div class=\"modal-footer\">\n\t\t<button type=\"submit\" class=\"btn btn-primary\" ng-click=\"rename()\" ng-disabled=\"exists\">OK</button>\n\t\t<button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n\t</div>\n</form>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 150 */
/***/ function(module, exports) {

	var path = 'settings/directives/topnav/topnav.html';
	var html = "<div class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n\t<div class=\"navbar-header\">\n\t\t<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navbar-collapse\">\n\t\t\t<span class=\"sr-only\">Toggle navigation</span>\n\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t<span class=\"icon-bar\"></span>\n\t\t</button>\n\t\t<div class=\"navbar-brand\">\n\t\t\t<img class=\"logo\" src=\"/img/icon.svg\" alt=\"BuildReactor logo\">\n\t\t\tBuildReactor\n\t\t</div>\n\t</div>\n\t<div class=\"collapse navbar-collapse\" id=\"navbar-collapse\">\n\t\t<ul class=\"nav navbar-nav\" ng-show=\"isActive\" ng-cloak>\n\t\t\t<li>\n\t\t\t\t<div on-off-switch on-off=\"isEnabled\" class=\"on-off-switch\"></div>\n\t\t\t</li>\n\t\t\t<li>\n\t\t\t\t<a id=\"service-remove-button\" tabindex=\"-1\" ng-click=\"remove()\">\n\t\t\t\t\t<i class=\"fa fa-trash-o\"></i> Remove\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li>\n\t\t\t\t<a id=\"service-rename-action\" tabindex=\"-1\" ng-click=\"rename()\">\n\t\t\t\t\t<i class=\"fa fa-pencil\"></i> Rename\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t</ul>\n\t\t<ul class=\"nav navbar-nav navbar-right\">\n            <li>\n\t\t\t\t<a href=\"dashboard.html\" target=\"_blank\">\n\t\t\t\t\t<i class=\"fa fa-tasks\"></i> Dashboard\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class=\"dropdown help-menu\">\n\t\t\t\t<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n\t\t\t\t\tHelp\n\t\t\t\t\t<b class=\"caret\"></b>\n\t\t\t\t</a>\n\t\t\t\t<ul class=\"dropdown-menu\" role=\"menu\">\n\t\t\t\t\t<li role=\"presentation\">\n\t\t\t\t\t\t<a tabindex=\"-1\" href=\"https://github.com/AdamNowotny/BuildReactor\" target=\"_blank\" role=\"menuitem\">\n\t\t\t\t\t\t\t<i class=\"fa fa-github fa-fw\"></i> GitHub\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n \t\t\t\t\t<li role=\"presentation\" class=\"divider\"></li>\n\t\t\t\t\t<li role=\"presentation\">\n\t\t\t\t\t\t<a tabindex=\"-1\" href=\"https://twitter.com/BuildReactor\" target=\"_blank\" role=\"menuitem\">\n\t\t\t\t\t\t\t<i class=\"fa fa-twitter fa-fw\"></i> Twitter\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li role=\"presentation\">\n\t\t\t\t\t\t<a tabindex=\"-1\" href=\"https://plus.google.com/b/110744393630490320507/110744393630490320507/posts\" target=\"_blank\" role=\"menuitem\">\n\t\t\t\t\t\t\t<i class=\"fa fa-google-plus fa-fw\"></i> Google+\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li role=\"presentation\">\n\t\t\t\t\t\t<a tabindex=\"-1\" href=\"https://chrome.google.com/webstore/detail/buildreactor/agfdekbncfakhgofmaacjfkpbhjhpjmp\" target=\"_blank\" role=\"menuitem\">\n\t\t\t\t\t\t\t<img src=\"/img/chrome.svg\" width=\"18\" height=\"14\"> Chrome WebStore\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _view = __webpack_require__(152);

	var _view2 = _interopRequireDefault(_view);

	var _app = __webpack_require__(109);

	var _app2 = _interopRequireDefault(_app);

	var _view3 = __webpack_require__(153);

	var _view4 = _interopRequireDefault(_view3);

	var _view5 = __webpack_require__(154);

	var _view6 = _interopRequireDefault(_view5);

	var _view7 = __webpack_require__(155);

	var _view8 = _interopRequireDefault(_view7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.config(function ($routeProvider) {
		$routeProvider.when('/service/:serviceName', {
			templateUrl: _view6.default,
			controller: 'ServiceSettingsCtrl',
			view: 'service'
		}).when('/new', {
			templateUrl: _view2.default,
			controller: 'AddServiceCtrl',
			reloadOnSearch: false,
			view: 'new'
		}).when('/new/:serviceTypeId/:serviceName', {
			templateUrl: _view6.default,
			controller: 'ServiceSettingsCtrl',
			view: 'new'
		}).when('/view', {
			templateUrl: _view8.default,
			controller: 'ViewSettingsCtrl',
			view: 'view'
		}).when('/configuration', {
			templateUrl: _view4.default,
			controller: 'ConfigurationCtrl',
			view: 'configuration'
		}).otherwise({
			redirectTo: '/new'
		});
	}).config(function ($locationProvider) {
		$locationProvider.html5Mode(false);
	}).config(['$compileProvider', function ($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/).imgSrcSanitizationWhitelist(/^\s*(chrome-extension):/);
	}]);

/***/ },
/* 152 */
/***/ function(module, exports) {

	var path = 'settings/add/view.html';
	var html = "<section thumbnails service-types=\"serviceTypes\" selected=\"selectedTypeId\"></section>\n<section service-name-panel active=\"selectedTypeId\"></section>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 153 */
/***/ function(module, exports) {

	var path = 'settings/configuration/view.html';
	var html = "<form class=\"col-md-4\" role=\"form\">\n\t<fieldset>\n\t\t<legend>Current configuration</legend>\n\t\t<div class=\"form-group row\">\n\t\t\t<label class=\"col-md-6 control-label\">Include passwords</label>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<ul class=\"nav nav-pills\">\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: includePasswords }\" ng-click=\"includePasswords = true\"><a>On</a></li>\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: !includePasswords }\" ng-click=\"includePasswords = false\"><a>Off</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<div class=\"text-center\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-success\" ng-click=\"showLocalConfig()\">\n\t\t\t\t\t<i class=\"fa fa-cloud-upload\"></i> Export\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</fieldset>\n\t<fieldset>\n\t\t<legend>Import from URL</legend>\n\t\t<div class=\"form-group\">\n\t\t\t<div class=\"input-group\">\n\t\t\t\t<span class=\"input-group-addon\"><i class=\"fa fa-globe fa-fw\"></i></span>\n\t\t\t\t<input type=\"text\" class=\"form-control\" placeholder=\"URL\" type=\"url\" ng-model=\"configUrl\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group text-center\">\n\t\t\t<button type=\"button\" class=\"btn btn-success\" ng-click=\"showFromUrl(configUrl)\" ng-disabled=\"!configUrl\">\n\t\t\t\t<i class=\"fa fa-cloud-download\"></i> Import\n\t\t\t</button>\n\t\t</div>\n\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-show=\"urlError\">{{ urlError }}</div>\n\t</fieldset>\n</form>\n<div class=\"col-md-8\" style=\"height: 100%\">\n\t<section json-editor json=\"displayConfig\" style=\"height: 100%\"></section>\n</div>\n<section br-alert show=\"saving\"></section>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 154 */
/***/ function(module, exports) {

	var path = 'settings/service/view.html';
	var html = "<div class=\"settings-container\">\n\t<form class=\"settings-form\" action=\"\" role=\"form\">\n\t\t<section dynamic-form service=\"service\" config=\"config\"></section>\n\t\t<div class=\"settings-buttons\">\n\t\t\t<button type=\"button\" class=\"btn btn-primary\" ng-click=\"show()\">\n\t\t\t\t<i class=\"fa fa-refresh\" ng-class=\"{ 'fa-spin': isLoading }\"></i> Show\n\t\t\t</button>\n\t\t\t<button type=\"button\" class=\"btn btn-success\" ng-click=\"save()\">\n\t\t\t\t<i class=\"fa fa-save\"></i> Save\n\t\t\t</button>\n\t\t</div>\n\t</form>\n\t<div class=\"alert alert-danger\" ng-show=\"projectsError\">\n\t\t<div class=\"error-message\">{{ projectsError.name }}: {{ projectsError.message }}</div>\n\t\t<div>\n\t\t\t<a ng-href=\"{{ projectsError.url }}\" target=\"_blank\" class=\"alert-link\">\n\t\t\t\t{{ projectsError.url }}\n\t\t\t</a>\n\t\t</div>\n\t</div>\n\t<section selected-projects projects=\"config.projects\" service-name=\"{{ config.name }}\"></section>\n</div>\n<div class=\"project-selection-container\">\n\t<section view-selection views=\"views.all\" selected=\"views.selected\" ng-show=\"views.all.length\"></section>\n\t<section filter-query ng-show=\"projects.all.length\"></section>\n\t<section project-list projects=\"projects.all\" view-items=\"views.selectedItems\" selected=\"projects.selected\" filter=\"filterQuery\" ng-show=\"projects.all.length\"></section>\n</div>\n<section br-alert show=\"saving\"></section>\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 155 */
/***/ function(module, exports) {

	var path = 'settings/view/view.html';
	var html = "<div class=\"col-md-12\">\n\t<form class=\"form-horizontal col-md-4\" role=\"form\">\n\t\t<div class=\"form-group\">\n\t\t\t<label class=\"col-md-6 control-label\">Number of columns</label>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<input type=\"number\" class=\"form-control\" ng-change=\"save(viewConfig)\" ng-model=\"viewConfig.columns\">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<label class=\"col-md-6 control-label\">Column width</label>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<ul class=\"nav nav-pills\">\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: !viewConfig.fullWidthGroups }\" ng-click=\"setField('fullWidthGroups', false)\"><a>Fixed</a></li>\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: viewConfig.fullWidthGroups }\" ng-click=\"setField('fullWidthGroups', true)\"><a>Variable</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<label class=\"col-md-6 control-label\">Collapse groups</label>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<ul class=\"nav nav-pills\">\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: !viewConfig.singleGroupRows }\" ng-click=\"setField('singleGroupRows', false)\"><a>On</a></li>\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: viewConfig.singleGroupRows }\" ng-click=\"setField('singleGroupRows', true)\"><a>Off</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<label class=\"col-md-6 control-label\">Show commit messages</label>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<ul class=\"nav nav-pills\">\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: viewConfig.showCommits }\" ng-click=\"setField('showCommits', true)\"><a>On</a></li>\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: !viewConfig.showCommits }\" ng-click=\"setField('showCommits', false)\"><a>Off</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<label class=\"col-md-6 control-label\">Theme</label>\n\t\t\t<div class=\"col-md-6\">\n\t\t\t\t<ul class=\"nav nav-pills\">\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: viewConfig.theme === 'dark' }\" ng-click=\"setField('theme', 'dark')\"><a>Dark</a></li>\n\t\t\t\t\t<li role=\"presentation\" ng-class=\"{ active: viewConfig.theme === 'light' }\" ng-click=\"setField('theme', 'light')\"\"><a>Light</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n\t<div class=\"theme-{{ viewConfig.theme }} col-md-8\">\n\t\t<build-list services=\"activeProjects\"></build-list>\n\t</div>\n</div>";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ }
]);