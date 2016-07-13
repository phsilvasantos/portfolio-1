var module = angular.module('gnApp.filesUploadingModule');

module.factory('googleDriveUploader', function(remoteFile) {

  var r = {};

  r.accessToken = null;
  r.refreshToken = null;
  r.files = [];
  r.callbackScope = null;
  r.retrievePageOfFilesBuffer = [];
  r.successCallback = function() { console.log('Please implement me') };
  r.failureCallback = function() { console.log('Please implement me') };

  r.getFiles = function(scope, success, failure, options) {
    var self = this;

    this.callbackScope   = scope;
    this.successCallback = success;
    this.failureCallback = failure;

    if (!options)
      options = {};

    self.checkIsTokenValid(
      function() {
        self.filesList(null, success);
      },
      function() {
        self.authenticateUser(function() {
          console.log('USER WAS AUTHENTICATED', scope, success);
          self.filesList(null, success);
        }, function(err) { failure.call(scope, err) });
      }
    )
  }

  r.checkIsTokenValid = function(success, failure) {
    var self = this;
    console.log('Start checking access token', this.getAccessToken());

    if (!this.getAccessToken())
      if (!this.getRefreshToken())
        return failure();
      else
        return self.refreshAccessToken(function() { success() }, function() { failure() });

    $.ajax({
       url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + this.getAccessToken(),
       type: "GET",
       success: function(data) {
         console.log('Token is Valid. Great!');
         success();
       },
       error: function(error) {
         console.log('Error on checking google token', error);
         self.refreshAccessToken(function() { success() }, function() { failure() })
       }
    });
  }

  r.refreshAccessToken = function(success, failure) {
    var self = this;

    var client_id =      window.appSettings.googleClientId;
    var client_secret =  window.appSettings.googleClientSecret;
    var refresh_token = this.getRefreshToken();

    console.log('Try to refresh access token', client_id, client_secret, refresh_token);

    if (!refresh_token)
      return failure();

    url = 'https://www.googleapis.com/oauth2/v3/token?refresh_token=' + refresh_token + '&client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=refresh_token';

    $.ajax({
       url: url,
       type: "POST",
       dataType: 'json',
       success: function(data) {
         self.storeAccessToken(data.access_token);
         console.log('refreshAccessToken success', data.access_token)
         success();
       },
       error: function(error) {
         console.log('Error on refresh success token', error);
         failure();
       }
    });
  }

  r.storeRefreshToken = function(refreshToken) {
    this.refreshToken = refreshToken;
    window.localStorage['googleDriveRefreshToken'] = refreshToken;
  }

  r.getRefreshToken = function() {
    return this.refreshToken || this.getValueFromLocalStorage('googleDriveRefreshToken');
  }

  r.storeAccessToken = function(accessToken) {
    this.accessToken = accessToken;
    window.localStorage['googleDriveAccessToken'] = accessToken;
  }

  r.getAccessToken = function() {
    return this.accessToken || this.getValueFromLocalStorage('googleDriveAccessToken');
  }

  r.getValueFromLocalStorage = function(key) {
    return window.localStorage[key] == 'undefined' || window.localStorage[key] == 'null' ? undefined : window.localStorage[key]
  }

  r.authenticateUser = function(success, failure) {
    var self = this;

    var clientId = window.appSettings.googleClientId;
    var clientSecret = window.appSettings.googleClientSecret;
    var scopes = 'https://www.googleapis.com/auth/drive';
    var redirect_uri = "http://localhost/callback";
    var isAuthenticated = false;

    var browserRef = appStateManager.openUrl('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=' + redirect_uri + '&scope=' + scopes + '&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
    browserRef.addEventListener("loadstart", function(event) {
      if((event.url).indexOf(redirect_uri) === 0) {
          var parameterMap = r.parseURLParams(event.url);
          console.log('parameterMap', parameterMap);
          failure.call();
          if(parameterMap.code !== undefined && parameterMap.code !== null) {
              var code = parameterMap.code;

              if (code[code.length - 1] == '#')
                code = code.slice(0, - 1);

              self.retrieveAccessToken(code, clientId, clientSecret, redirect_uri, function(data) {
                if (!data)
                  return failure.call();

                console.log('received access token', data);

                self.storeAccessToken(data.access_token);
                self.storeRefreshToken(data.refresh_token);
                isAuthenticated = true;
                success.call();
              });
          } else {
              console.log("Problem authenticating");
              failure.call();
          }
          browserRef.close();
      }
   });

   browserRef.addEventListener("loaderror", function(event) {
     failure.call();
   });

   browserRef.addEventListener("exit", function(event) {
     if (!isAuthenticated)
       failure.call();
   });
  }

  r.retrieveAccessToken = function(code, client_id, client_secret, redirect_uri, callback) {
    var url = 'https://www.googleapis.com/oauth2/v3/token?code=' + code + '&client_id=' + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirect_uri + '&grant_type=authorization_code';

    $.ajax({
       url: url,
       type: "POST",
       dataType: 'json',
       success: function(data) {
         callback(data);
       },
       error: function(error) {
         console.log('Error ', error);
         callback(null);
       }
    });
  }

  r.isFolder = function(file) {
    return file.mimeType == "application/vnd.google-apps.folder"
  }

  r.filesList = function(folder, callback) {
    var self = this;

    if (!folder)
      folder = 'root';
    else
      folder = folder.id;

    self.retrievePageOfFilesBuffer = [];
    self.retrieveAllFiles(folder, function(data) {
      callback.call(self.callbackScope, self.processResponse(data).sort(self.sortByFolderFn));
    });
  }

  r.search = function(query, callback) {
    var self = this;

    self.retrievePageOfFilesBuffer = [];
    var q = "title contains '" + query +  "'";
    self.retrievePageOfFiles(q, null, 0, function(data) {
      callback(self.processResponse(data).sort(self.sortByFolderFn));
    }, function(error) {
      self.failureCallback.call(self.callbackScope, error);
      console.log('error on file search');
    });
  }

  r.sortByFolderFn = function(a, b) {
    if (r.isFolder(a) && !r.isFolder(b))
      return -1;
    if (r.isFolder(b) && !r.isFolder(a))
      return 1;
    return 0;
  }

  r.fileIsInWhiteList = function(file) {
    if (this.isFolder(file))
      return true;

    if (window.appSettings.googleDriveWhitelist && file.fileExtension && window.appSettings.googleDriveWhitelist.indexOf(file.fileExtension) > -1)
      return true;

    if (file.mimeType.indexOf('document') > -1 || file.mimeType.indexOf('spreadsheet') > -1 )
      return true;

    if (!file.originalFilename)
      return false;

    return false;
  }

  r.processResponse = function(sourceFiles) {
    var self = this;

    var files = [];

    var isFileHidden = function(file) { return file.labels.hidden || file.labels.trashed || file.labels.restricted }

    for (var i in sourceFiles) {
      try {
        var file = sourceFiles[i];

        if (!isFileHidden(file) && self.fileIsInWhiteList(file)) {
          files.push(file);
        }
      } catch(err) {
        console.log('File can not be processed', file, err.message);
      }
    }

    return files;
  }

  r.retrieveAllFiles = function (folder, callback) {
    var self = this;

    var q = "'" + folder +  "' in parents"
    self.retrievePageOfFiles(q, null, 0, function(data) {
      callback(data);
    }, function(error) {
      self.failureCallback.call(self.callbackScope, error);
    });
  }

  r.retrievePageOfFiles = function(q, pageToken, retriesCount, success, failure) {
    var self = this;

    var nextPageToken = null;
    var perPage = 200;

    console.log('retrievePageOfFiles', pageToken);
    if (pageToken)
      var url = self.listUrl({q: q, pageToken: pageToken, maxResults: perPage})
    else
      var url = self.listUrl({q: q, maxResults: perPage});

    $.ajax({
       url: url,
       type: "GET",
       success: function(data, status, xhr) {
         self.retrievePageOfFilesBuffer = self.retrievePageOfFilesBuffer.concat(data.items);
         nextPageToken = data.nextPageToken;

         if (nextPageToken) {
           self.retrievePageOfFiles(q, nextPageToken, retriesCount, success, failure);
         }
         else {
           console.log('FILES ARE FETCHED', self.retrievePageOfFilesBuffer);
           success(self.retrievePageOfFilesBuffer);
         }
       },
       error: function(error) {
         console.log('error', error)
         if (error.status == 401 || (retriesCount && retriesCount > 5)) {
           failure(error);
         }
         else {
           setTimeout(function() {
             self.retrievePageOfFiles(q, nextPageToken, retriesCount + 1, success, failure);
           }, 500);
         }
       }
    });
  }

  r.fileTitle = function(file) {
    return file.title;
  }

  r.fileContentType = function(file) {
    return file.mimeType;
  }

  r.downloadFile = function(file, scope, success, failure) {
    var self = this;

    this.checkIsTokenValid(
      function() {
        var url = self.downloadUrl(file);

        if (file.originalFilename)
          var name = file.originalFilename;
        else
          var name = file.title + '.' + r.parseURLParams(url).exportFormat;

        remoteFile.download(
          url,
          name,
          function(file) { success.call(scope, file); },
          function(err)  { failure.call(scope, err); },
          {headers: {'Authorization': 'Bearer ' + self.getAccessToken()}}
        );
      },
      function() {
        self.authenticateUser(function() {
          failure.call(scope, err)
        }, function(err) { failure.call(scope, err) });
      }
    )
  }

  r.downloadUrl = function(file) {
    var url = '';

    if (file.downloadUrl)
      url = file.downloadUrl;
    else if (file.exportLinks) {
      for (format in file.exportLinks) {
        if (format.indexOf("openxmlformats") > -1) {
          url = file.exportLinks[format];
          break;
        }
      }
    }

    return url + '&access_token=' + this.getAccessToken();
  }

  r.listUrl = function(options) {
    if (!options) options = {}
    var params = '';

    for (var key in options) {
      params += '&' + key + '=' + options[key];
    }

    var url = 'https://www.googleapis.com/drive/v2/files?corpus=default&access_token=' + this.getAccessToken() + params;

    return encodeURI(url);
  }

  r.parseURLParams = function(url, delimeter) {
    if (!delimeter) {
      delimeter = "?";
    }

    var responseParameters = url.split(delimeter)[1].split("&");
    var parameterMap = [];
    for(var i = 0; i < responseParameters.length; i++) {
      parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
    }

    return parameterMap;
  }


  return r;
});
