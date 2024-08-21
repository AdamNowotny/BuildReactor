import app from 'settings/app';
import serviceSettingsView from 'settings/service/view.html';

export default app
    .config($routeProvider => {
        $routeProvider
            .when('/service/:serviceName*', {
                templateUrl: serviceSettingsView,
                controller: 'ServiceSettingsCtrl',
                view: 'service',
            })
            .when('/new', {
                template: '<div id="add-page"></div>',
                controller: 'AddServiceCtrl',
                reloadOnSearch: false,
                view: 'new',
            })
            .when('/new/:serviceTypeId/:serviceName', {
                templateUrl: serviceSettingsView,
                controller: 'ServiceSettingsCtrl',
                view: 'new',
            })
            .when('/view', {
                template: '<div id="view-page"></div>',
                controller: 'ViewSettingsCtrl',
                view: 'view',
            })
            .when('/notifications', {
                template: '<div id="notifications-page"></div>',
                controller: 'NotificationsCtrl',
                view: 'notifications',
            })
            .when('/configuration', {
                template: '<div id="configuration-page"></div>',
                controller: 'ConfigurationCtrl',
                view: 'configuration',
            })
            .otherwise({
                redirectTo: '/new',
            });
    })
    .config($locationProvider => {
        $locationProvider.html5Mode(false);
    })
    .config([
        '$compileProvider',
        function ($compileProvider) {
            $compileProvider
                .aHrefSanitizationWhitelist(
                    /^\s*(https?|chrome-extension|moz-extension):/,
                )
                .imgSrcSanitizationWhitelist(/^\s*(chrome-extension|moz-extension):/);
        },
    ]);
