angular
    .module('tracy-ui')
    .factory('taskMeasurementService', taskMeasurementService);

taskMeasurementService.$inject = ['$http', 'Storage'];
function taskMeasurementService($http, Storage)  {
    var service = {
        get: function(application, task) {
            var url = Storage.getTaskServerUrl(application, task,category)
            + '/applications/' + encodeURIComponent(application)
            + '/tasks/' + encodeURIComponent(task)
            + '/measurement'
            if(category){
				url = url + '?categroy=' + category;
			}
            var test = $http.get(url)
            .success(function(res){
                return res;
            });
            return test;
        }
    }
    return service;
}

