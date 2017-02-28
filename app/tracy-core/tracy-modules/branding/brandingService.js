angular
    .module('tracy-ui')
    .factory('brandingService', brandingService);

brandingService.$inject = ['$http', '$resource'];

function brandingService($http, $resource)  {
    return $resource('extensions/branding/branding.json');
}