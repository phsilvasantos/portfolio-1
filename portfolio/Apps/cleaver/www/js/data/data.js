angular
    .module('cleverbaby.data', ['ngResource'])
    .constant( 'firebaseConfig',{
        baseUrl: 'https://cleverbaby.firebaseio.com/'
    })
    .constant('dataConfig', {
        //baseUrl: 'http://192.168.56.1:3000',
        //baseUrl: 'http://localhost:3000',
        baseUrl: 'https://arcane-anchorage-7139.herokuapp.com',
		// baseUrl: 'http://cbaby.elasticbeanstalk.com',
        apiVersion: 'v1',
        googleId: '692197579389-1tr4luact0pjjce4r47egob64bgoac51.apps.googleusercontent.com',
        facebookId: '1575754259375108'
    }).factory('network', ['$http', 'dataConfig', '$localStorage', '$interval', '$cordovaFileTransfer',
        function($http, dataConfig, $localStorage, $interval, $cordovaFileTransfer){

            if(!$localStorage.queue) $localStorage.queue = [];

            var isSync = false;

            function makeUrl(url){
                return dataConfig.baseUrl + '/' + dataConfig.apiVersion + url;
            }

            function request(options, now){
                options.url = makeUrl(options.url);
                options.headers = {
                    authtoken: $localStorage.token
                };
                if(!now) {
                    if(angular.isUndefined($localStorage.queue))
                        $localStorage.queue = [];
                    $localStorage.queue.push(options);
                }
                else
                    return $http(options);
            }

            function sync(force){
                if(isSync && !force) return;
                isSync = true;
                var options = (angular.isArray($localStorage.queue) && $localStorage.queue.length >0 ) ? $localStorage.queue[0] : null;
                if(!options) {
                    isSync = false;
                    return;
                }
                var promise;
                if(options.type == 'upload'){
                    promise = $cordovaFileTransfer.upload(options.url, options.fileUrl, {
                        fileKey: 'media',
                        headers: options.headers,
                        params: {
                            uuid: options.uuid
                        }
                    })
                } else {
                    promise = $http(options);
                }
                return promise.then(function(response){
                    $localStorage.queue.shift();
                    return sync(true);
                }, function(err){
                    if(err.status == 0){
                        isSync = false;
                    } else {
                        return sync();
                    }
                });
            }

            $interval(function(){
                sync();
            }, 5000);

            return {
                request: request,
                makeUrl: makeUrl,
                get: function(options, now){
                    options.method = 'GET';
                    return request(options, now);
                },
                post: function(options, now){
                    options.method = 'POST';
                    return request(options, now);
                },
                put: function(options, now){
                    options.method = 'PUT';
                    return request(options, now);
                },
                remove: function(options, now){
                    options.method = 'DELETE';
                    return request(options, now);
                },
                upload: function(url, fileUrl, uuid){
                    return request({
                        url: url,
                        fileUrl: fileUrl,
                        type: 'upload',
                        uuid: uuid
                    })
                },
                sync: sync
            };
        }]);
