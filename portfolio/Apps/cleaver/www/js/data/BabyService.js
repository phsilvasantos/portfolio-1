angular.module('cleverbaby.data')
    .factory('BabyService', ['network', '$q', 'ActivityService', '$localStorage', '$window', '$cordovaFile', '$sce',
        function(network, $q, ActivityService, $localStorage, $window, $cordovaFile, $sce) {

        function generetaeUniqueKey(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        function generateUniqueId(id){
            return id + '-' + new Date().getTime() + '-' + generetaeUniqueKey();
        }

        function handleFile(baby){
            return $q(function(resolve, reject){
                if(baby.imageType == 'new'){
                    $window.resolveLocalFileSystemURL(baby.displayImage, function(fileEntry){
                        $window.resolveLocalFileSystemURL(cordova.file.dataDirectory+'/babies', function(dirEntry){
                            fileEntry.moveTo(dirEntry, baby.uuid, function(newFileEntry){
                                baby.displayImage = $sce.trustAsResourceUrl(newFileEntry.nativeURL) + '?'+Math.random();
                                delete baby.imageType;
                                try{
                                    network.upload('/babies/'+ baby.uuid + '/media', newFileEntry.nativeURL, generateUniqueId($localStorage.user.id));
                                } catch(e){
                                }
                                resolve(baby);
                            }, function(err){
                                reject(err);
                            });

                        }, function(err){
                            reject(err);
                        });
                    }, function(err){
                        reject(err);
                    });
                } else{
                    resolve();
                }
            });
        }

        function downloadImage(baby){
            return $cordovaFile.then(function(){
                var destintion = cordova.file.dataDirectory+'/babies'+baby.uuid;
                return $cordovaFileTransfer.download(
                    network.makeUrl('/babies/'+baby.uuid+'/media'),
                    destintion, {
                        authtoken: $localStorage.token
                    }, true).then(function(){
                        return destintion;
                    }, function(err){
                        console.log(err);
                    });
            });
        }

        function fetchBaby(baby){
            return ActivityService.setActivities(baby.uuid, baby.activities).then(function(){
                delete baby.activities;
                if(!baby.media){
                    $localStorage.babies[baby.uuid] = baby;
                    return baby;
                }
                return downloadImage(baby).then(function(path){
                    baby.displayImage = path;
                    $localStorage.babies[baby.uuid] = baby;
                    return baby;
                });
            });
        }

        return {
            getAllBabiesFromServer: function(include){
                return network.get({
                    url: '/babies',
                    params: {
                        include: include
                    }
                }, true).then(function(response){
                    return response.data;
                });
            },
            fetchBabies: function(){
                return this.getAllBabiesFromServer('activities').then(function(babies){

                    $localStorage.babies = {};
                    var promises = babies.map(fetchBaby);

                    if(typeof cordova != "undefined"){
                        promises.unshift($cordovaFile.createDir(cordova.file.dataDirectory, "babies", true));
                        promises.unshift($cordovaFile.createDir(cordova.file.dataDirectory, "activities", true));
                    }
                    return $q.all(promises).then(function(){
                        return babies;
                    });
                });
            },
            getAllBabies: function () {
                return $localStorage.babies;
            },
            newBaby: function(data) {
                return {
                }
            },
            add: function(data){ 
                return $q(function(resolve, reject){
                    data.createdAt = new Date();
                    data.uuid = generateUniqueId($localStorage.user.id);
                    network.post({
                        url: '/babies',
                        data: data
                    });
                    $q.all([
                        handleFile(data),
                        ActivityService.setActivities(data.uuid, [])
                    ]).then(function(){
                        $localStorage.babies[data.uuid] = data;
                        resolve(data);
                    }, function(){
                        reject();
                    });
                });

            },
            edit: function(data){
                return $q(function(resolve, reject){
                    network.put({
                        url: '/babies/' + data.uuid,
                        data: data
                    });
                    handleFile(data).then(function(){
                        $localStorage.babies[data.uuid] = data;
                        resolve(data);
                    })
                });
            },
            inviteData: function(uuid, type){
                return network.get({
                    url: '/babies/'+uuid+'/share'
                }, true).then(function(response){
                    return {
                        name: response.data.name,
                        birthday: response.data.birthday,
                        admin: response.data.adminPin,
                        read: response.data.readPin,
                        write: response.data.writePin
                    }
                });
            },
            acceptPin: function(pin, name, birthday){
                return network.post({
                    url: '/babies/view',
                    data: {
                        pin: pin,
                        name: name,
                        birthday: birthday
                    }
                }, true).then(function(response){
                    return response.data;
                }).then(function(baby){
                    return fetchBaby(baby);
                })
            },
            getUsersList: function(babyId){
                return network.get({
                    url: '/babies/'+babyId+'/users'
                }, true);
            },
            deleteUserFromBaby: function(babyId, userId){
                return network.remove({
                    url: '/babies/'+babyId+'/users/'+userId
                }, true);
            }
        };
    }]);
