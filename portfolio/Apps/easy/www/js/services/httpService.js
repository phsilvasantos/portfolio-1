organizate.service('HttpService', function($q, $http, $rootScope, $templateCache, AppConfig, Utils) {
//organizate.service('HttpService', function($q, $http, $rootScope, $templateCache,$cordovaVibration) {
    this.getRequest = function(endpoint) {
        Utils.showIndicator();
//        $cordovaVibration.vibrate(100);
        var deferred = $q.defer();
        $http.get(AppConfig.backendurl + endpoint).
        success(function(data, status, headers, config) {
            Utils.hideIndicator();
            if (data.isReg) deferred.resolve(data.result);
            else deferred.resolve(false);
            
        }).
        error(function(data, status, headers, config) {
            Utils.hideIndicator();
            deferred.resolve(data.result);
        });
        return deferred.promise;
    };

    this.PostRequest = function(endpoint, prams) {
        Utils.showIndicator();
        var deferred = $q.defer();
//        $cordovaVibration.vibrate(100);
        $http({url: AppConfig.backendurl + endpoint,
            method: 'POST',
            data: $.param(prams),
            cache: $templateCache,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function(response) {
            Utils.hideIndicator();
            var result = response.data;
            if (result.isReg)
                deferred.resolve(result.result);
            else
                deferred.resolve(false);
        });
        return deferred.promise;
    };

});