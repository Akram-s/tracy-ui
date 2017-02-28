angular
    .module('tracy-ui')
    .directive('force', force);

force.$inject = ['$compile'];

function force($compile)  {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'tracy-core/tracy-modules/force/force.html'
    };
    return directive;
}
