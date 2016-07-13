organizate.factory('LocalStorageService', function($q, $rootScope) {
    return {
        getUserPass: function() {
            var userinfo = "";
            if (localStorage.getItem('userpass_')) userinfo = localStorage.getItem('userpass_');
            return userinfo;
        },
        setUserPass: function(userinfo) {
            if(userinfo)localStorage.setItem('userpass_', userinfo);
        },
        getUserEmail: function() {
            var userinfo = "";
            if (localStorage.getItem('useremail_')) userinfo = localStorage.getItem('useremail_');
            return userinfo;
        },
        setUserEmail: function(userinfo) {
            if(userinfo)localStorage.setItem('useremail_', userinfo);
        },
        getUserinfo: function() {
            var deferred = $q.defer();
            var userinfo = "";
            if (localStorage.getItem('userid_')) userinfo = localStorage.getItem('userid_');
            deferred.resolve(userinfo);
            return deferred.promise;
        },
        setUserinfo: function(userinfo) {
            if(userinfo)localStorage.setItem('userid_', userinfo);
        },
        getTeamInfo: function() {
            var deferred = $q.defer();
            var TempArr = [];
            if (localStorage.getItem("teaminfo_"))
                TempArr = JSON.parse(localStorage.getItem("teaminfo_"));
            $rootScope.teaminfo = TempArr;
            deferred.resolve($rootScope.teaminfo);
            return deferred.promise;
        },
        setTeamInfo: function(teaminfo) {
            var tempString = JSON.stringify(teaminfo);
            localStorage.setItem("teaminfo_", tempString);
        },
        getGameInfo: function() {
            var deferred = $q.defer();
            var TempArr = [];
            if (localStorage.getItem("gameinfo_"))
                TempArr = JSON.parse(localStorage.getItem("gameinfo_"));
            $rootScope.gameinfo = TempArr;
            deferred.resolve($rootScope.gameinfo);
            return deferred.promise;
        },
        setGameInfo: function(gameinfo) {
            var tempString = JSON.stringify(gameinfo);
            localStorage.setItem("gameinfo_", tempString);
        },
        DeleteAll: function() {
            localStorage.clear();
        }
    }
});