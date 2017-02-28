angular
    .module('tracy-ui')
    .directive('applicationMeasurement', applicationMeasurement);

applicationMeasurement.$inject = ['$compile'];

function applicationMeasurement($compile)  {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'tracy-core/tracy-modules/application-measurement/application-measurement.html'
    };
    return directive;
}
