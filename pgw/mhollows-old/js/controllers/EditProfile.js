'use strict';

angular.module('gnApp.controllers')
        .controller('EditProfileController', function ($scope, Utils, $location, $ionicModal) {
          $scope.data = {};
  
          $scope.user = Parse.User.current();

          if (Parse.User.current() == null) {
            Utils.alert('You must be logged in to edit your profile.', null, function () {
              Parse.User.logOut();
              $location.loadPage('/login');
              return;
            });
            Utils.hideIndicator();
          }

          if (window.mixpanel) {
            window.mixpanel.track("Edit Profile");
          }

          Parse.User.current().get('profile').fetch({
            success: function (userProfile) {
              var ProfileTemplate = Parse.Object.extend('ProfileTemplate');
              var query = new Parse.Query(ProfileTemplate);
              query.find({
                success: function (template) {
                  template = template[0];

                  $scope.$apply(function () {

                    $scope.profileSections = userProfile.get('sections');
                    $scope.visibilities = userProfile.get('visibilities') || {};
                    $scope.profile = userProfile;

                    var templateSections = template.get('sections');

                    for (var tplSection in templateSections) {
                      if (templateSections.hasOwnProperty(tplSection)) {
                        $scope.profileSections[tplSection] = $scope.profileSections[tplSection] || {};
                        for (var i = 0; i < templateSections[tplSection].length; i++) {
                          var key = templateSections[tplSection][i];
                          $scope.profileSections[tplSection][key] = $scope.profileSections[tplSection][key] || '';
                        }
                      }
                    }

                    $scope.profileSections['Social Media'] = jQuery.extend(
                            {Facebook: '', Linkedin: '', Twitter: '', 'Google Plus': ''},
                    $scope.profileSections['Social Media']
                            );

                  });
                }
              });
            },
            error: function () {
              Utils.alert('Unable to fetch your profile.', 'Error', f7MainView.goBack);
              Utils.hideIndicator();
            }
          });

          $scope.returnToProfile = function () {
            Utils.hideIndicator();
            $location.path('/profile/' + $scope.profile.id);
          };

          function dataURItoBlob(dataURI) {
            var BASE64_MARKER = ';base64,';
            if (dataURI.indexOf(BASE64_MARKER) == -1) {
              var parts = dataURI.split(',');
              var contentType = parts[0].split(':')[1];
              var raw = decodeURIComponent(parts[1]);

              return new Blob([raw], {type: contentType});
            }

            var parts = dataURI.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
              uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], {type: contentType});
          }

          $scope.uploadProfilePhoto = function (base64Data) {
            var file = dataURItoBlob(base64Data);
            if (file) {
              Utils.showIndicator();

              $.canvasResize(file, {
                width: 640,
                height: 480,
                quality: 100,
                callback: function (data, width, height) {
                  // var dataAsBlob = $.canvasResize('dataURLtoBlob', data);
                  // var createdFile = new File(dataAsBlob,file.name,{ type: file.type });

                  var parseFile = new Parse.File('profilephoto.png', {base64: data});

                  parseFile.save().then(
                          function () {
                            Utils.hideIndicator();
                            if (window.mixpanel) {
                              window.mixpanel.track("Upload Photo", {"Photo URL": parseFile.url()});
                            }
                            $scope.$apply(function () {
                              $scope.profile.set('picture', parseFile);
                              $scope.photocropperModal.hide();
                            });
                            //generate thumbnail image
                            Parse.Cloud.run('generateThumbImage', {
                              imageUrl: parseFile.url(),
                              width: 250,
                              height: 250
                            }, function(response){
                              $scope.profile.set('thumbImage', response);
                            });
                          },
                          function (error) {
                            Utils.hideIndicator();
                            Utils.alert('Unable to save photo.', 'Error');
                          }
                  );
                }
              });


              // parseFile.save().then(
              //   function () {
              //     console.log("SAVED...!");
              //
              //     Utils.hideIndicator();
              //     $scope.$apply(function () {
              //       $scope.profile.set('picture', parseFile);
              //     });
              //     $scope.photocropperModal.hide();
              //   },
              //   function (error) {
              //     console.log("OMG FAILED")
              //     Utils.hideIndicator();
              //     Utils.alert('Unable to save photo.', 'Gen-Next');
              //   }
              // );
            } else {
              Utils.alert('No new profile photo to save.', 'Gen-Next');
            }
          };

          $scope.saveChanges = function () {
            if (window.mixpanel) {
              window.mixpanel.track("Save Profile", {
                "Sections": $scope.profileSections,
                "Visibilities": $scope.visibilities
              });
            }

            Utils.showIndicator();
            $scope.profile.save({
              sections: $scope.profileSections,
              visibilities: $scope.visibilities
            }, {
              success: $scope.returnToProfile,
              error: function () {
                Utils.hideIndicator();
                Utils.alert('There was an error trying to save your profile.', 'Gen-Next');
              }
            });
          };

          /* === photo cropper modal === */
          $scope.photocropperModal = null;
          $ionicModal.fromTemplateUrl('photocropper-modal-html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            $scope.photocropperModal = modal;
          });
          $scope.$on('modal.shown', function () {
            $('#image-cropper').cropit();
            if($scope.profile.get('picture')){
              //$('#image-cropper').cropit('imageSrc', $scope.profile.get('picture').url());
            }
          });
          $scope.finishEditPhoto = function () {
            var imageData = $('#image-cropper').cropit('export');
            if(imageData){
              $scope.uploadProfilePhoto(Utils.correctImageDataURI(imageData));
            }else{
              $scope.photocropperModal.hide();
            }
          };

          /* === bioedit modal === */
          $scope.bioeditModal = null;
          $scope.data.bioeditText = '';
          $ionicModal.fromTemplateUrl('bioedit-modal-html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            $scope.bioeditModal = modal;
          });

          $scope.openBioEdit = function () {
            $scope.data.bioeditText = $scope.profileSections['Personal Info']['Bio'].replace(/<br>/gi, '\r\n');
            $scope.bioeditModal.show();
            $('.modal-bioedit textarea').height($('.modal-bioedit').height() - 10)
                    .css('padding-top', ($('.modal-bioedit .bar-header').outerHeight() + 5) + 'px');
          };

          $scope.doneBioEdit = function () {
            $scope.profileSections['Personal Info']['Bio'] = $.trim($scope.data.bioeditText)
                    .replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
            $scope.bioeditModal.hide();
          };

          $scope.$on('$destroy', function () {
            $scope.bioeditModal.remove();
            $scope.photocropperModal.remove();
          });

          $scope.connectSocial = function (key) {
            key = key.toLowerCase();
            if (key == 'facebook') {
              $scope.connectFacebook();
            } else if (key == 'linkedin') {
              $scope.connectLinkedin();
            }
          };

          $scope.connectFacebook = function () {
            openFB.login(
                    function (response) {
                      if (response.status === 'connected') {
                        openFB.api({
                          path: '/me',
                          success: function (response) {
                            $scope.$apply(function () {
                              if (response.first_name) {
                                $scope.profileSections['Personal Info']['First Name'] = response.first_name;
                              }
                              if (response.last_name) {
                                $scope.profileSections['Personal Info']['Last Name'] = response.last_name;
                              }
                              if (response.birthday) {
                                var ary = response.birthday.split(/\//g);
                                $scope.profileSections['Personal Info']['Birthday'] = ary[2] + '-' + ary[0] + '-' + ary[1];
                              }
                              if (response.location && response.location.name) {
                                $scope.profileSections['Personal Info']['Location'] = response.location.name;
                              }
                              if (response.bio) {
                                $scope.profileSections['Personal Info']['Bio'] = response.bio;
                              }
                              if (response.email) {
                                $scope.profileSections['Personal Info']['Email'] = response.email;
                              }
                              if (response.link) {
                                $scope.profileSections['Social Media']['Facebook'] = response.link;
                              }
                            });
                            Utils.alert('Some profile information has been imported from your facebook account.');
                          },
                          error: function (error) {
                            alert(error.message);
                          }
                        });
                      }
                    }, {scope: 'public_profile,email,user_about_me,user_birthday,user_location'});
          };

          $scope.connectLinkedin = function () {
            IN.User.authorize();
          };

          function __fillWithZerio(ival) {
            if (ival < 10)
              ival = '0' + ival;
            return ival;
          }

          /*IN.Event.on(IN, 'auth', function () {
           IN.API.Profile("me")
           .fields([
           'id', 'firstName', 'lastName', 'pictureUrl', 'headline', 'publicProfileUrl',
           'emailAddress', 'location', 'dateOfBirth'
           ])
           .result(function (response) {
           var linuser = response.values[0];
           console.log(response);
           $scope.$apply(function () {
           if (linuser.firstName) {
           $scope.profileSections['Personal Info']['First Name'] = linuser.firstName;
           }
           if (linuser.last_name) {
           $scope.profileSections['Personal Info']['Last Name'] = linuser.lastName;
           }
           if (linuser.dateOfBirth) {
           $scope.profileSections['Personal Info']['Birthday'] = linuser.dateOfBirth.year + '-'
           + __fillWithZerio(linuser.dateOfBirth.month) + '-' + __fillWithZerio(linuser.dateOfBirth.day);
           }
           if (linuser.location && linuser.location.name) {
           $scope.profileSections['Personal Info']['Location'] = linuser.location.name;
           }
           if (linuser.emailAddress) {
           $scope.profileSections['Personal Info']['Email'] = linuser.emailAddress;
           }
           if (linuser.publicProfileUrl) {
           $scope.profileSections['Social Media']['Linkedin'] = linuser.publicProfileUrl;
           }
           });
           Utils.alert('Some profile information has been imported from your linkedin account.');
           });
           });*/

        });