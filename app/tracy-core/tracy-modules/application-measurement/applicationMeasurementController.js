angular
    .module('tracy-ui')
    .controller('ApplicationMeasurementController', ApplicationMeasurementController);

ApplicationMeasurementController.$inject =
    ['$scope', '$stateParams', '$timeout', '$http', '$interval', 'Storage', 'applicationMeasurementService', 'measurableChartService'];

function ApplicationMeasurementController
    ($scope, $stateParams, $timeout, $http, $interval, Storage, applicationMeasurementService, measurableChartService)  {
    $scope.application = $stateParams.application;
    $scope.task = $stateParams.task;
    $scope.measurement = null;
	// Timer
    $scope.timeout = null;
	$scope.refreshMsecPeriod = 10000;

    $scope.getSnapInMsec = function(measurement) {
//        console.log(measurement);
        var minRefreshMsecPeriod = 60 * 60 * 1000; // 1 hour as upper boundary
        var candidateRefreshMsecPeriod = minRefreshMsecPeriod;
        var multiplier = 1;
        for (var i = 0, len = measurement.tasksSnapMeasurementSummary.tasks.length; i < len; i++) {
            var summary = measurement.tasksSnapMeasurementSummary.tasks[i];
            if (summary.periodUnit == 'h')    {
                multiplier = 60 * 60 * 1000;
            }
            else if (summary.periodUnit == 'm')    {
                multiplier = 60 * 1000;
            }
            else if (summary.periodUnit == 's')    {
                multiplier = 1000;
            }

            var taskSnapInMsec = summary.period * multiplier;
//            console.log("snap for " + summary.task + ": " + taskSnapInMsec + " (" + summary.period + " * " + multiplier + " " + summary.periodUnit +")");
            candidateRefreshMsecPeriod = Math.min(candidateRefreshMsecPeriod, taskSnapInMsec)
            candidateRefreshMsecPeriod = Math.min(taskSnapInMsec, candidateRefreshMsecPeriod);
        }
//        console.log("lowest snap: " + candidateRefreshMsecPeriod);
        return candidateRefreshMsecPeriod;
    }

    $scope.getChartData = function () {
        applicationMeasurementService.get($scope.application)
            .success(function (response) {
    //			console.log("GET /measurement [" + $scope.application + "]");
                $scope.measurement = response;
                // console.log($scope.measurement);
    //             console.log("Success:" + JSON.stringify(response));
                 $scope.multiApdexTimechart
                     = measurableChartService.getMultiTaskApdexTimechart($scope.application, $scope.measurement.multiApdexTimechart);
                 $scope.tasksMeasurementSummary = $scope.measurement.tasksSnapMeasurementSummary.tasks;

                 // Make refresh period 1/3 of snap
                 var snapInMsec = $scope.getSnapInMsec(response);
//                 console.log(snapInMsec);
                 $scope.refreshMsecPeriod = Math.min(snapInMsec, 5*60*1000); // But no more than 5 minutes
    //             console.log($scope.refreshMsecPeriod);
                 $timeout.cancel($scope.timeout);
                 $scope.timeout = $timeout($scope.getChartData, $scope.refreshMsecPeriod);
		    })
		    .error(function(errorResponse) {
				$scope.refreshMsecPeriod = 10000;
				console.log("Could not retrieve measurement, retrying in " + $scope.refreshMsecPeriod/1000 + " seconds" );
		   		$timeout.cancel($scope.timeout);
                $scope.timeout = $timeout($scope.getChartData, $scope.refreshMsecPeriod);
		    });
    };
    // console.log("Created MeasureTaskCtrl: [" + $scope.application + "][" + $scope.task + "]");

    $scope.getChartData();

    $scope.$on("$destroy", function() {
        // console.log("Destroyed MeasureTaskCtrl: [" + $scope.application + "][" + $scope.task + "]");
        $timeout.cancel($scope.timeout);
    });
}

