var app = angular.module('tracy-ui');
// see https://docs.angularjs.org/guide/providers
app.factory('Registry', ['$resource', 'Storage',
    function registryFactory($resource, Storage) {
        return $resource(Storage.getRegistryUrl(), {}, {
            get: {method: 'GET', cache: false, isArray: false}
        });
}])


app.factory('HttpRegistry', ['$http', '$q', function($http, $q) {
return {
    get: function(url) {
        var deferred =  $q.defer();
        $http.get(url).then(
            function(response) {
                //console.log("response good");
                deferred.resolve(response)
            },
            function(response) {
                //console.log("response bad");
                deferred.reject(response)
            })
        return deferred.promise;
    }
};
}])

app.factory('testFactory', function testFactory() {
  return 'myTestFactory!';
});

