import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import '../common/_angular-ui.scss';
import './main.scss';
import 'settings/app';
import 'settings/controller';
import 'settings/routes';
import angular from 'angular';
import core from 'common/core';
import logger from 'common/logger';
import serviceMonitor from 'services/service-monitor';

logger.init({ prefix: 'settings' });
core.init();
serviceMonitor.init();

angular.element(document).ready(() => {
	angular.bootstrap(document, ['settings']);
});
