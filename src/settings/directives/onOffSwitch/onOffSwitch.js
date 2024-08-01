import app from 'settings/app';
import template from 'settings/directives/onOffSwitch/onOffSwitch.html';

export default app.directive('onOffSwitch', () => ({
    scope: {
        onOff: '=onOff',
    },
    templateUrl: template,
    controller($scope, $element, $attrs, $transclude) {
        $scope.$watch('onOff', onOff => {
            $scope.switch = onOff ? 'on' : 'off';
        });

        $scope.userSwitch = function (newValue) {
            $scope.$emit('onOffSwitch.change', newValue === 'on');
        };
    },
}));
