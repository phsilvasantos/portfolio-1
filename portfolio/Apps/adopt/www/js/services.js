angular.module('wpIonic.services', ['ngIOS9UIWebViewPatch'])

        /**
         * A simple example service that returns some data.
         */
        .factory('DataLoader', function ($http) {

          return {
            all: function (url) {
              return $http.jsonp(url);
            },
            get: function (url) {
              // Simple index lookup
              return $http.jsonp(url);
            }
          }

        })
        /**
         * A Utilities service that required on this project essentially.
         */
        .factory('Utils', function ($q, $ionicLoading, $ionicPopup, $http, $rootScope) {
          var UtilsSrv = {
            config: null,
            organizationName: 'Adopt a Pet',
            endpointUrl: 'http://www.adoptapet.ie',
            dogsTerm: {Location: [], Breed: [], Gender: [], Size: []},
            catsTerm: {Location: [], Gender: []},
            othersTerm: {Location: [], Type: []},
            dogTotal: 0,
            catTotal: 0,
            othersTotal: 0,
            settingData: {},
            showIndicator: function () {
              window.iL = $ionicLoading;
              $ionicLoading.show({
                template: '<span class="preloader preloader-white"></span>'
              });
            },
            hideIndicator: function () {
              $ionicLoading.hide();
            },
            alert: function (msg, title, callback) {
              title = title || UtilsSrv.organizationName;
              var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
              });
              if (callback) {
                alertPopup.then(function (res) {
                  callback();
                });
              }
            },
            confirm: function (msg, title, success, cancel) {
              var confirmPopup = $ionicPopup.confirm({
                title: title || UtilsSrv.organizationName,
                template: msg
              });
              confirmPopup.then(function (res) {
                if (res) {
                  if (success)
                    success();
                } else {
                  if (cancel)
                    cancel();
                }
              });
            },
            correctImageDataURI: function (dataURI) {
              //if mime type is not defined(specifically on samsung galaxy)
              if (/data:;?base64,/.test(dataURI)) {
                dataURI = dataURI.replace(/data:;?base64,/, 'data:image/jpeg;base64,');
              }
              return dataURI;
            },
            detectDevice: function (deviceType) {
              //Return boolean value according to deviceType
              var deviceInfo = window.navigator.userAgent;
              if (deviceInfo.toLowerCase().indexOf(deviceType) >= 0)
                return true
              else
                return false;
            },
            //Get Terms of dogs from server and stored in UtilsSrv
            loadDogsTerms: function (facets, pet) {
              // Load locations of dogs
              var deferred = $q.defer();
              var newObj = {};
              for (var key in facets) {
                var newkey = key.replace('_', '-');
                newObj[newkey] = facets[key];
              }
              var prams = {
                action: 'facetwp_refresh',
                data: {
                  facets: JSON.stringify(newObj),
                  static_facet: '',
                  http_params: {uri: pet},
                  template: pet,
                  extras: {'pager': true, 'sort': 'default'},
                  soft_refresh: 0,
                  first_load: 1,
                  paged: 1
                }
              }
              $ionicLoading.show();
              $http({url: 'http://www.adoptapet.ie/wp-admin/admin-ajax.php',
                method: 'POST',
                data: $.param(prams),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
              }).then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                deferred.resolve(response.data)
              }, function (err) {
                $ionicLoading.hide();
                console.log(err);
                deferred.reject(err)
              });
              return deferred.promise;
            },
            //Get Terms of dogs data by UtilsSrv.dogsTerm
            getDogsTerms: function () {
              return UtilsSrv.dogsTerm;
            },
            //Get Terms of cats from server and stored in UtilsSrv
            loadCatsTerms: function () {
              // Load locations of cats
              $http.get(UtilsSrv.endpointUrl + '/wp-json/taxonomies/locationcats/terms').
                      success(function (data, status, headers, config) {
                        if (!$.isEmptyObject(data) && status == 200) {
                          UtilsSrv.catsTerm.Location = data;
                          UtilsSrv.catTotal = UtilsSrv.setTotalValue(data);
                        }
                      }).
                      error(function (data, status, headers, config) {

                      });
              // Load genders of cats
              $http.get(UtilsSrv.endpointUrl + '/wp-json/taxonomies/gendercats/terms').
                      success(function (data, status, headers, config) {
                        if (!$.isEmptyObject(data) && status == 200) {
                          UtilsSrv.catsTerm.Gender = data;
                        }
                      }).
                      error(function (data, status, headers, config) {

                      });
            },
            //Get Terms of cats data by UtilsSrv.catsTerm
            getCatsTerms: function () {
              return UtilsSrv.catsTerm;
            },
            //Get Terms of other pets from server and stored in UtilsSrv
            loadOthersTerms: function () {
              // Load locations of other pets
              UtilsSrv.showIndicator();
              $http.get(UtilsSrv.endpointUrl + '/wp-json/taxonomies/locationothers/terms').
                      success(function (data, status, headers, config) {
                        UtilsSrv.hideIndicator();
                        if (!$.isEmptyObject(data) && status == 200) {
                          UtilsSrv.othersTerm.Location = data;
                          UtilsSrv.othersTotal = UtilsSrv.setTotalValue(data);
                        }
                      }).
                      error(function (data, status, headers, config) {
                        UtilsSrv.hideIndicator();
                      });
              // Load pet type of other pets
              $http.get(UtilsSrv.endpointUrl + '/wp-json/taxonomies/otherpetstype/terms').
                      success(function (data, status, headers, config) {
                        if (!$.isEmptyObject(data) && status == 200) {
                          UtilsSrv.othersTerm.Type = data;
                        }
                      }).
                      error(function (data, status, headers, config) {

                      });
            },
            //Get Terms of other pets data by UtilsSrv.othersTerm
            getOthersTerms: function () {
              return UtilsSrv.othersTerm;
            },
            //Hide refine button
            hideRefineBtn: function () {
              $('.refine-button').hide();
              $('.right-menu').hide();
            },
            //Show refine button
            showRefineBtn: function () {
              $('.refine-button').show();
              $('.right-menu').show();
            },
            //Set count of pets
            setTotalValue: function (data) {
              var total = 0;
              if (data.length) {
                for (var i = 0; i < data.length; i++)
                  total = total + data[i].count;
              }
              return total;
            },
            //Load UtilsSrv variables.
            initialize: function () {
//                    UtilsSrv.loadDogsTerms();
//                    UtilsSrv.loadCatsTerms();
//                    UtilsSrv.loadOthersTerms();
            }
          };

          return UtilsSrv;
        })
        /**
         * A SocialSharing service.
         */
        .factory('SocialShare', function ($http, $cordovaSocialSharing) {
          return {
            facebookSharing: function (message, image, link) {
              window.plugins.socialsharing.shareViaFacebook(
                      'Optional message, may be ignored by Facebook app',
                      ['https://www.google.nl/images/srpr/logo4w.png', 'www/image.gif'],
                      null);
            },
            twitterSharing: function (url) {
              // Simple index lookup
              return $http.jsonp(url);
            }
          }
        });
