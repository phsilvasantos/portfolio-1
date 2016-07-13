var module = angular.module('gnApp.filesUploadingModule');

module.factory('fileUploader', function($ionicModal, Utils, remoteFile) {

  var r = {};

  r.fileForUploadReceived = function(file) { console.log('DEFINE ME') };
  r.callbackScope = null;
  r.modalOptions = {};

  r.initialize = function(scope, context, callbackOnFileReceived, options) {
    $ionicModal.fromTemplateUrl('templates/partials/photo-upload-modal.html', {
      scope: scope,
      animation: 'slide-in-up',
      controller: 'fileUploadModalController as fileUploadModal'
    }).then(function(modal) {
      scope.modal = modal;
    });

    if (options)
      this.modalOptions = options;

    this.callbackScope = context;
    this.fileForUploadReceived = callbackOnFileReceived;
  };

  r.shouldShowButton = function(name) {
    if (this.modalOptions[name] && this.modalOptions[name] == 'disabled')
      return false;

    if (name == 'google_drive' && !window.appSettings.googleClientId)
      return false;

    if (name == 'dropbox' && !window.appSettings.dropboxAppKey)
      return false;

    return true;
  }

  r.takePhoto = function() {
    var self = this;

    appStateManager.switchContext(function(context) {
      var cbSuccess = function(file) {
        context.switchBack();
        console.log(file);
        window.resolveLocalFileSystemURL(file, function(openedFile) {
          openedFile.file(function(fileEntry) {
            var result = {file: fileEntry, title: fileEntry.name, contentType: self.fileType(fileEntry)};
            r.resolveFile(result);
          }, function(error) { Utils.hideIndicator('filesUploader:chooseFile'); });
        }, function(error) { Utils.hideIndicator('filesUploader:chooseFile'); });
      };

      var cbError = function(error) {
        console.log(error);
        context.switchBack();
        Utils.hideIndicator('filesUploader:chooseFile');
      }

      console.log('Take Photo');
      navigator.camera.getPicture(cbSuccess, cbError, {sourceType: Camera.PictureSourceType.CAMERA, correctOrientation: true} );
    })

  };

  r.useExistingPhoto = function() {
    console.log('Use existing Photo');

    var self = this;

    appStateManager.switchContext(function(context) {
      var cbSuccess = function(file) {
        console.log(file);
        context.switchBack();
        window.resolveLocalFileSystemURL(file, function(openedFile) {
          openedFile.file(function(fileEntry) {
            if (fileEntry.name.indexOf('.') == -1) {
              var fileExtension = self.fileType(fileEntry).split('/')[1];
            }
            else {
              var parts = fileEntry.name.split('.');
              var fileExtension = parts[parts.length - 1];
            }

            fileEntry.name = new Date().getTime() + '.' + fileExtension;
            var result = {file: fileEntry, title: fileEntry.name, contentType: self.fileType(fileEntry)};
            r.resolveFile(result);
          }, function(error) { Utils.hideIndicator('filesUploader:chooseFile'); });
        }, function(error) { Utils.hideIndicator('filesUploader:chooseFile'); });
      };

      var cbError = function(error) {
        console.log(error);
        context.switchBack();
        Utils.hideIndicator('filesUploader:chooseFile');
      }

      navigator.camera.getPicture(cbSuccess, cbError, {sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
    });
  };

  r.uploadLinks = function(links, callback) {
    var promises = [];
    var files = [];

    var self = this;

    for (var i in links) {
      var url = links[i];

      if (!self.linkIsToRemoteFile(url)) {
        console.log('wont upload', url, ext, window.appSettings.googleDriveWhitelist)
        continue;
      }

      console.log('upload remote url', url);
      var parts = url.split('.');
      var ext   = parts[parts.length-1];
      var name = new Date().getTime() + '.' + ext;
      var promise = remoteFile.download(
        url,
        name,
        function(file) {
          var result = {file: file, title: file.name, contentType: self.fileType(file)};

          var localPromise = new Parse.Promise;
          r.resolveFile(result, function(data) {
            files.push(data);
            localPromise.resolve()
          });

          return localPromise;
        },
        function(err)  { }
      );

      promises.push(promise);
    }

    Parse.Promise.when(promises).then(function() { callback(files) });
  };

  r.linkIsToRemoteFile = function(url) {
    var parts = url.split('.');
    var ext   = parts[parts.length-1];

    return window.appSettings.googleDriveWhitelist.indexOf(ext) > -1;
  }

  r.resolveFile = function(fileData, callback) {
    if (!callback)
      callback = function() {};

    var self = this;
    var file = fileData.file;

    var awsOptions = {bucket: window.appSettings.s3Bucket, appFolder: window.appSettings.s3UserFilesPath}
    self.uploadToAmazon(file, awsOptions, function(fileURL) {
      console.log('FILE WAS SAVED TO S3', fileURL);
      var result = {fileUrl: fileURL, originalFile: fileData.file, name: fileData.title, contentType: fileData.contentType};

      if (self.shouldResizeFile(file)) {
        var adminPanelURL = window.appSettings.adminURL;
        var resizeAPIpath = 'api/v1/group_files.json';

        var url = adminPanelURL + resizeAPIpath;

        $.ajax({
           url: url,
           type: "POST",
           dataType: 'json',
           data: {file: {url: fileURL}},
           success: function(data) {
             console.log('file was resized', data);


             result.thumbUrl = data.thumb;
             r.fileForUploadReceived.call(r.callbackScope, result);
             Utils.hideIndicator('filesUploader:chooseFile');
             callback(result);
           },
           error: function(error) {
             Utils.hideIndicator('filesUploader:chooseFile');
             console.log('Error on file resize');
             callback(result);
           }
        });

      } else {
        if (self.isGif(file))
          result.thumbUrl = result.fileUrl;

        Utils.hideIndicator('filesUploader:chooseFile');
        r.fileForUploadReceived.call(r.callbackScope, result);
        callback(result);
      }
    })
  }

  r.shouldResizeFile = function(file) {
    var isPng = this.fileType(file).indexOf('png') > -1;
    var isJpg = this.fileType(file).indexOf('jpg') > -1 || this.fileType(file).indexOf('jpeg') > -1;

    return isPng || isJpg;
  }

  r.isGif = function(file) {
    return this.fileType(file).indexOf('gif');
  }

  r.fileType = function(file) {
    if (file.type)
      return file.type;

    var parts = file.name.split('.');
    var extension = parts[parts.length - 1].toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].indexOf(extension) > -1)
      return 'image/' + extension;

    return 'application/' + extension;
  }

  r.uploadToAmazon = function(file, options, callback) {
    var bucket      = options.bucket;
    var awsFilePath = options.appFolder + file.name;
    var s3URI       = encodeURI(this.s3Host(bucket));
    var imageURI    = file.localURL;

    console.log('before upload to s3', file);

    Parse.Cloud.run('generateAmazonPolicy', {bucket: bucket}).then(function(result) {
        console.log(result)
        var awsKey = result.key;

        options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = file.name;
        options.chunkedMode = false;
        options.params = {
            "key":            awsFilePath,
            "AWSAccessKeyId": awsKey,
            "acl":            "public-read",
            "policy":         result.policy,
            "signature":      result.signature,
            "Content-Type":   r.fileType(file)
        };

        ft = new FileTransfer(),
        ft.upload(imageURI, s3URI,
          function () {
            var fileURL = s3URI + awsFilePath;
            callback(fileURL);
          },
          function (e) {
            console.log('error', e);
          }, options);
    })
  }

  r.s3Host = function(bucket) {
    return "https://" + bucket + ".s3.amazonaws.com/";
  }

  return r;
});
