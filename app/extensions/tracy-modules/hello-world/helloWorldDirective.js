angular
    .module('tracy-ui')
    .directive('helloWorld', helloWorld);

helloWorld.$inject = ['$compile'];

function helloWorld($compile)  {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'extensions/tracy-modules/hello-world/hello-world.html'
    };
    return directive;
}
