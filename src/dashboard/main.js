import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import './main.scss';
import 'jquery';
import 'dashboard/app';
import 'dashboard/controller';
import angular from 'angular';
import core from 'common/core';
import logger from 'common/coreLogger';

core.init();
logger.init();

angular.element(document).ready(() => {
	angular.bootstrap(document, ['dashboard']);
});
