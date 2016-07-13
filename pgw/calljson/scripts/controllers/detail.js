'use strict';

angular.module('myApp.controllers')
        .controller('DetailController', function($scope, $rootScope) {
            $scope.data = {};
            var filterResults = $($rootScope.itemsData).filter(function() {
                return this.id.toString() == $rootScope.selectedItemId;
            });
            if (filterResults.length == 0) {
                setTimeout(function(){
                    f7MainView.goBack();
                }, 500);
                return;
            }
            $scope.data = filterResults[0];
            /*$scope.data = {
             "id": 511994302232911,
             "message_id": "511994302232911_650559568376383",
             "message": "#MondayMorningMuse\n\u201cA man cannot be comfortable without his own approval.\u201d\n\u201cThe two most important days in your life are the day you are born and the day you find out why.\u201d\n\u201cCourage is resistance to fear, mastery of fear -not absence of fear.\u201d\n-Mark Twain \n-Namaste\nwww.SimplicityRE.com",
             "pic": "https:\/\/fbcdn-sphotos-a-a.akamaihd.net\/\/hphotos-ak-xpa1\/\/",
             "sort_date": 1412043518,
             "date": "09\/29\/2014",
             "location": {
             "name": "Simplicity: A Real Estate Brokerage Company",
             "city": "Orlando",
             "lon": -81.368673,
             "lat": 28.543074,
             "cat": [
             {
             "id": "198327773511962",
             "name": "Real Estate"
             }
             ],
             "cover": "https:\/\/fbcdn-sphotos-a-a.akamaihd.net\/hphotos-ak-xfp1\/t31.0-8\/s720x720\/10428103_644355362330137_6301429902123071455_o.jpg"
             }
             };*/

            $('#detail_title').text($scope.data.location.city);
            f7App.resize();

            $scope.rate = function(score) {
                f7App.alert('You just rated ' + score);
            };
        });