organizate.service('HelperService', function ($q, $rootScope, LocalStorageService, HttpService) {

    this.getAllTeams = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getAllTeams?userid=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.userIdCheck = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "userIdCheck?userid=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getAllTeamsIN = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getAllTeamsIN?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.cancelGame = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("cancelGame", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getAllMessageStatus = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getAllMessageStatus?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    
    this.checkGameLineUp = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "checkGameLineUp?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getTeamById = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getTeamById?teamid=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getGameFromID = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getGameFromID?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getMessageFromID = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getMessageFromID?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getAllGames = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getAllGames?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getAllYourGames = function (prams) {
        var deferred = $q.defer();
        var userId = $rootScope.loginUserId;
        var endpointAction = "getAllYourGames?id=" + prams + "&userid=" + userId;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };


    this.createNewTeam = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        console.log(prams);
        HttpService.PostRequest("createNewTeam", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.updateGameInfo = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("updateGameInfo", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.changeMessageStatus = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("changeMessageStatus", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.updateTeamInfo = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("updateTeamInfo", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.createNewGame = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("createNewGame", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getRosterUser = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getRosterUser?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getRosterAdmin = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getRosterAdmin?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getRosterMessageUser = function (prams) {
        var deferred = $q.defer();
        HttpService.PostRequest("getRosterMessageUser", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getAllRosters = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getAllRosters?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getRosterInfo = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getRosterInfo?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getUserInfo = function (prams) {
        var deferred = $q.defer();
        prams.userid = $rootScope.loginUserId;
        HttpService.PostRequest("getUserInfo", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.updateRoster = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("updateRoster", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.updateUserInfo = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("updateUserInfo", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.addTeamMember = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("addTeamMember", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.createConatactRoster = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("createConatactRoster", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getRosterInfoFromUserId = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("getRosterInfoFromUserId", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getInningUserFromGameID = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getInningUserFromGameID?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.addTeamMemberInvite = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("addTeamMemberInvite", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.updateRosterPositions = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("updateRosterPositions", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.sendSpecificMessage = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("sendSpecificMessage", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.updateGameMemvbers = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("updateGameMemvbers", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getRosterUserFromGameID = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getRosterUserFromGameID?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.getTeamMemberById = function (prams) {
        var deferred = $q.defer();
        var endpointAction = "getTeamMemberById?id=" + prams;
        HttpService.getRequest(endpointAction).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.deleteRoster = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("deleteRoster", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    this.createGameRoster = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("createGameRoster", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.createScratchRoster = function (prams) {
        var deferred = $q.defer();
        prams.changeuserid = $rootScope.loginUserId;
        HttpService.PostRequest("createScratchRoster", prams).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };
    this.getSeclectedGameIndex = function () {
        LocalStorageService.getGameInfo().then(function (gameinfo) {
            $rootScope.selectedGameIndex = gameinfo;
        });
    };
    this.getSeclectedTeamIndex = function () {
        LocalStorageService.getTeamInfo().then(function (teaminfo) {
            $rootScope.selectedIndex = teaminfo;
        });
    };

    this.getLoginUserId = function () {
        LocalStorageService.getUserinfo().then(function (userinfo) {
            $rootScope.loginUserId = userinfo;
        });
    };

    this.convertImgToBase64 = function (url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/*');
            callback.call(this, dataURL);
            // Clean up
            canvas = null;
        };
        img.src = url;
    };

    this.getSeclectedGameIndex();
    this.getSeclectedTeamIndex();
    this.getLoginUserId();
});