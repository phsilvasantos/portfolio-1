organizate.factory('gpsService', function($q, $rootScope, $state, $compile, $http) {
    return {
        getGPSPosition: function() {
            var geo_options = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            };
            navigator.geolocation.watchPosition(function(pos) {
                $rootScope.positiondata = {'latitude': pos.coords.latitude, 'longitude': pos.coords.longitude};
                $rootScope.myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                console.log('myLatlng', $rootScope.myLatlng);
            }, function(error) {
//                alert('Unable to get location: ' + error.message);
            }, geo_options);
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $rootScope.positiondata.latitude + ',' + $rootScope.positiondata.longitude + '&sensor=true')
                    .success(function(response) {
                        if (response.status == "OK") {
                            $rootScope.location_name = response.results[0].formatted_address;
                        }
                    });
        },
        getAddressFromLatLong: function(latitude, longitude) {
            var deferred = $q.defer();
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true')
                    .success(function(response) {
                        if (response.status == "OK") {
                            var returnStr = response.results[0].formatted_address;
                            if (returnStr.length > 40)
                                returnStr = returnStr.substr(0, 35) + "...";
                            deferred.resolve(returnStr);
                        }
                    });
            return deferred.promise;
        },
        displayPositionMap: function() {
            $rootScope.myLatlng = new google.maps.LatLng($rootScope.positiondata.latitude, $rootScope.positiondata.longitude);

            if ($rootScope.marker)
                $rootScope.marker.setMap(null);
            $rootScope.marker = new google.maps.Marker({
                position: $rootScope.myLatlng,
                map: $rootScope.map,
                icon: 'img/safemarker.png',
                title: 'Uluru (Ayers Rock)'
            });
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($rootScope);
            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });
            $rootScope.map.setCenter($rootScope.myLatlng);
            google.maps.event.addListener($rootScope.marker, 'click', function() {
//                $rootScope.findMe();
                $rootScope.markerstate = true;
//                infowindow.open($rootScope.map, $rootScope.marker);
            });
        }
    }
});