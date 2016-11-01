webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(62);

	__webpack_require__(71);

	__webpack_require__(102);

	__webpack_require__(32);

	__webpack_require__(104);

	__webpack_require__(105);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	var _coreLogger = __webpack_require__(101);

	var _coreLogger2 = _interopRequireDefault(_coreLogger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_core2.default.init();
	(0, _coreLogger2.default)();

	_angular2.default.element(document).ready(function () {
		_angular2.default.bootstrap(document, ['popup']);
	});

/***/ },

/***/ 102:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 104:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	__webpack_require__(82);

	__webpack_require__(86);

	__webpack_require__(88);

	var _angular = __webpack_require__(83);

	var _angular2 = _interopRequireDefault(_angular);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _angular2.default.module('popup', ['ngRoute', 'ui.bootstrap.tooltip', 'uib/template/tooltip/tooltip-popup.html', 'app.directives']).config(['$compileProvider', function ($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
	}]);

/***/ },

/***/ 105:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _app = __webpack_require__(104);

	var _app2 = _interopRequireDefault(_app);

	var _core = __webpack_require__(91);

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _app2.default.controller('PopupCtrl', function ($scope) {
		$scope.navbarStyle = 'navbar-inverse';
		_core2.default.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.viewConfig = config;
				$scope.navbarStyle = config.theme === 'light' ? 'navbar-default' : 'navbar-inverse';
			});
		});
	});

/***/ }

});