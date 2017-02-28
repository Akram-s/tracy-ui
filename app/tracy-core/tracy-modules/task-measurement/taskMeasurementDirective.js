angular
    .module('tracy-ui')
    .directive('taskMeasurement', taskMeasurement);

taskMeasurement.$inject = ['$compile'];

function taskMeasurement($compile)  {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'tracy-core/tracy-modules/task-measurement/task-measurement.html'
    };
    return directive;
}
