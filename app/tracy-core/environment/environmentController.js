angular.module('tracy-ui').controller('EnvironmentController', ['$scope', 'Storage', 'HttpRegistry', '$http',
    function($scope, Storage, HttpRegistry, $http){

        if ( Storage.isRegistryStatic())    {
            $http.get('extensions/capabilities.json').success(function(data) {
                // Update config
    //            console.log(data);
    //            console.log(JSON.stringify(data));
                $scope.environments = [];
                for (var environmentName in data.environments) {
                    $scope.environments.push({name: environmentName});
    //                console.log(environmentName);
                }

//                console.log('load persisted selected environment');
                var selectedEnvironment = Storage.recoverSelectedEnvironment();
//                console.log('delete persisted selected environment');
//                Storage.deleteSelectedEnvironment();

                $scope.selectedEnvironment = $scope.environments[$scope.environmentOffset(selectedEnvironment)];
                // Update applicationMenu
                Storage.setCapabilities(data);
                Storage.setSelectedEnvironment($scope.selectedEnvironment.name);
            });
        }
        else    {
            $scope.promise = HttpRegistry.get(Storage.getRegistryUrl());
            $scope.promise.then(function(response) {
                $scope.registryData = response.data;
                $scope.environments = response.data.environments;
                console.log("Environments:" + JSON.stringify($scope.environments));
        //        console.log($scope.registryData);
                $scope.selectedEnvironment = $scope.registryData.environments[0];
                // TODO: Get environment capabilities for all environments
                // Update ApplicationMenu for selected environment
                Storage.setCapabilities(response);
                Storage.setSelectedEnvironment($scope.selectedEnvironment);
            }, function(response) {
                alert('Registry service access failed at: ' + Storage.getRegistryUrl());
            });
        }

        $scope.environmentOffset = function(environmentName)   {
            var environmentId = 0;
            for (var environment in $scope.environments) {
                if ($scope.environments[environment].name === environmentName )    {
//                    console.log($scope.environments[environment].name);
                    environmentId = environment;
                }
            }
//            console.log(environmentId);
            return environmentId;
        }

        $scope.selectEnvironment = function(environment)    {
            $scope.selectedEnvironment = environment;
            Storage.setSelectedEnvironment(environment.name);
            Storage.persistSelectedEnvironment(Storage.getSelectedEnvironment());
        }

        $scope.$on('updatedSelectedEnvironment', function() {
//            console.log(Storage.getSelectedEnvironment());
            var selectedEnvironment = Storage.getSelectedEnvironment();
            $scope.selectedEnvironment = $scope.environments[$scope.environmentOffset(selectedEnvironment)];
            Storage.persistSelectedEnvironment(Storage.getSelectedEnvironment());
        });
}]);
