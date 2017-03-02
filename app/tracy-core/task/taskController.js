var app = angular.module('tracy-ui');

app.controller('TaskController',
    ['$scope', '$log', '$stateParams','$sce', '$compile', 'Storage', function($scope, $log, $stateParams, $sce, $compile, Storage){
    $scope.$log = $log;
    $scope.taskContext = {};
    $scope.environment = $stateParams.env;
    $scope.application = $stateParams.application;
    $scope.task = $stateParams.task;
    $scope.view = $stateParams.view;
    $scope.activeIndex = 0;
    $scope.initialised = false;

    Storage.setSelectedEnvironment($stateParams.env);
    $scope.$on('updatedApplicationMenuItemContext', function() {
//        console.log($scope.taskContext);
    });

    $scope.generateControllerName = function (str) {
        var controllerName = str[0].toUpperCase() + str.replace(/-([a-z])/g, function(a, b) {
            return b.toUpperCase();
        }).slice(1);
        controllerName = controllerName + 'Controller';
        return controllerName;
    };

    // Update tabs from views and selected view and
    $scope.buildModuleHtml = function(selectedView)    {
        // Build the inner
        var tabsHtml = "";
        var index = 0;
        for (view in $scope.taskContext.views)  {
//            console.log(view);
            if (view == selectedView)  {
                $scope.activeIndex = index;
//                console.log($scope.activeIndex);
            }
            var module = $scope.taskContext.views[view].module;
            var controller = $scope.generateControllerName(module);
//            console.log("module: " + module + "; controller: " + controller);
            tabsHtml = tabsHtml + '<uib-tab index="'+index+'" heading="' + view + '">'
            + '<'+module+' ng-controller="'+controller+'">'+'</'+module+'>'
            + '</uib-tab>';
            index++;
        }
        tabsHtml = '<uib-tabset active="activeIndex">' + tabsHtml + '</uib-tabset>';
//        console.log(tabsHtml);
        $scope.initialised = true;
        return tabsHtml;
    }

    $scope.getDefaultView = function(context)   {
        var viewCount = 0;
        var detectedDefaultView;
        var firstView;
        var defaultView;

        for (view in $scope.taskContext.views)  {
            $log.debug("iterating view: " + view);
            if ($scope.taskContext.views[view].isDefault == true)  {
                detectedDefaultView = view;
            }
            if (viewCount == 0) {
                firstView = view;
            }
            viewCount++;
        }

        if (detectedDefaultView != undefined)    {
            defaultView = detectedDefaultView;
        }
        else if (firstView != undefined) {
            defaultView = firstView;
        }
        else    {
            console.error("no views found")
        }
//        console.log(JSON.stringify(defaultView));
        return defaultView;
    }

    $scope.isValidView = function(context, view)    {
        return (view in $scope.taskContext.views)
    }

    $scope.selectView = function(context)    {
        var selectedView;
        // If tab selected and valid
        if ($scope.view!=undefined && $scope.isValidView(context, $scope.view))   {
            selectedView = $scope.view;
            $log.info("Selected Task view: "+ $scope.view);
        }
        else    {
            if ($scope.view!=undefined && !$scope.isValidView(context, $scope.view)) {
                $log.error("Unknown Task view: " + $scope.view);
            }
            selectedView = $scope.getDefaultView(context)
            $log.info("Defaulted to view: "+ selectedView);
        }
        return selectedView;
    }

    $scope.updateTaskContext = function()   {
        var capabilities = Storage.getCapabilities();
        var selectedEnvironment = Storage.getSelectedEnvironment();
//        console.log("updateTaskContext - capabilities:" + JSON.stringify(capabilities));
//        console.log("updateTaskContext - env:" + JSON.stringify(selectedEnvironment));
        if (capabilities != undefined && selectedEnvironment != undefined)  {
            $scope.taskContext = Storage.getCapabilities()
                .environments[Storage.getSelectedEnvironment()]
                .applications[$stateParams.application]
                .tasks[$stateParams.task];

            var selectedView = $scope.selectView($scope.taskContext);
            $scope.moduleHtml =  $scope.buildModuleHtml(selectedView);
        }
    }

    $scope.$on('updatedCapabilities', function() {
//        console.log($stateParams);
        $scope.updateTaskContext();
    });

    $scope.$on('updatedSelectedEnvironment', function() {
//        console.log($stateParams);
        // TODO: COULD: Provide support to switch to same Task on a different environment
        // Problems: The switched-to environment may not have the same task
//        $scope.updateTaskContext();
    });

//    console.log($stateParams);
    $scope.updateTaskContext();
}]);

app.directive('taskmodule', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.taskmodule, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});
