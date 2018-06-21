angular
    .module('tracy-ui')
    .controller('TaskTimelineController', TaskTimelineController);

TaskTimelineController.$inject = ['$scope', '$stateParams','$q', 'taskTimelineWebService', 'Storage'];

function TaskTimelineController
    ($scope, $stateParams, $q, taskTimelineWebService, Storage)  {
  function disableIfFirst() {
    var disabled = "";
    if ($scope.sequenceId == 1) {
      disabled = "disabled";
    }
    return disabled;
  }

  function previousUrl()  {
    var decrement = 1;
    if ($scope.sequenceId == 1) {
      decrement = 0;
    }
    var prevUrl = "/timeline/"
      + (Number($scope.sequenceId)-decrement)
      + "?env=" + $scope.environment
      + "&application=" + $scope.application
      + "&task=" + $scope.task
      + "&earliest=" + $scope.earliest
      + "&latest=" + $scope.latest
      + "&rtBelow=" + $stateParams['rtBelow']
      + "&rtAbove=" + $stateParams['rtAbove'];
      if($scope.category){
		prevUrl = prevUrl + "&category=" + $scope.category;
	}
    return prevUrl;
  }

  function nextUrl()  {
    var increment = 1;
//    console.log("$scope.sequenceId:" + $scope.sequenceId + ", $scope.lastId:" + $scope.lastId);
    if ($scope.sequenceId == $scope.lastId) {
      increment = 0;
    }
    var nextUrl = "/timeline/"
    + (Number($scope.sequenceId)+increment)
    + "?env=" + $scope.environment
    + "&application=" + $scope.application
    + "&task=" + $scope.task
    + "&earliest=" + $scope.earliest
    + "&latest=" + $scope.latest
    + "&rtBelow=" + $stateParams['rtBelow']
    + "&rtAbove=" + $stateParams['rtAbove'];
      if($scope.category){
		nextUrl = nextUrl + "&category=" + $scope.category;
	}
    return nextUrl;
  }

  function disableIfLast() {
    var disabled = "";
    if ($scope.sequenceId == $scope.lastId) {
      disabled = "disabled";
    }
    // console.log($scope.sequenceId + "-" +$scope.lastId);
    return disabled;
  }

  function mockTracyEvent(timeOffset)  {
    var rt = 1446415872559;
    // var offset = 10; // msecOffset
    // var offset = 1010; // secOffset
    // var offset = 61010; // minOffset
    var offset = 3601000; // hourOffset
    var tracyEvents = [
      {"taskId":"TID-ab1234-x","parentOptId":"4F3D","label":"foo","optId":"AD24","msecBefore":timeOffset+rt+offset*5,"msecAfter":timeOffset+rt+offset*7,"msecElapsed":offset*2,"host":"ukdb807735-3.local","component":"Service"}
      ,{"taskId":"TID-ab1234-x","parentOptId":"4F3D","label":"bar","optId":"AE5F","msecBefore":timeOffset+rt+offset*3,"msecAfter":timeOffset+rt+offset*5,"msecElapsed":offset*2,"host":"ukdb807735-3.local","component":"Service"}
      ,{"taskId":"TID-ab1234-x","parentOptId":"23CF","label":"Http servlet","optId":"4F3D","msecBefore":timeOffset+rt+offset*2,"msecAfter":timeOffset+rt+offset*8,"msecElapsed":offset*6,"host":"ukdb807735-3.local","component":"Service"}
      ,{"taskId":"TID-ab1234-x","parentOptId":"DBF5","label":"Service handler","optId":"23CF","msecBefore":timeOffset+rt+offset,"msecAfter":timeOffset+rt+offset*9,"msecElapsed":offset*8,"host":"ukdb807735-3.local","component":"Proxy"}
      ,{"taskId":"TID-ab1234-x","parentOptId":"AAAA","label":"Client handler","optId":"DBF5","msecBefore":timeOffset+rt,"msecAfter":timeOffset+rt+offset*10,"msecElapsed":offset*10,"host":"ukdb807735-3.local","component":"Proxy"}
      ];
    return tracyEvents;
  }

  function mockTracyTaskCreation(timeOffset)  {
    var tracyTask = {tracyTask: {tracyEvents: []}};
    tracyTask.tracyTask.tracyEvents = mockTracyEvent(timeOffset);
    return tracyTask;
  }

  //TaskMeasurement.get({application: $scope.application, task: $scope.task},
  function mockTaskAnalysisReource(query) {
    var response = {application: '', task: '', tracyTasksPage : {}};
    response.application = query.application;
    response.task = query.task;
    response.tracyTasksPage.offset = 0;
    response.tracyTasksPage.limit = 20;
    response.tracyTasksPage.records = 18;
    response.tracyTasksPage.tracyTasks = [];
    for (var i=0 ; i<response.tracyTasksPage.records ; i++) {
      response.tracyTasksPage.tracyTasks.push(mockTracyTaskCreation(3600000*i));
    }
    // console.log(response);
    return response;
  }

  $scope.getTaskAnalysis = function(query) {
      var deferred = $q.defer();
      taskTimelineWebService.get(query)
        .success(function (response) {
//           Uncomment to use TWS mock response
//           response = mockTaskAnalysisResource(query);
//           console.log(JSON.stringify(mockTaskAnalysisResource(query).tracyTasksPage.tracyTasks[0].tracyTask.tracyEvents));
//           console.log(JSON.stringify(response.tracyTasksPage.tracyTasks[0].tracyTask.tracyEvents));
          $scope.lastId = response.tracyTasksPage.records;

          if ($scope.sequenceId == "_last") {
            // FIXME: _last is a hack to display the last frame in the time window
            $scope.sequenceId = $scope.lastId;
            deferred.resolve(response.tracyTasksPage.tracyTasks[response.tracyTasksPage.records-1].tracyTask.tracyEvents);
          }
          else  {
            deferred.resolve(response.tracyTasksPage.tracyTasks[$scope.sequenceId-1].tracyTask.tracyEvents);
          }

          // Get msecBefore from the root frame
          var rootFrameMsecBefore = response.tracyTasksPage.tracyTasks[$scope.sequenceId-1].tracyTask.tracyEvents[0].msecBefore;
//          console.log(rootFrameMsecBefore);

          $scope.timelineStartTime = new Date(rootFrameMsecBefore).toUTCString();
          $scope.disablePrevious = disableIfFirst();
          $scope.disableLast = disableIfLast();
          $scope.prevUrl = previousUrl();
          $scope.nextUrl = nextUrl();
        });
        return deferred.promise;
  }

  function isRelativeTimeModifier(modifier) {
    var qualifierSplit = modifier.split(/(\d+)/);
    var test = qualifierSplit[0]=="-"
        && !isNaN(qualifierSplit[1])
        && (qualifierSplit[2] == "d"
            || qualifierSplit[2] == "h"
            || qualifierSplit[2] == "m"
            || qualifierSplit[2] == "s")
    if (test)   {
//        console.log(modifier + " is a valid modifier")
    }
    else    {
        console.log(modifier + " is NOT a valid modifier")
    }
    return test;
  }

  function getTimeOffset(timeQualifier)  {
    var qualifierSplit = timeQualifier.split(/(\d+)/);
    var timeOffset = 0;

//    console.log(qualifierSplit);

     if (qualifierSplit[2] == "d")  {
       timeOffset = Date.now() - qualifierSplit[1]*(1000*60*60*24)
     }
     else if(qualifierSplit[2] == "h")  {
       timeOffset = Date.now() - qualifierSplit[1]*(1000*60*60)
     }
     else if(qualifierSplit[2] == "m")  {
       timeOffset = Date.now() - qualifierSplit[1]*(1000*60)
     }
     else if(qualifierSplit[2] == "s")  {
       timeOffset = Date.now() - qualifierSplit[1]*(1000)
     }
     else {
        console.log("Unknown time qualifier:" + timeQualifier);
     }
    return timeOffset;
  }

  function timeModifierConversion(timeQualifier)   {
    var time=0;
    if (isNaN(timeQualifier))   {
//      console.log(timeQualifier);
      if (timeQualifier == "now") {
        time = Date.now();
      }
      else if (isRelativeTimeModifier(timeQualifier)) {
        time = getTimeOffset(timeQualifier)
      }
    }
    else {
      time = timeQualifier;
    }
    return time;
  }

  function getSequenceIdFromKeyword(keyword)  {
    var id;
//    console.log("$scope.lastId: " + $scope.lastId);
    if (keyword == "_first") {
      id = 1;
    }
    else if (keyword == "_last") {
      // FIXME: _last requires knowing how many will be returned in advance
      id = keyword;
    }
    else {
      id = keyword;
    }
//    console.log(id);
    return id;
  }

  function prepareAnalysisQuery(application, task, earliest, latest, rtAbove, rtBelow,category) {
    var query = {};
    query.earliest = earliest;
    query.latest = latest;
    query.application = application;
    query.task = task;
    query.filter = "msecElapsed:[" + rtAbove + " TO " + rtBelow + "]";
    query.sort = "-msecElapsed";
    query.offset = "0";
    query.limit = "20";
    query.category = category;
    return query;
  }

  var rt = 1446415872559;
    // var offset = 10; // msecOffset
    // var offset = 1010; // secOffset
    // var offset = 61010; // minOffset
  var offset = 3601000; // hourOffset

  $scope.environment = $stateParams['env'];
  // Convert time modifiers to epoch time
  $scope.earliest = timeModifierConversion($stateParams['earliest']);
  $scope.latest = timeModifierConversion($stateParams['latest']);
  $scope.rtAbove = $stateParams['rtAbove'];
  $scope.rtBelow = $stateParams['rtBelow'];
  $scope.sequenceId = getSequenceIdFromKeyword($stateParams['sequenceId'])
  $scope.application = (typeof $stateParams['application'] === 'undefined') ? 'unknown-application' : $stateParams['application'];
  $scope.task = (typeof $stateParams['task'] === 'undefined') ? 'unknown-task' : $stateParams['task'];
  $scope.timelineStartTime = new Date(Number($scope.earliest)).toUTCString();
  if($stateParams['category']){
	$scope.category = $stateParams['category'];
  }
//  console.log("earliest=" + $stateParams['earliest'] + ", latest=" + $stateParams['latest']);
//  console.log("earliest=" + $scope.earliest + ", latest=" + $scope.latest);
//  console.log($stateParams);

  Storage.setSelectedEnvironment($scope.environment);
  $scope.query = prepareAnalysisQuery($scope.application, $scope.task, $scope.earliest, $scope.latest, $scope.rtAbove, $scope.rtBelow, $scope.category);
  $scope.dataPromise = $scope.getTaskAnalysis($scope.query);
//  console.log(JSON.stringify($scope.dataPromise));
//  $scope.dataPromise.then(function(greeting) {
//    console.log('Success: ' + greeting);
//  }, function(reason) {
//    console.log('Failed: ' + reason);
//  }, function(update) {
//    console.log('Got notification: ' + update);
//  });
}
