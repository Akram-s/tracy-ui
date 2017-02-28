angular
    .module('tracy-ui')
    .controller('BrandingController', BrandingController);

BrandingController.$inject = ['$scope', 'brandingService'];

function BrandingController($scope, brandingService)  {
    brandingService.get(function(data){
        $scope.name = data.name;
        $scope.logo = data.logo;
        $scope.icon = data.icon;
        $scope.version = data.version;
    });

}