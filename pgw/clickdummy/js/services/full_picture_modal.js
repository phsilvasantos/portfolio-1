'use strict';

angular.module('myApp.services')
        .factory('FullPictureModalService', function ($rootScope, $ionicModal) {
          var modal;
  
          // Create the login modal that we will use later
          $ionicModal.fromTemplateUrl('templates/full-picture-modal.html', {
            scope: $rootScope
          }).then(function (m) {
            modal = m;
          });

          var _service = {
            profile: null,
            picture: null,
            getModal: function () {
              return modal;
            },
            close: function(){
              modal.hide();
            },
            open: function(profile, picture, callback){
              this.profile = profile;
              this.picture = picture;
              this.callback = callback;
              modal.show();
            }
          };

          return _service;
        });
