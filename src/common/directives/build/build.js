import 'angular-ui-bootstrap/src/tooltip/tooltip';
import core from 'common/core';
import module from 'common/directives/module';
import templateUrl from 'common/directives/build/build.html';

module.directive('build', ($interval) => ({
	restrict: 'E',
	scope: {
		build: '=buildInfo'
	},
	templateUrl,
	controller($scope, $element, $attrs, $transclude) {

		const commentChangeInterval = 7000;
		$scope.changeIndex = 0;

		const changesLength = $scope.build && $scope.build.changes ? $scope.build.changes.length : 0;
		if (changesLength > 1) {
			$interval(() => {
				$scope.changeIndex = ($scope.changeIndex + 1) % changesLength;
			}, commentChangeInterval);
		}

		$scope.getLabelClasses = (tag) => {
			const tagType = tag.type || 'default';
			return `label-${tagType}`;
		};


		core.views.subscribe((config) => {
			$scope.$evalAsync(() => {
				$scope.viewConfig = config;
				$scope.commitsVisible = true;
				if ($scope.build && !config.showCommitsWhenGreen) {
					$scope.commitsVisible = Boolean($scope.build.isBroken
						|| $scope.build.isRunning
						|| $scope.build.isWaiting);
				}
			});
		});

	}
}));
