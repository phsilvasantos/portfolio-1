var module = angular.module('gnApp.filesUploadingModule');

module.factory('dropboxUploader', function(Utils, remoteFile) {

  var r = {};

  r.accessToken = null;
  r.callbackScope = null;
  r.successCallback = function() { console.log('Please implement me') };
  r.failureCallback = function() { console.log('Please implement me') };

  r.getFiles = function(scope, success, failure) {
    var self = this;

    this.callbackScope   = scope;
    this.successCallback = success;
    this.failureCallback = failure;

    if (this.getAccessToken()) {
      self.checkIsTokenValid(
        function() {
          self.filesList(null, success);
        },
        function() {
          self.authenticateUser(function() {
            self.filesList(null, success);
          }, function(err) { failure.call(scope, err) });
        }
      )
    }
    else {
      this.authenticateUser(function() {
        console.log('USER WAS AUTHENTICATED', scope, success);
        self.filesList(null, success);
      }, function(err) { failure.call(scope, err) });
    }
  }

  r.authenticateUser = function(success, failure) {
    var self = this;

    var clientId        = window.appSettings.dropboxAppKey;
    var scopes          = 'https://www.dropbox.com/1/oauth2';
    var redirect_uri    = "http://localhost/callback";
    var isAuthenticated = false;

    var browserRef = appStateManager.openUrl(scopes + "/authorize?client_id=" + clientId + "&redirect_uri=" + redirect_uri + "&response_type=token", "_blank", "location=no");
    browserRef.addEventListener("loadstart", function(event) {
        if((event.url).indexOf(redirect_uri) === 0) {
            var callbackResponse = (event.url).split("#")[1];
            var responseParameters = (callbackResponse).split("&");
            var parameterMap = [];
            for(var i = 0; i < responseParameters.length; i++) {
                parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
            }
            if(parameterMap["access_token"] !== undefined && parameterMap["access_token"] !== null) {
                self.storeAccessToken(parameterMap.access_token);
                isAuthenticated = true;
                success.call();
            } else {
                console.log("There was a problem authorizing");
                failure.call();
            }
            browserRef.close();
        }
    });

   browserRef.addEventListener("loaderror", function(event) {
     browserRef.close();
     failure.call();
   });

   browserRef.addEventListener("exit", function(event) {
     if (!isAuthenticated)
       failure.call();
   });
  }

  r.storeAccessToken = function(accessToken) {
    this.accessToken = accessToken;
    window.localStorage['dropboxAccessToken'] = accessToken;
  }

  r.getAccessToken = function() {
    return this.accessToken || this.getValueFromLocalStorage('dropboxAccessToken');
  }

  r.getValueFromLocalStorage = function(key) {
    return window.localStorage[key] == 'undefined' || window.localStorage[key] == 'null' ? undefined : window.localStorage[key]
  }

  r.checkIsTokenValid = function(success, failure) {
    var url = 'https://api.dropbox.com/1/metadata/auto?access_token=' + this.getAccessToken();

    $.ajax({
       url: url,
       type: "GET",
       dataType: 'json',
       success: success,
       error: function(error) {
          if (error.status == 401)
            failure();
          else
            console.log('Error on checking dropbox token');
       }
    });
  }

  r.isFolder = function(file) {
    return file.is_dir;
  }

  r.fileIsInWhiteList = function(file) {
    if (this.isFolder(file))
      return true;

    var parts = this.fileName(file).split('.');
    var extension = parts[parts.length - 1];

    if (window.appSettings.googleDriveWhitelist && extension && window.appSettings.dropboxWhitelist.indexOf(extension) > -1)
      return true;

    return false;
  }

  r.downloadFile = function(file, scope, success, failure) {
    remoteFile.download(
      this.downloadUrl(file),
      this.fileName(file),
      function(file) { success.call(scope, file); },
      function(err)  { failure.call(scope, err); }
    );
  }

  r.downloadUrl = function(file) {
    var url = 'https://api-content.dropbox.com/1/files/auto' + file.path;

    return url + '?access_token=' + this.getAccessToken();
  }

  r.fileName = function(file) {
    var splittedPath = file.path.split('/');

    return splittedPath[splittedPath.length - 1];
  }

  r.fileTitle = function(file) {
    return this.fileName(file);
  }

  r.fileContentType = function(file) {
    return file.mime_type;
  }

  r.sortByFolderFn = function(a, b) {
    if (r.isFolder(a) && !r.isFolder(b))
      return -1;
    if (r.isFolder(b) && !r.isFolder(a))
      return 1;
    return 0;
  }

  r.filesList = function(folder, callback) {
    var self = this;

    if (!folder)
      var path = '';
    else
      var path = folder.path;

    var url = "https://api.dropbox.com/1/metadata/auto" + path + "?access_token=" + this.getAccessToken();

    self.get(url, function(data, status, xhr) {
      callback.call(self.callbackScope, self.processResponse(data.contents));
    });
  }

  r.search = function(query, callback) {
    var self = this;

    var url = "https://api.dropbox.com/1/search/auto?access_token=" + this.getAccessToken() + "&query=" + query;

    self.get(url, function(data, status, xhr) {
      callback.call(self.callbackScope, self.processResponse(data));
    });
  }

  r.processResponse = function(data) {
    var files = [];

    for (var i in data) {
      var file = data[i];

      if (this.fileIsInWhiteList(file)) {
        file.iconLink = '';
        file.title = this.fileName(file);

        files.push(file);
      }
    }

    return files.sort(this.sortByFolderFn);
  }

  r.get = function(url, success, error) {
    var self = this;

    if (!error) {
      error = function(xhr, text, error) {
        Utils.hideIndicator();
        self.failureCallback.call(self.callbackScope, error);
      }
    }

    $.ajax({
       url: url,
       type: "GET",
       dataType: 'json',
       success: success,
       error: error
    });
  }

  return r;
});
