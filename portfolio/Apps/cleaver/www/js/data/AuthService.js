/**
 * Created by narek on 3/25/15.
 */
angular.module('cleverbaby.data')
    .factory('AuthService', ['$q', '$cordovaOauth', 'dataConfig', 'network', '$localStorage', 'BabyService',
        function ($q, $cordovaOauth, dataConfig, network, $localStorage, BabyService){

            var currentUser = null;
            var authService = {};

            authService.setup = function(){
                var deferred = $q.defer();
                if($localStorage.isLogged){
                    deferred.resolve(BabyService.getAllBabies());
                } else{
                    authService.signInAnonymously().then(function(x){
                        deferred.resolve(x);
                    }, function(){
                        deferred.reject();
                    });
                }
                return deferred.promise;
            };

            authService.signOut = function(){
                currentUser = null;
                return network.delete('/auth');
            };

            authService.signIn = function(credentials) {
                return network.post({
                    url: '/auth',
                    data: credentials
                }, true).then(function(response){
                    return setAuth(response.data);
                });
            };

            authService.signInViaEmail = function(credentials){
                credentials.provider = "email";
                return authService.signIn(credentials);
            };

            authService.signInViaOAuth = function(type, token){
                return authService.signIn({
                    token: token,
                    provider: type
                });
            };

            authService.signInAnonymously = function(){
                return authService.signIn({
                    provider: 'anonymous'
                });
            };
            authService.signUp = function(credentials){
                return  network.post({
                    url: '/users',
                    data: credentials
                }, true).then(function(response){
                    return setAuth(response.data);
                });
            };

            function setAuth(data){
                $localStorage.isLogged = true;
                $localStorage.token = data.token;
                currentUser = data.user;
                $localStorage.user = data.user;
                return BabyService.fetchBabies();
            }

            return {
                signOut: function(){
                    return authService.signOut();
                },
                signInViaEmail: function(email, password){
                    return authService.signInViaEmail({
                        email: email,
                        password: password
                    });
                },
                isLoggedIn: function(){
                    return currentUser != null;
                },
                createUser: function(name, email, password){
                    return authService.signUp({
                        name: name,
                        email: email,
                        password: password
                    });
                },
                signInViaOAuth: function(type){
                    if(type=='facebook'){
                        return $cordovaOauth
                            .facebook(dataConfig.facebookId, ['public_profile'])
                            .then(function(result){
                                 return authService.signInViaOAuth('facebook', result.access_token);
                            }
                        );
                    } else if(type == 'google'){
                        return $cordovaOauth
                            .google(dataConfig.googleId, ['profile'])
                            .then(function(result){
                                 return authService.signInViaOAuth('google', result.access_token);
                            }
                        );
                    }
                },
                signInAnonymously: function () {
                    return authService.signInAnonymously();
                },
                setup: function(){
                    return authService.setup();
                }
            };
        }
    ]);
