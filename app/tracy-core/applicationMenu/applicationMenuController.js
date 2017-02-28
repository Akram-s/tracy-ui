var app = angular.module('tracy-ui');

app.controller('ApplicationMenuController',
    ['$scope', '$http', '$sce', '$compile', 'Storage', function($scope, $http, $sce, $compile, Storage){
    $scope.menu = {
        'applications': {
            'AppX' : {
                'tasks' : {
                    'AppX T1' : {},
                    'AppX T2' : {},
                    'AppX T3' : {},
                    'AppX T4' : {},
                    'AppX T5' : {},
                    'AppX Tn' : {}
                }
            },
            'AppY' : {
                'tasks' : {
                    'AppY T1' : {},
                    'AppY T2' : {},
                    'AppY T3' : {},
                    'AppY T4' : {},
                    'AppY T5' : {},
                    'AppY Tn' : {}
                }
            }
        }
    };

    $scope.storeMenuItemContext = function(context)   {
        Storage.setApplicationMenuItemContext(context);
        console.log(context);
    }

    $scope.applicationsMenuHtml = function (menu, environment) {
        var html = '';
        for (application in menu.applications) {
            html = html + '<li class="dropdown-header"><a '
            + 'ui-sref="application({ env: \'' + environment + '\', application: \'' + application + '\' })">'
                + application
                + '</a></li>';
            for (task in  menu.applications[application].tasks)    {
                html = html + '<li><a '
                + 'ui-sref="task({ env: \'' + environment + '\', application: \'' + application + '\', task: \'' + task + '\' })">'
                    + task
                    + '</a></li>'
            }
            html = html + '<li role="separator" class="divider"></li>';
        }
        return html;
    };

    $scope.updateMenu = function()  {
//        console.log(JSON.stringify(Storage.getCapabilities()));
//        console.log(JSON.stringify(Storage.getSelectedEnvironment()));
        var capabilities = Storage.getCapabilities();
        var selectedEnvironment = Storage.getSelectedEnvironment();
        if (capabilities != undefined && selectedEnvironment != undefined)  {
            $scope.menu = Storage.getCapabilities().environments[Storage.getSelectedEnvironment()];
            $scope.menuHtml = $scope.applicationsMenuHtml($scope.menu, selectedEnvironment);
        }
    }

    $scope.$on('updatedCapabilities', function() {
        $scope.updateMenu();
    });

    $scope.$on('updatedSelectedEnvironment', function() {
        $scope.updateMenu();
    });

}]);

app.directive('menu', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.menu, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});
