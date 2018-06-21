angular
    .module('tracy-ui')
    .controller('TaskMeasurementController', TaskMeasurementController);

TaskMeasurementController.$inject =
    ['$scope', '$stateParams', '$timeout', '$http', '$interval', 'Storage', 'taskMeasurementService', 'measurableChartService'];

//http://localhost:8080/tws/v1/applications/demo-live/tasks/hello-tracy-sim/measurement

function TaskMeasurementController
    ($scope, $stateParams, $timeout, $http, $interval, Storage, taskMeasurementService, measurableChartService)  {
        $scope.application = $stateParams.application;
        $scope.task = $stateParams.task;
        $scope.environment = Storage.recoverSelectedEnvironment();
        $scope.rttT = 0;
        $scope.rttF = 0;
        $scope.rttUnit = "ms";
        $scope.earliest = 0;
        $scope.latest = 0;
	    $scope.measurement = null;
	    // Timer
        $scope.timeout = null;
	    $scope.refreshMsecPeriod = 10000;

        $scope.updateTimelineUrl = function ()  {
            $scope.timelineUrl = "#/timeline/1?env=" + $scope.environment
                           + "&application=" + $scope.application
                           + "&task=" + $scope.task
                           + "&earliest=" + $scope.earliest
                           + "&latest=" + $scope.latest
                           + "&rtBelow=" + $scope.rttF * 100
                           + "&rtAbove=" + 0;
        }

	    $scope.getChartData = function () {
		    var splitTaskArray = $scope.task.split("-");
		    if(splitTaskArray.length>1){
			$scope.category = splitTaskArray[0];
			$scope.webServiceTask = splitTaskArray[1];
		    }else{
			 $scope.webServiceTask = $scope.task;
			}
		    taskMeasurementService.get($scope.application, $scope.task, $scope.webServiceTask,$scope.category)
		    	.success(function (response) {
//			console.log("GET /measurement [" + $scope.application + "][" + $scope.task + "]");
			$scope.measurement = response;
			// console.log($scope.measurement);
			// console.log("Success:" + JSON.stringify(response));
                    	$scope.rttT = $scope.measurement.singleApdexTimechart.rttT;
                    	$scope.rttF = $scope.measurement.singleApdexTimechart.rttF;
                    	$scope.rttUnit = $scope.measurement.singleApdexTimechart.rttUnit;
                    	$scope.spanCount = d3.sum($scope.measurement.vitalsTimechart.count)
                    	var timeSequenceLength = $scope.measurement.singleApdexTimechart.timeSequence.length;
                    	$scope.earliest = $scope.measurement.vitalsTimechart.timeSequence[0];
                    	$scope.latest = $scope.measurement.vitalsTimechart.timeSequence[timeSequenceLength-1];

                    	// Make refresh period 1/3 of snap
                    	var snapInMsec = ($scope.measurement.vitalsTimechart.timeSequence[1]
                                - $scope.measurement.vitalsTimechart.timeSequence[0]);
//                    console.log(snapInMsec);
                    $scope.refreshMsecPeriod = Math.min(snapInMsec/3, 5*60*1000); // But no more than 5 minutes
//                    console.log($scope.refreshMsecPeriod);
		   		    $timeout.cancel($scope.timeout);
                    $scope.timeout = $timeout($scope.getChartData, $scope.refreshMsecPeriod);

				    $scope.singleTaskApdexTimechart
		    			= measurableChartService.getSingleTaskApdexTimechart($scope.environment, $scope.application, $scope.task, $scope.measurement.singleApdexTimechart, $scope.category);
		    		$scope.singleTaskVitalsTimechart =
		    			measurableChartService.getSingleTaskVitalsTimechart($scope.environment, $scope.application, $scope.task, $scope.measurement.vitalsTimechart, $scope.category);
		    		$scope.latencyHistogram =
		    			measurableChartService.getLatencyHistogram($scope.environment, $scope.application, $scope.task, $scope.measurement.latencyHistogram, $scope.category);
				})
				.error(function (errorResponse) {
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
