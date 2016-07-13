'use strict';

angular.module('gnApp.controllers')
        .controller('ProfileController', function ($scope, $stateParams, Utils, $location, $filter) {
          $scope.profile = {};
          $scope.user = {};
          $scope.profileVisibilities = {};
          $scope.isMyProfile = false;

          if (window.mixpanel) {
            window.mixpanel.track_links(".contact-methods a", "Contact Member", function (domElement) {
              return {
                "Contact Method": $(domElement).text(),
                "Member Contacted": $('.user-full-name').text()
              }; // bottom menu
            });
          }

          $scope.openURL = function (url) {
            if (url.substr(0, 4) != 'http')
              return;
            window.open(url, '_blank', 'location=no,EnableViewPortScale=yes');
          };
          
          $scope.editProfile = function(){
            $location.path('/edit-profile');
          };

          $scope.determineIfCanEditProfile = function () {
            $scope.$apply(function () {
              $scope.isMyProfile = ($scope.user.id == Parse.User.current().id);
            });
          };

          Utils.showIndicator();
          var query = new Parse.Query(Parse.Object.extend("Profile"));
          query.get($stateParams.id, {
            success: function (profile) {
              profile.get('user').fetch({
                success: function (user) {

                  if (window.mixpanel) {
                    window.mixpanel.track("View Profile", {
                      "Profile ID": profile.id,
                      "Profile User ID": user.id,
                      "Profile Name": user.get('firstName') + ' ' + user.get('lastName')
                    });
                  }

                  $scope.user = user;
                  $scope.determineIfCanEditProfile();
                  Parse.Cloud.run('groupsForUser', {id: user.id}, {
                    success: function (response) {
                      $scope.$apply(function () {
                        $scope.groups = response;
                        if ($scope.groups.length == 0)
                          $('.groups-displayer').remove();
                      });
                    },
                    error: function (error) {
                      Utils.alert('An error occurred while listing groups for this user.');
                    }
                  });
                  $scope.$apply(function () {
                    $scope.profile = profile;
                    $scope.profileVisibilities = profile.get('visibilities') || {};
                    $scope.user = user;
                    // $scope.profile.basicInfo = $scope.profile.get('sections')['Personal Info'];
                    // $scope.profile.professionalInfo = $scope.profile.get('sections')['Professional Info'];
                  });
                  Utils.hideIndicator();
                }
              });
              Utils.hideIndicator();
            },
            error: function (error) {
              console.log(error);
              Utils.alert('Profile you requested doesn\'t exist.', 'Error', function () {
                history.back();
              });
              Utils.hideIndicator();
            }
          });

          $scope.shouldShowSection = function (section, key, value) {
            if (key == 'Bio')
              return false;
            if (key == 'First Name')
              return false;
            if (key == 'Last Name')
              return false;

            if (value == '' || value == undefined || value == null) {
              return false;
            }

            if (!$scope.profileVisibilities[section] || !$scope.profileVisibilities[section][key]) {
              return false;
            }

            return true;
          };

          $scope.shouldShowSectionBlock = function (sectionKey, section) {
            for (var key in section) {
              if ($scope.shouldShowSection(sectionKey, key, section[key])) {
                return true;
              }
            }
            return false;
          };

          $scope.getFieldValue = function (fieldKey) {
            fieldKey = fieldKey.toLowerCase();
            var sections = {};
            if ($scope.profile.get) {
              sections = $scope.profile.get('sections');
            }
            for (var sectionKey in sections) {
              for (var fldKey in sections[sectionKey]) {
                if (fldKey.toLowerCase() == fieldKey) {
                  return sections[sectionKey][fldKey];
                }
              }
            }
            return '';
          };

          $scope.getDisplayValue = function (fieldKey, fieldValue) {
            fieldKey = fieldKey.toLowerCase();
            if (fieldValue) {
              if (fieldKey == 'website') {
                return '<a href="' + fieldValue + '" target="_blank" class="external">' + fieldValue + '</a>';
              }
              if (fieldKey.indexOf('phone')===0) {
                fieldValue = fieldValue.replace(/\D/g, '');
                fieldValue = '(' + fieldValue.substr(0, 3) + ') ' + fieldValue.substr(3, 3) + '-' + fieldValue.substr(6);
                fieldValue = '<i class="icon ion-ios7-telephone"></i>' + fieldValue;
                return fieldValue;
              }
              if (fieldKey == 'birthday' || fieldKey == 'birthdate') {
                return $filter('gnHideYear')(fieldValue);
              }
            }
            return fieldValue;
          };

          //download contact to device addressbook
          $scope.downloadProfile = function () {
            if (!navigator.contacts) {
              alert('This feature is available only on devices.');
              return;
            }

            var profile = $scope.profile;
            var personalSection = profile.get('sections')['Personal Info'];
            var user = profile.get('user');
            //var titleVal = profile.get('sections')['Professional Info']['Title'];
            //var companyVal = profile.get('sections')['Professional Info']['Company Name'];
            var fullName = user.get('firstName') + ' ' + user.get('lastName');
            var memberBio = '';
            var contactURLs = [];
            var phoneNumbers = [{type: 'mobile', value: user.get('username'), pref: true}];
            var birthday = null;
            try {
              memberBio = personalSection.Bio || '';
            } catch (exc) {
            }
            try {
              if (personalSection.Birthday) {
                birthday = new Date(personalSection.Birthday);
              }
            } catch (exc) {
            }
            var socialMediaSection = profile.get('sections')['Social Media'];
            if (socialMediaSection) {
              for (var name in socialMediaSection) {
                if ($scope.shouldShowSection('Social Media', name, socialMediaSection[name])) {
                  contactURLs.push({type: name, value: socialMediaSection[name]});
                }
              }
            }
            try {
              if (personalSection.Phone) {
                phoneNumbers.push({type: 'work', value: personalSection['Phone']});
              }
              if (personalSection['Phone (Other)']) {
                phoneNumbers.push({type: 'work', value: personalSection['Phone (Other)']});
              }
            } catch (exc) {
            }

            var contactName = new ContactName();
            contactName.givenName = user.get('firstName');
            contactName.familyName = user.get('lastName');

            var contactInfo = {
              //id: user.id,
              //displayName: fullName,
              name: contactName,
              note: memberBio,
              birthday: birthday,
              phoneNumbers: phoneNumbers,
              emails: [{type: 'work', value: user.get('email'), pref: true}],
              urls: contactURLs
            };
            if (profile.get('picture')) {
              contactInfo.photos = [{type: 'photo', value: profile.get('picture').url()}];
            }
            var contact = navigator.contacts.create(contactInfo);
            Utils.showIndicator();
            contact.save(function (newContact) {
              Utils.hideIndicator();
              Utils.alert('Member information has been stored into your addressbook.');
            }, function (contactError) {
              Utils.hideIndicator();
              alert("Error = " + contactError.code);
            });
          };
        });
