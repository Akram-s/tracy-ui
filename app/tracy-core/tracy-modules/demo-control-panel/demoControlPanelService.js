angular
    .module('tracy-ui')
    .factory('demoControlPanelService', demoControlPanelService);

demoControlPanelService.$inject = ['$http', 'Storage'];
function demoControlPanelService($http, Storage)  {
    var data = JSON.stringify({
      "application": "demo-live",
      "task": "hello-tracy-sim",
      "definingFilter": "component:\"hello-tracy\" AND label:\"serviceEndpoint\"",
      "measurement": {
        "span": 150000,
        "snap": 10000,
        "lag": 0,
        "rttTolerating": 200,
        "rttFrustrated": 800,
        "rttUnit": "ms"
      }
    });

    var service = {
        setTaskConfig: function() {
            var application = "demo-live";
            var task = "hello-tracy-sim"
            var url = Storage.getTaskServerUrl(application, task)
            + '/applications/' + application
            + '/tasks/' + task
            + '/config'
            var test = $http.post(url, data)
            .success(function(res){
                return res;
            });
            return test;
        },

        setDemo: function(state) {
            var application = "demo-live";
            var task = "hello-tracy-sim"
            var demoState = JSON.stringify({"demo": state});
            var url = Storage.getTaskServerUrl(application, task)
            + '/demo'
            var test = $http.post(url, demoState)
            .success(function(res){
                return res;
            });
            return test;
        },

        getDemo: function(state) {
            var application = "demo-live";
            var task = "hello-tracy-sim"
            var url = Storage.getTaskServerUrl(application, task)
            + '/demo'
            var test = $http.get(url)
            .success(function(res){
                return res;
            });
            return test;
        },

        deleteTracy: function() {
            var application = "demo-live";
            var task = "hello-tracy-sim"
            var url = Storage.getTaskServerUrl(application, task)
            + '/tracy'
            var test = $http.delete(url)
            .success(function(res){
                return res;
            });
            return test;
        }
    }
    return service;
}

