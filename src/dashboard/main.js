import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import '../common/_angular-ui.scss';
import './main.scss';
import 'dashboard/app';
import 'dashboard/controller';
import angular from 'angular';
import core from 'common/core';
import logger from 'common/logger';

core.init();
logger.init({ prefix: 'dashboard' });

angular.element(document).ready(() => {
	angular.bootstrap(document, ['dashboard']);
});
