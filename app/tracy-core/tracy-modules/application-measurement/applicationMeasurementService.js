angular
    .module('tracy-ui')
    .factory('applicationMeasurementService', applicationMeasurementService);

applicationMeasurementService.$inject = ['$http', 'Storage'];
function applicationMeasurementService($http, Storage)  {
    var service = {
        get: function(application, task) {
            var url = Storage.getApplicationServerUrl(application)
            + '/applications/' + encodeURIComponent(application)
            + '/measurement'
            var test = $http.get(url)
            .success(function(res){
                return res;
            });
            return test;
        }
    }
    return service;
}

