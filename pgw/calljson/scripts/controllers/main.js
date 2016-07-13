'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('myApp.controllers', [])
        .controller('MainController', function($http, $scope, $rootScope, getItemsURL) {
            $rootScope.itemsData = [];
            
            $scope.loadItems = function(){
                f7App.showIndicator();
                var promise = $http({
                    method: 'GET',
                    url: getItemsURL + '?a=1&b=2&c=4&d=5'
                });
                promise.success(function(data){
                    f7App.hideIndicator();
                    $rootScope.itemsData = data;
                }).error(function(){
                    f7App.hideIndicator();
                });
            };
            
            $scope.onSelectItem = function(itemId){
                $rootScope.selectedItemId = itemId;
            }
            
            $scope.loadItems();
        });