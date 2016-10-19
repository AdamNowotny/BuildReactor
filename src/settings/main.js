import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import './main.scss';
import 'jquery';
import 'html5sortable/src/html.sortable.src';
import 'settings/app';
import 'settings/controller';
import 'settings/routes';
import 'settings/service/controller';
import 'settings/add/controller';
import 'settings/view/controller';
import 'settings/configuration/controller';
import 'settings/directives/alert/alert';
import 'settings/directives/dynamicForm/dynamicForm';
import 'settings/directives/filterQuery/filterQuery';
import 'settings/directives/focusIf/focusIf';
import 'settings/directives/projectList/projectList';
import 'settings/directives/selectedProjects/selectedProjects';
import 'settings/directives/serviceNamePanel/serviceNamePanel';
import 'settings/directives/sidebar/sidebar';
import 'settings/directives/onOffSwitch/onOffSwitch';
import 'settings/directives/thumbnails/thumbnails';
import 'settings/directives/topnav/topnav';
import 'settings/directives/viewSelection/viewSelection';
import angular from 'angular';
import core from 'common/core';
import logger from 'common/coreLogger';

logger();
core.init();

angular.element(document).ready(() => {
	angular.bootstrap(document, ['settings']);
});
