angular
    .module('tracy-ui')
    .controller('HelloWorldController', HelloWorldController);

HelloWorldController.$inject =
    ['$scope', '$stateParams'];

function HelloWorldController ($scope, $stateParams)  {
  $scope.application = $stateParams.application;
  $scope.task = $stateParams.task;
  $scope.environment = $stateParams.env;
}