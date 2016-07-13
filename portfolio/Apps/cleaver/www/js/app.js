// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cleverbaby', [
    'ionic',
    'pascalprecht.translate',
    'cleverbaby.controllers',
    'cleverbaby.directives',
    'angular-svg-round-progress',
    'cleverbaby.data',
    'cleverbaby.services',
    'cleverbaby.helpers',
    'ngCordova',
    'timer',
    'ngStorage',
    'ui.calendar',
    'nvd3'
]).run(function ($ionicPlatform, $rootScope, AuthService, $timeout, $ionicModal, $location, $cordovaLocalNotification, timerService, BabyService, $localStorage, $cordovaSplashscreen, $http, $cordovaStatusbar, $ionicScrollDelegate, $state, $timeout) {

    $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
       
	    if (window.StatusBar) {
            $cordovaStatusbar.overlaysWebView(true);
            $cordovaStatusbar.style(1); //light
            if (ionic.Platform.isAndroid()) {
                $cordovaStatusbar.styleHex('#2f77b1');
            }
            // org.apache.cordova.statusbar required
           
            /*StatusBar.styleDefault();
            if (ionic.Platform.isAndroid()) {
                StatusBar.backgroundColorByHexString("#2f77b1");
            }*/
        }

        $rootScope.dynamicStatusBar = function (delegate) {
            var pos = $ionicScrollDelegate.$getByHandle(delegate).getScrollPosition();
            if(window.StatusBar && (ionic.Platform.isIPad() || ionic.Platform.isIOS())) {
                if(pos.top > 10) {
                    if($cordovaStatusbar.isVisible())
                        $cordovaStatusbar.hide();
                } else {
                    if(!$cordovaStatusbar.isVisible())
                        $cordovaStatusbar.show();
                }
            }
        };

        $rootScope.onTabSelected = function (that) {
            $timeout(function () {
                $state.go('app.more', {});
            }, 20);
        };

        $rootScope.showPlusButton = false;
		
		/**
         * Global Utility Function: Hides the keyboard when tapping go.
         * @param input
         */
        $rootScope.hideKeyboard = function(){
            $(document.activeElement).blur();
            return false;
        };
		
        $rootScope.setBaby = function (baby){

            $rootScope.babyBorn = baby.born;
            $rootScope.babyGender = baby.gender;
            $rootScope.babyWidth = baby.width;
            $rootScope.babyLength = baby.length;
            $rootScope.babyHeadr = baby.head;
            $rootScope.baby = baby;
            $rootScope.babyId = baby.uuid;
            $localStorage.babyId = baby.uuid;
            $rootScope.$broadcast('babySelected', baby);
        };

        $rootScope.findDefaultBaby = function (babies) {
            if($localStorage.babyId){
                for (var i in babies){
                    if(babies.hasOwnProperty(i)){
                        if(babies[i].uuid == $localStorage.babyId){
                            $rootScope.setBaby(babies[i]);
                            break;
                        }
                    }
                }
            }

            if(!$rootScope.babyId){
                $rootScope.setBaby(babies[0])
            }
        };

        AuthService.setup().then(function(babies){
            $rootScope.findDefaultBaby(babies);
            $rootScope.$broadcast('auth');
        });

        // timer instance
        $rootScope.timers = timerService;

        $ionicModal.fromTemplateUrl('templates/activities/choose.html', {
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $rootScope.newmodal = modal;
        });

        $rootScope.openNewModal = function () {
            $rootScope.newmodal.show();
        };
        $rootScope.closeNewModal = function () {
            $rootScope.newmodal.hide();
        };

        $rootScope.$on('$destroy', function () {
            $rootScope.newmodal.remove();
        });
        // Execute action on hide modal
        $rootScope.$on('modal.hidden', function (modal) {
            // Execute action
        });

        // Execute action on remove modal
        $rootScope.$on('modal.removed', function (modal) {
            // Execute action
        });


        // hide the splashscreen
        // only call .hide() if we are running inside cordova (webview), otherwise desktop chrome throws an error
        if (ionic.Platform.isWebView()) {
			$timeout(function () {
				$timeout(function () {
					//DOM has finished rendering - the double timeout is required otherwise its triggered too early
					$cordovaSplashscreen.hide();
				}, 0);
			}, 0);
		}
		
		

    });

})
.config(["$translateProvider", "$ionicConfigProvider",
    function($translateProvider, $ionicConfigProvider){
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
        $translateProvider.preferredLanguage('en');
        $translateProvider.useStaticFilesLoader({
            'prefix': 'languages/',
            'suffix': '.json'
        });
    }]).config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
        convertDates(responseData);
        return responseData;
    });
}]);
var convertDates = function(input) {
    for(var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        if (typeof input[key] === "object") {
            convertDates(input[key]);
        } else {
            if (typeof input[key] === "string" &&  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(input[key])) {
                input[key] = new Date(input[key]);
            }
        }
    }
};
function escapeEmailAddress(email) {
    if (!email) return false;
    // Replace '.' (not allowed in a Firebase key) with ','
    email = email.toLowerCase();
    email = email.replace(/\./g, ',');
    return email.trim();
}
