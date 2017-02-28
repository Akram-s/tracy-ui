var app = angular.module('tracy-ui');
app.controller('ConfigController',
        ['$scope', '$localStorage', '$http', 'testFactory', 'Storage', 'Registry', 'HttpRegistry',
        function($scope, $localStorage, $http, testFactory, Storage, Registry, HttpRegistry){

    $scope.updateConfig = function() {
        // Upon update update RegistryConfig Storage and update environmentController
        $scope.buildUrl();
        Storage.setRegistryConfig($scope.registryConfig);
        // TODO: Find a less extreme way to update config. This reloads app, along with all factories
        // location.reload(); forces factories to reload data. e.g. update Registry URL to newly stored value
        location.reload();
    }

    $scope.buildUrl = function()    {
        $scope.registryConfig.url = $scope.registryConfig.scheme
            + '://' + $scope.registryConfig.host
            + ':' + $scope.registryConfig.port
            + $scope.registryConfig.path
    }

    $scope.defaultConfig = function() {
        $scope.registryConfig.scheme = 'http';
        $scope.registryConfig.host = 'localhost';
        $scope.registryConfig.port = '8080';
        $scope.registryConfig.path = '/tws/v1/registry';
        $scope.registryConfig.static = true;
        $scope.buildUrl();
//        console.log($scope.registryConfig);
    }
///*
    $scope.alertError = function(message) {
        $scope.alerts.push({
            'type' : 'alert-danger',
            'message' : message
        })
    }

    $scope.alertSuccess = function(message) {
        $scope.alerts.push({
            'type' : 'alert-success',
            'message' : message
        })
    }

    $scope.alertReset = function() {
        $scope.alerts = [];
    }

    $scope.environmentsFromRegistryData = function(registryData)   {
        var environments = [];
        for (var i in registryData.environments) {
            environments.push(registryData.environments[i].name);
        }
        return environments;
    }

    $scope.testConfig = function() {
        $scope.alerts = [];
        if ($scope.registryConfig.static == false) {
            // TODO: When testing validate HttpRegistry returns environments
            $scope.buildUrl();
    //        console.log("Testing registry URL: " + $scope.registryConfig.url );
            $scope.promise = HttpRegistry.get($scope.registryConfig.url);
            $scope.promise.then(function(response) {
                $scope.alertSuccess("Registry successfully retrieved from: " + $scope.registryConfig.url);
                $scope.alertSuccess("Registry supports the following environments: " + $scope.environmentsFromRegistryData(response.data));
    //            console.log(response);
            }, function(response) {
                $scope.alertError("Error:" + JSON.stringify(response));
            });
        }
        else    {
            $scope.alertSuccess("Using static configuration (as defined in extensions/capabilities.json)");
        }
    }

    // At startup simply show current Registry config and test if if returns valid RegistryData
    $scope.alerts = [];
    $scope.registryConfig = Storage.getRegistryConfig();
    // Validate current config
    $scope.testConfig();
}]);
