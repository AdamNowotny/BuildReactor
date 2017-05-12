import 'settings/directives/alert/alert';
import 'settings/service/directives/dynamicForm/dynamicForm';
import 'settings/service/directives/filterQuery/filterQuery';
import 'settings/service/directives/projectList/projectList';
import 'settings/service/directives/selectedProjects/selectedProjects';
import app from 'settings/app';
import core from 'common/core';

export default app.controller('ServiceSettingsCtrl', ($scope, $location) => {

    let config;

    const reset = function() {
        $scope.projects = {
            all: [],
            selected: null,
            loaded: false
        };
        $scope.projectsError = null;
        $scope.isLoading = false;
        $scope.filterQuery = '';
    };

    const showError = function(errorResponse) {
        reset();
        $scope.projectsError = errorResponse;
    };

    const showProjects = function(projects) {
        $scope.projectsError = null;
        $scope.projects = {
            all: projects.items,
            selected: projects.selected,
            loaded: true
        };
    };

    $scope.show = function() {
        reset();
        $scope.isLoading = true;
        core.availableProjects(config, (response) => {
            $scope.$evalAsync(() => {
                $scope.isLoading = false;
                if (response.error) {
                    showError(response.error);
                } else {
                    showProjects(response.projects);
                }
            });
        });
    };

    $scope.save = function() {
        core.saveService(config);
        $scope.saving = true;
        $scope.projects.selected = config.projects;
        $location.path(`/service/${config.name}`);
    };

    $scope.$on('dynamicForm.changed', (event, updatedConfig) => {
        config = updatedConfig;
    });

    $scope.$on('filterQuery.changed', (event, query) => {
        $scope.filterQuery = query;
    });

    $scope.$on('projectList.change', (event, selectedProjects) => {
        if (config) {
            config.projects = selectedProjects;
        }
    });

    reset();
});
