var module = angular.module('gnApp.filesUploadingModule');

module.factory('remoteFile', function(Utils, FileTypeIcons) {

  var r = {};

  r.download = function(url, name, success, failure, options) {
    if (!options)
      options = {};

    var fileTransfer = new FileTransfer();
    console.log("Start transfer");
    var promise = new Parse.Promise();

    fileTransfer.download(encodeURI(url), cordova.file.dataDirectory + this.tmpFileName(name),
      function(fileEntry) {
        fileEntry.file(function(file) {
          console.log("Success!", file);
          var result = success(file);
          if (result && result.then != undefined) {
            result.then(function() { promise.resolve()});
          }
          else {
            promise.resolve();
          }
        })
      },
      function(err) {
        console.log("Error", err);
        failure(err);
      },
      true,
      options
    );

    return promise;
  }

  r.open = function(url) {
    if (device) {
      Utils.showIndicator('remoteFile:open');
      url = url.toLowerCase();
      // we use this plugin https://github.com/ti8mag/DocumentHandler
      if (url.indexOf('.html') > -1) {
        appStateManager.openUrl(url, '_blank', 'location=no,EnableViewPortScale=yes');
      }
      else {
        appStateManager.switchContext(function(context) {
          handleDocumentWithURL(
            function() { Utils.hideIndicator('remoteFile:open'); context.switchBack(); },
            function(error) {
              Utils.hideIndicator('remoteFile:open');
              context.switchBack();
              if(error == 53) {
                if (url.indexOf('.pdf') > -1) {
                  console.log('try to open pdf', url);
                  url = correctExternalURL(url);
                  appStateManager.openUrl(url, '_blank', 'location=no,EnableViewPortScale=yes');
                }
                else {
                  window.plugins.toast.showShortTop('No app that handles this file type.');
                }
              }
              else {
                window.plugins.toast.showShortTop('Error on file loading');
              }
            },
            url);
        }, this);

      }
    }
    else {
      alert('works only on real device');
    }
  }

  r.tmpFileName = function(name) {
    var parts = name.split('.');
    var extension = parts[parts.length - 1];

    return new Date().getTime() + '.' + extension;
  }

  r.getFileTypeClass = function (item) {
    var ext = '';
    var contentType = item.get('contentType');
    if (contentType) {
      var ary = contentType.split('/');
      ext = ary.length > 1 ? ary[ary.length - 1] : contentType;
      if (contentType === 'text/plain') {
        ext = 'txt';
      }
    }
    return FileTypeIcons[ext] ? 'flaticon-' + FileTypeIcons[ext] : 'svg-icon clip-white';
  };

  r.isPicture = function (item) {
    return item.get('contentType') && item.get('contentType').indexOf('image/') === 0;
  };

  return r;
});
