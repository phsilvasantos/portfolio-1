var domain = "http://www.finder-lbs.com";
// var domain = "http://192.168.1.32:8888";

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
        }

angular.module('services',['ngResource','ngCordova',])

// .factory('ContactManager', ['$resource','$rootScope', '$cordovaContacts',
//   function($resource, $rootScope, $cordovaContacts){
//         return {
//             getContacts: function(name) {
//                 console.log("Entering Filter");
//                 var options = {};
//                 options.filter = name;
//                 options.multiple = false;
//                 //get the phone contacts
//                 // var contacts = $cordovaContacts.find(options); 
//                 // console.log("Number of Contacts"+contacts.length);
//                 return $cordovaContacts.find(options);
//             }
//         }
// }])
.factory('ContactManager', ["$resource","$rootScope","$http", "$q", function($resource,$rootScope, $http, $q) {
    this.getContactStatus = function() {
        return this.contacts_data;
    };
    this.query = function(accessToken,startIndex,number_of_results,query_data) {
        var deferred = $q.defer();
        var call = "";
        console.log("Query String in Service is:"+query_data);
        if (query_data=="") {call = "https://www.google.com/m8/feeds/contacts/"+window.localStorage["gmailEmail"]+"/full?alt=json&max-results="+number_of_results+"&oauth_token="+accessToken+"&start-index="+startIndex;}
        else {call = "https://www.google.com/m8/feeds/contacts/"+window.localStorage["gmailEmail"]+"/full?alt=json"+"&q="+query_data+"&max-results="+number_of_results+"&oauth_token="+accessToken+"&start-index="+startIndex;}    
        console.log(call);
        return $http.get(call).then(function(result){
            var contacts_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(contacts_data);

            return deferred.promise;
        });
        
    };
    return this;
}])

.factory("MobileInviteUsers", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getInviteStatus = function() {
        return this.invitations_data;
    };
    this.query = function(name,email,logged_in,invite_user) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/user/invite?email="+email+"&name="+name+"&logged_in="+logged_in+"&invited_emails="+invite_user).then(function(result){
            var invitations_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(invitations_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory("AddLocEvent", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getEventStatus = function() {
        return this.event_data;
    };
    this.set = function(name,email,logged_in,event_type,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/event/add?email="+email+"&name="+name+"&logged_in="+logged_in+"&event_type="+event_type+"&lat="+lat+"&lon="+lon).then(function(result){
            var event_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(event_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("AddLocation", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getEventStatus = function() {
        return this.loc_data;
    };
    this.set = function(name,email,logged_in,locname,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/location/add?email="+email+"&name="+name+"&logged_in="+logged_in+"&locname="+locname+"&lat="+lat+"&lon="+lon).then(function(result){
            var loc_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(loc_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory('MobileAsset', ['$resource','$rootScope',
  function($resource, $rootScope){
      return $resource(domain+'/app/assets/list', {}, {
            query: {method:'GET', params:{_xsrf:getCookie("_xsrf")}, isArray:true}
            //query: {method:'GET', isArray:true}
        });
}])

.factory("ShareStatus", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetStatus = function() {
        return this.assets_data;
    };
    this.query = function(device_number,name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/assets/sharestatus?device_number="+device_number+"&email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var assets_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(assets_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory("Organization", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getOrganization = function() {
        return this.org_data;
    };
    this.query = function(name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/organization?email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var org_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(org_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("Plan", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getPlan = function() {
        return this.plans_data;
    };
    this.query = function() {
        var deferred = $q.defer();
        return $http.get(domain+"/app/plans").then(function(result){
            var plans_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(plans_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("GetMobileAsset", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.assets_data;
    };
    this.query = function(asset_id,name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/assets/detailsbyid?asset_id="+asset_id+"&email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var assets_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(assets_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("GetMobileSharedAsset", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.assets_data;
    };
    this.query = function(asset_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/assets/sharedetailsbyid?asset_id="+asset_id).then(function(result){
            var assets_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(assets_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("MobileEventList", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.event_data;
    };
    this.query = function(name,email,logged_in,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/event/list?email="+email+"&name="+name+"&logged_in="+logged_in+"&lat="+lat+"&lon="+lon).then(function(result){
            var event_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(event_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("MobileSavedLocationList", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getLocationsData = function() {
        return this.saved_data;
    };
    this.query = function(name,email,logged_in,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/saved_location/list?email="+email+"&name="+name+"&logged_in="+logged_in+"&lat="+lat+"&lon="+lon).then(function(result){
            var saved_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(saved_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("MobileMessage", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/messages/list?email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory("MobilePublicMessage", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/messages/publiclist?email="+email+"&name="+name+"&logged_in="+logged_in+"&lat="+lat+"&lon="+lon).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory("MobilePrivateMessage", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,lat,lon,asset_id,asset_name) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/messages/privatelist?email="+email+"&name="+name+"&logged_in="+logged_in+"&lat="+lat+"&lon="+lon+"&asset_id="+asset_id+"&asset_name="+asset_name).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("MobileMessageDetail", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,message_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/messages/detail?email="+email+"&name="+name+"&logged_in="+logged_in+"&message_id="+message_id).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory('MobileMessageList', ['$resource','$rootScope',
  function($resource, $rootScope){
      return $resource(domain+'/app/messages/list', {}, {
            query: {method:'GET', params:{_xsrf:getCookie("_xsrf")}, isArray:true}
            //query: {method:'GET1', isArray:true}
        });
}])

// .factory('MobileGetMyInvitations', ['$resource','$rootScope',
//   function($resource, $rootScope){
//       return $resource(domain+'/app/user/invitations', {}, {
//             query: {method:'GET', params:{_xsrf:getCookie("_xsrf")}, isArray:true}
//             //query: {method:'GET', isArray:true}
//         });
// }])
.factory("MobileGetMyInvitations", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getInvitationsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/user/invitations?email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("AssetRouteData", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.assets_data;
    };
    this.query = function(name,email,logged_in,tf,tt,asset_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/assets/lastdata?email="+email+"&name="+name+"&logged_in="+logged_in+"&tf="+tf+"&tt="+tt+"&asset_id="+asset_id).then(function(result){
            var assets_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(assets_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory('MessageForAsset', ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getMessageData = function() {
        return this.message_data;
    };
    this.query = function(tf,tt,asset_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/messages/forasset?tf="+tf+"&tt="+tt+"&asset_id="+asset_id).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory("MobileShareList", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/shares/list?email="+email+"&name="+name+"&logged_in="+logged_in+"&lat="+lat+"&lon="+lon).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("UserListInOrg", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,asset_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/listinorg?email="+email+"&name="+name+"&logged_in="+logged_in+"&asset_id="+asset_id).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    this.queryall = function(name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/listinorg?email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("UserListOrg", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/listinorg?email="+email+"&name="+name+"&logged_in="+logged_in+"&asset_id="+asset_id).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("CheckIfUserIsPaid", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getResponseData = function() {
        return this.message_data;
    };
    this.queryforuser = function(name,email,logged_in) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/checkifpaid?email="+email+"&name="+name+"&logged_in="+logged_in).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    this.queryforasset = function(name,email,logged_in,asset_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/checkifassetpaid?email="+email+"&name="+name+"&logged_in="+logged_in+"&asset_id="+asset_id).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory('GetNotice', ['$rootScope','$http','$q',
 function($rootScope, $http, $q) {
    this.getResponseData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,notice_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/notice/get?email="+email+"&name="+name+"&logged_in="+logged_in+"&notice_id="+notice_id).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("UserShareAsset", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,asset_id,umail,checked) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/shareasset?email="+email+"&name="+name+"&logged_in="+logged_in+"&asset_id="+asset_id+"&umail="+umail+"&checked="+checked).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("UserAdminPermission", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,umail,checked) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/users/adminpermission?email="+email+"&name="+name+"&logged_in="+logged_in+"&umail="+umail+"&checked="+checked).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])
.factory("MobileTrafficList", ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getAssetsData = function() {
        return this.message_data;
    };
    this.query = function(name,email,logged_in,lat,lon) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/traffic/list?email="+email+"&name="+name+"&logged_in="+logged_in+"&lat="+lat+"&lon="+lon).then(function(result){
            var message_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(message_data);

            return deferred.promise;
        });
    };
    return this;
}])

.factory('GeofenceForAsset', ["$rootScope","$http", "$q", function($rootScope, $http, $q) {
    this.getGeofenceData = function() {
        return this.geofence_data;
    };
    this.query = function(asset_id) {
        var deferred = $q.defer();
        return $http.get(domain+"/app/geofences/forasset?asset_id="+asset_id).then(function(result){
            var geofence_data = result.data;
            //$rootScope.$broadcast("Assets.fetchedRouteData", assets);
            deferred.resolve(geofence_data);

            return deferred.promise;
        });
    };
    return this;
}])

// finderServices.factory('GoogleShorten', ['$resource','$rootScope',
//   function($resource, $rootScope){
//     return $resource('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDyCKyyEYoi_kWvJDY_gYbJA2RpINY2HXI', null, {
//       query: {method:'POST'}
//     });
//   }]);
.factory('RequestMigration', ['$resource','$rootScope','$cookies',
  function($resource, $rootScope, $cookies){
    return $resource(domain+"/app/requestmigration", {},
    {
        'query': { method:'GET'}
    });
  }])

.factory('GoogleShorten', ['$resource','$rootScope','$cookies',
  function($resource, $rootScope, $cookies){
    return $resource('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDyCKyyEYoi_kWvJDY_gYbJA2RpINY2HXI', null,
    {
        'query': { method:'POST' }
    });
  }])

.factory('TempLink', ['$resource','$rootScope','$cookies',
  function($resource, $rootScope, $cookies){
    return $resource(domain+"/app/templink", {},
    {
        'query': { method:'GET'}
    });
  }])
.factory('GetTempLink', ['$resource','$rootScope','$cookies',
  function($resource, $rootScope, $cookies){
    return $resource(domain+"/app/templink/get", {},
    {
        'query': { method:'GET'}
    });
  }])

.factory('GetNominatimOSM', ['$resource','$rootScope','$cookies',
  function($resource, $rootScope, $cookies){
    return $resource("http://nominatim.openstreetmap.org/reverse", {},
    {
        'query': { method:'GET'}
    });
  }])
.factory('GetDevicePlans', ['$resource','$rootScope','$cookies',
  function($resource, $rootScope, $cookies){
    return $resource(domain+"/app/deviceplans/get", {},
    {
        'query': { method:'GET'}
    });
  }]);