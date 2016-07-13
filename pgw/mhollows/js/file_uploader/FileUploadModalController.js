'use strict';

var module = angular.module('gnApp.filesUploadingModule');

module.controller('fileUploadModalController', function ($scope, $ionicModal, fileUploader, googleDriveUploader, dropboxUploader, Utils) {
  this.files = [];
  this.screen = 'navigation';
  this.currentFolder = null;
  this.searchQuery = '';
  this.currentUploader  = null;

  var self = this;

  this.setScreen = function(screen) {
    this.searchQuery = '';
    this.screen = screen;
  };

  this.isCurrentScreen = function() {
    for(var i=0; i<arguments.length; i++)
      if (arguments[i] == this.screen)
        return true;

    return false;
  };

  this.shouldShowButton = function(name) {
    return fileUploader.shouldShowButton(name);
  };

  this.showModal = function() {
    console.log('SHOW MODAL');
    $scope.modal.show();
  };

  this.hideModal = function() {
    console.log('HIDE MODAL');
    this.setScreen('navigation');
    $scope.modal.hide();
  };

  this.takePhoto = function() {
    fileUploader.takePhoto();
    Utils.showIndicator('filesUploader:chooseFile');
    this.hideModal();
  };

  this.useExistingPhoto = function() {
    console.log('Use existing Photo');
    Utils.showIndicator('filesUploader:chooseFile');
    fileUploader.useExistingPhoto();
    this.hideModal();
  };

  this.useGoogleDrive = function() {
    console.log('Use Google Drive');
    this.useCloudStorage('google_drive');
  }

  this.useDropbox = function() {
    console.log('Use Dropbox');
    this.useCloudStorage('dropbox');
  }

  this.useCloudStorage = function(name) {
    Utils.showIndicator('fileUploader:fetchCloudFiles');
    if (name == 'google_drive')
      this.currentUploader = googleDriveUploader;
    if (name == 'dropbox')
      this.currentUploader = dropboxUploader;

    this.currentFolder   = null;

    this.currentUploader.getFiles(this,
      function(files) {
        self.files = files;
        Utils.hideIndicator('fileUploader:fetchCloudFiles');
        self.setScreen(name);
      },
      function(err) {
        Utils.hideIndicator('fileUploader:fetchCloudFiles');
        self.setScreen('navigation');
      }
    );
  }

  this.isFolder = function(file) {
    if (this.currentUploader)
      return this.currentUploader.isFolder(file);

    return false;
  };

  this.select = function(isfolder, item) {
    if(isfolder) this.openFolder(item);
    else this.chooseFile(item)
  }

  this.openFolder = function(folder) {
    var self = this;

    this.currentFolder = folder;
    if (this.screen == 'dropbox')
      Utils.showIndicator('fileUploader:dropbox:fetchFiles');

    this.currentUploader.filesList(folder, function(files) {
      Utils.hideIndicator('fileUploader:dropbox:fetchFiles');
      self.files = files;
    });
  }

  this.search = function() {
    var self = this;


    if (this.searchQuery.length && this.searchQuery.length >= 2) {
      Utils.showIndicator('fileUploader:searchFiles');
      this.currentUploader.search(this.searchQuery, function(files) {
        Utils.hideIndicator('fileUploader:searchFiles');
        self.files = files;
      });
    }
    else if (this.searchQuery.length == 0) {
      Utils.showIndicator('fileUploader:searchFiles');
      this.currentUploader.filesList(this.currentFolder, function(files) {
        Utils.hideIndicator('fileUploader:searchFiles');
        self.files = files;
      });
    }
  }

  this.chooseFile = function(file) {
    console.log('chooseFile', file.id);

    Utils.showIndicator('filesUploader:chooseFile');

    var self = this;

    this.hideModal();

    this.currentUploader.downloadFile(file, this,
      function(fileEntry) {
          console.log("Success!", fileEntry);
          var result = {file: fileEntry, title: this.currentUploader.fileTitle(file), contentType: this.currentUploader.fileContentType(file)};

          fileUploader.resolveFile(result);
      },
      function(err) {
          Utils.hideIndicator('filesUploader:chooseFile');
          self.useCloudStorage(self.screen);
          console.log("Error", err);
      }
    );
  }

  this.pullToRefresh = function() {
    this.currentUploader.filesList(this.currentFolder, function(files) {
      self.files = files;
      $scope.$broadcast('scroll.refreshComplete');
    }, function() { $scope.$broadcast('scroll.refreshComplete'); });
  }
});
