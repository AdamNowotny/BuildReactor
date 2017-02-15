import angular from 'angular';
import build from 'common/directives/build/build';
import core from 'common/core';

describe('build', () => {

	let scope;
	let element;

	beforeEach(angular.mock.module(
		'app.directives'
	));

	beforeEach(angular.mock.inject(($compile, $rootScope) => {
		element = $compile('<build build-info="item"></build>')($rootScope);
		$rootScope.$digest();
		scope = element.isolateScope();
	}));

	describe('commitsVisible', () => {

		it('do not show commits when build green', () => {
			core.views.onNext({ showCommitsWhenGreen: false });

			scope.build = {
				isBroken: false,
				isRunning: false
			};
			scope.$digest();

			expect(scope.commitsVisible).toBe(false);
		});

		it('show commits when build red', () => {
			core.views.onNext({ showCommitsWhenGreen: false });

			scope.build = {
				isBroken: true,
				isRunning: false
			};
			scope.$digest();

			expect(scope.commitsVisible).toBe(true);
		});

		it('show commits when build in progress', () => {
			core.views.onNext({ showCommitsWhenGreen: false });

			scope.build = {
				isBroken: false,
				isRunning: true
			};
			scope.$digest();

			expect(scope.commitsVisible).toBe(true);
		});

		it('show commits when build waiting', () => {
			core.views.onNext({ showCommitsWhenGreen: false });

			scope.build = {
				isBroken: false,
				isWaiting: true
			};
			scope.$digest();

			expect(scope.commitsVisible).toBe(true);
		});

	});

});
