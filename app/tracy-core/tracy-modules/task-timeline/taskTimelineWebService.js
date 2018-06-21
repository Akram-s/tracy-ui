angular
    .module('tracy-ui')
    .factory('taskTimelineWebService', taskTimelineWebService);

taskTimelineWebService.$inject = ['$http', 'Storage'];
function taskTimelineWebService($http, Storage)  {
    var service = {
        get: function(params) {
            var url = Storage.getTaskServerUrl(params.application, params.task)
            + '/applications/' + encodeURIComponent(params.application)
            + '/tasks/' + encodeURIComponent(params.task)
            + '/analysis'
            + '?earliest=' + params.earliest
            + '&latest=' + params.latest
            + '&filter=' + params.filter
            + '&sort=' + params.sort
            + '&offset=' + params.offset
            + '&limit='  + params.limit
            if(params.category){
			url = url + '&category=' + params.category;	
			}
            var test = $http.get(url, { cache: true})
            .success(function(res){
                return res;
            });
            return test;
        }
    }
    return service;
}

