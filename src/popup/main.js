import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import '../common/_angular-ui.scss';
import './main.scss';
import 'popup/app';
import 'popup/controller';
import angular from 'angular';
import core from 'common/core';
import logger from 'common/coreLogger';

core.init();
logger.init({ debug: false });

angular.element(document).ready(() => {
	angular.bootstrap(document, ['popup']);
});
