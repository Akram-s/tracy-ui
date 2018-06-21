var app = angular.module('tracy-ui');

app.factory('Storage', function storageFactory($localStorage, $sessionStorage, $rootScope) {

    var StorageApi = {};

    // PubSub (transient) storage
    StorageApi.transientStorage = {};
    StorageApi.setCapabilities = function(capabilities) {
        this.transientStorage.capabilities = capabilities;
        $rootScope.$broadcast('updatedCapabilities');
    }
    StorageApi.getCapabilities = function() {
        return StorageApi.transientStorage.capabilities;
    }

    StorageApi.setSelectedEnvironment = function(environment)  {
        this.transientStorage.selectedEnvironment = environment;
        $rootScope.$broadcast('updatedSelectedEnvironment');
    }
    StorageApi.getSelectedEnvironment = function()  {
        return this.transientStorage.selectedEnvironment;
    }

    StorageApi.getTaskServerUrl = function(application, task)  {
//        console.log(this.transientStorage.selectedEnvironment+":"+application+":"+task);
        return StorageApi.transientStorage.capabilities.environments
            [this.transientStorage.selectedEnvironment].applications[application].tasks[task].serverUrl;
    }
    
    StorageApi.getTaskServerComposerUrl = function(application, task)  {
//        console.log(this.transientStorage.selectedEnvironment+":"+application+":"+task);
        return StorageApi.transientStorage.capabilities.environments
            [this.transientStorage.selectedEnvironment].applications[application].tasks[task].composerServerUrl;
    }

    StorageApi.getApplicationServerUrl = function(application)  {
        return StorageApi.transientStorage.capabilities.environments
            [this.transientStorage.selectedEnvironment].applications[application].serverUrl;
    }

    StorageApi.setApplicationMenuItemContext = function(context)   {
        this.transientStorage.applicationMenuItemContext = context;
        $rootScope.$broadcast('updatedApplicationMenuItemContext');
    }
    StorageApi.getApplicationMenuItemContext = function()   {
        return this.transientStorage.applicationMenuItemContext;
    }

    // Persistent storage
    StorageApi.getRegistryUrl = function()  {
        var val;
        var storage = $localStorage;
        if (typeof($localStorage.registryConfig) == "undefined")   {
            // FIXME: Use ngstorage default feature
            val = "http://localhost:8080/tws/v1/registry";
        }
        else    {
            val = storage.registryConfig.url;
        }
        return(val);
    }

    StorageApi.isRegistryStatic = function()  {
        var val;
        var storage = $localStorage;
        if (typeof($localStorage.registryConfig) == "undefined")   {
            // FIXME: Use ngstorage default feature
            val = true;
        }
        else    {
            val = storage.registryConfig.static;
        }
        return(val);
    }

    StorageApi.getRegistryConfig = function()  {
        var val;
        if (typeof($localStorage.registryConfig) == "undefined")   {
            // FIXME: Use ngstorage default feature
            val = {url:"http://localhost:8080/tws/v1/registry",scheme:"http",host:"localhost",port:"8080",path:"/tws/v1/registry", static: true};
        }
        else    {
            val = $localStorage.registryConfig;
        }
        return(val);
    }

    StorageApi.setRegistryConfig = function(value)  {
        console.log("storing registryConfig " + JSON.stringify(value));
        $localStorage.registryConfig = value;
    }

    StorageApi.getRegistryData = function()  {
        // Default Registry data
        var registryData = {
          environments : [ {
            name : "Local",
            servers : [ {
              url : "http://localhost:8080/tws/v1"
            } ]
          } ]
        }
        if (typeof($localStorage.registryData) != "undefined")   {
            registryData = $localStorage.registryData;
        }
        console.log(registryData);
        return(registryData);
    }

    StorageApi.setRegistryData = function(value)  {
        console.log("storing registryData " + JSON.stringify(value));
        $localStorage.registryData = value;
    }

    StorageApi.persistSelectedEnvironment = function(environment)  {
//        console.log("persisting selectedEnvironment: " + JSON.stringify(environment));
        $sessionStorage.selectedEnvironment = environment;
    }

    StorageApi.recoverSelectedEnvironment = function()  {
        var recoveredEnvironment = $sessionStorage.selectedEnvironment;;
//        console.log("recovering selectedEnvironment: " + JSON.stringify(recoveredEnvironment));
        return recoveredEnvironment;
    }

    StorageApi.deleteSelectedEnvironment = function(environment)  {
//        console.log("deleting selectedEnvironment: " + JSON.stringify(recoveredEnvironment));
        delete $sessionStorage.selectedEnvironment;
    }

    return StorageApi;
});
