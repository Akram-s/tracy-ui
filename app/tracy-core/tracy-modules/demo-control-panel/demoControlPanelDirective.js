angular
    .module('tracy-ui')
    .directive('demoControlPanel', demoControlPanel);

demoControlPanel.$inject = ['$compile'];

function demoControlPanel($compile)  {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'tracy-core/tracy-modules/demo-control-panel/demo-control-panel.html'
    };
    return directive;
}
