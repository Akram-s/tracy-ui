angular
    .module('tracy-ui')
    .directive('d3Timeline', d3Timeline);

d3Timeline.$inject = ['$compile'];

function d3Timeline($compile)  {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'tracy-core/tracy-modules/d3-timeline/d3-timeline.html'
    };
    return directive;
}
