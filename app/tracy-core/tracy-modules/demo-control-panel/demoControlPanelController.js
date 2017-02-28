angular
    .module('tracy-ui')
    .controller('DemoControlPanelController', DemoControlPanelController);

DemoControlPanelController.$inject =
    ['$scope', '$stateParams', 'demoControlPanelService'];

function DemoControlPanelController ($scope, $stateParams, demoControlPanelService)  {
  $scope.application = $stateParams.application;
  $scope.task = $stateParams.task;
  $scope.environment = $stateParams.env;
  $scope.demoStatus;
  $scope.demoButtonLabel = "Start Demo";

  demoControlPanelService.setTaskConfig()
    .success(function (taskConfigResponse) {
        demoControlPanelService.getDemo()
            .success(function(demoStatusResponse) {
                $scope.updateDemoStatus(demoStatusResponse.demo);
            })
    })

  $scope.updateDemoStatus = function(status)  {
    $scope.demoStatus = status;
//    console.log("Demo: " + status);
    if (status) {
        $scope.demoButtonLabel = "Stop Demo";
    }
    else {
        $scope.demoButtonLabel = "Start Demo";
    }
  }

  $scope.toggleDemo = function() {
    var nextState = !$scope.demoStatus;

    if (nextState)    {
//        console.log("Starting Demo");
    }
    else{
//        console.log("Stopping Demo");
    }
    demoControlPanelService.setDemo(nextState)
        .success(function (demoStatusResponse) {
            $scope.updateDemoStatus(demoStatusResponse.demo);
        })
  }

  $scope.deleteTracy = function() {
//    console.log("Deleting all Tracy");
    demoControlPanelService.deleteTracy();
  };
}