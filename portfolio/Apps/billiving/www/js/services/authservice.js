'use strict';
angular.module('myApp.services')
        .factory('AuthService', function($location, $window, $http, Base64, $q, $filter) {
          var user = {};
          function clearSession() {
            $window.localStorage.isLoggedIn = 0;
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('currentUser');
          }

          function initUser() {
            if ($window.localStorage.currentUser) {
              user = JSON.parse($window.localStorage.currentUser);
            } else {
              user = {};
            }
          }
          return {
            user: user,
            getUser: function() {
              return user;
            },
            isLoggedIn: function() {
              return $window.localStorage.isLoggedIn === '1';
            },
            getCurrentUser: function() {
              initUser();
              return user;
            },
            setAuthToken: function(username, password) {
              $window.localStorage.isLoggedIn = 1;
              $window.localStorage.token = Base64.encode(username + ':' + password);
              $window.localStorage.currentUser = $filter('json')({username: username, password: password});
            },
            getToken: function(){
              return $window.localStorage.token;
            },
            doLogout: function() {
              clearSession();
              $location.path('/login');
            }
          };
        })
        .factory('authInterceptor', function($q, $window, $location, AppConfig) {
          return {
            request: function(config) {
              config.headers = config.headers || {};
              if ($window.localStorage.token && config.url && config.url.indexOf(AppConfig.endpoint) === 0) {
                config.headers.Authorization = 'Basic ' + $window.localStorage.token;
                config.headers.withCredentials = 'true';
              }
              return config;
            },
            response: function(response) {
              if (response.status === 401) {
                $location.path('/login');
              }
              return response || $q.when(response);
            },
            responseError: function(response) {
              if (response.status === 401) {
                $location.path('/login');
              }
              return response || $q.when(response);
            }
          };
        })
        .config(function($httpProvider) {
          $httpProvider.interceptors.push('authInterceptor');
        });