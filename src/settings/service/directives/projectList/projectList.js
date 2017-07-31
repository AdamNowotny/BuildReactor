import 'angular-ui-bootstrap/src/accordion';
import 'angular-ui-utils/modules/highlight/highlight';
import 'angular-ui-utils/modules/indeterminate/indeterminate';
import angular from 'angular';
import app from 'settings/app';
import sortBy from 'common/sortBy';
import template from 'settings/service/directives/projectList/projectList.html';

export default app.directive('projectList', ($sce, highlightFilter) => ({
    scope: {
        projects: '=projects',
        selected: '=',
        filterQuery: '=filter'
    },
    templateUrl: template,
    controller($scope, $element, $attrs, $transclude) {
        $scope.groups = [];
        $scope.selected = [];

        $scope.$watch('projects', (projects) => {
            $scope.selected = $scope.selected || [];
            $scope.projectList = angular.copy($scope.projects) || [];
            $scope.projectList.forEach((project) => {
                project.isSelected = $scope.selected.includes(project.id);
            });
            $scope.groups = createGroups($scope.projectList);
            highlightNames($scope.projectList, $scope.filterQuery);
        });

        $scope.$watch('projectList', (projects) => {
            const selectedIds = projects.filter((project) => project.isSelected)
                .map((project) => project.id);
            updateCheckAll($scope.groups);
            if ($scope.groups.length) $scope.$emit('projectList.change', selectedIds);
        }, true);

        $scope.$watch('filterQuery', (query) => {
            $scope.groups.forEach((group) => {
                group.visibleCount = group.projects
                    .filter((project) => $scope.search(project))
                    .length;
            });
            highlightNames($scope.projectList, $scope.filterQuery);
        });

        $scope.search = function(project) {
            return project.name.toLowerCase().indexOf($scope.filterQuery.toLowerCase()) > -1;
        };

        $scope.checkAll = function(group) {
            group.projects.forEach((project) => {
                project.isSelected = group.allSelected;
            });
        };

        const highlightNames = function(projects, highlightText) {
            projects.forEach((project) => {
                const nameHtml = highlightFilter(project.name, highlightText);
                project.nameHtml = $sce.trustAsHtml(nameHtml);
            });
        };

    }
}));

const getGroupNamesFromProjects = (projects) =>
    [...new Set(projects.map((item) => item.group))]
    .sort();

const createGroups = function(projects) {
    const groupNames = getGroupNamesFromProjects(projects);
    return groupNames.map((groupName) => {
        const groupProjects = projects.filter((project) => project.group === groupName);
        const selectedProjects = groupProjects.filter((project) => project.isSelected);
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
};

const updateCheckAll = function(groups) {
    groups.forEach((group) => {
        const selectedProjects = group.projects.filter((project) => project.isSelected);
        group.someSelected = selectedProjects.length !== 0 && selectedProjects.length !== group.projects.length;
        group.allSelected = selectedProjects.length === group.projects.length;
    });
};
