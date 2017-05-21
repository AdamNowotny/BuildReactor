import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import '../common/_angular-ui.scss';
import './main.scss';
import 'jquery';
import 'html5sortable/src/html.sortable.src';
import 'settings/app';
import 'settings/controller';
import 'settings/routes';
import angular from 'angular';
import core from 'common/core';
import logger from 'common/coreLogger';

logger.init();
core.init();

angular.element(document).ready(() => {
	angular.bootstrap(document, ['settings']);
});
