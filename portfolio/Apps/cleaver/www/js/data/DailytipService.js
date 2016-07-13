/**
 * Created by Kevin on 29/04/2015.
 */

angular.module('cleverbaby.data')
    .factory('DailytipService', ['$filter', '$http', '$localStorage', '$q', '$translate', function($filter, $http, $localStorage, $q, $translate) {
        /**
         * Returns the json file
         * This is also used for the dynamic changing of the language used
         * @param language - eg. 'fr', 'en', 'dn'
         * @returns {*|Object|promise} the json data of translated word(s)
         */
        function getTranslatedTipFile(tipType, language) {
            return $http.get('languages/'+tipType+'/'+language+'.json', {
                cache: true
            });
        }

        /**
         * Returns the app tip
         */
        function processTranslatedAppTip() {
            var deferred = $q.defer();
            getTranslatedTipFile('apptips', getActiveLanguage()).then(function(appTips){
                var finalAppTips = [];
                angular.forEach(appTips.data, function(appTip){
                    //todo temporary code since theres no existing localstorage yet for achievements
                    //if(!$localStorage.achievements[appTip.achievement]){
                        finalAppTips.push(appTip);
                    //}
                })
                var finalPickAppTip = randomPicker(finalAppTips);
                deferred.resolve(finalPickAppTip);
            })
            .catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        /**
         * function for random picking
         */
        function randomPicker(arrayTip) {
            var x = true;
            var validDailyTip;
            var lastDailyTip = getLastDailyTip();
            while(x){
                var randomnumber = Math.floor(Math.random() * ((arrayTip.length - 1) - 0 + 1)) + 0;
                if (arrayTip[randomnumber] != lastDailyTip){
                    validDailyTip = arrayTip[randomnumber];
                    x = false;
                }
            }
            return validDailyTip;
            /*
             var x = true;
             while(x){
             var randomnumber = Math.floor(Math.random() * ((dailyTips.length - 1) - 0 + 1)) + 0;
             if (dailyTips[randomnumber] != lastDailyTip){
             validDailyTip = dailyTips[randomnumber];
             x = false;
             }
             }
             */
        }

        function processDailyTipPick(result, activeBaby) {
            var dailyTips = $filter('filter')(result.data, function(value, index){
                var matchGender = value.gender == activeBaby.gender || value.gender == 'a';
                var babyAgeDays = moment(new Date()).diff(moment(activeBaby.birthday), 'days');
                if(value.fromAge <= babyAgeDays && value.toAge >= babyAgeDays){
                    return matchGender;
                }
            });

            var validDailyTip;
            var lastDailyTip = getLastDailyTip();
            if(!lastDailyTip) {
                validDailyTip = dailyTips[0];
            }else{
                validDailyTip = randomPicker(dailyTips);
            }

            return validDailyTip;
            //saveCurrentDailyTip(validDailyTip);
        }

        /**
         * Returns a random picked from the dailytips json file basing on the current childs age and gender
         * not the same from the last daily tip
         */
        function getTranslatedTip(activeBaby) {
            var deferred = $q.defer();
            var translatedDailyTips;

            getTranslatedTipFile('dailytips',getActiveLanguage())
                .then(function(dailyTip){
                    translatedDailyTips = dailyTip;
                    return processTranslatedAppTip();
                }).
                then(function(appTip){
                    //var tip = [processDailyTipPick(translatedDailyTips, activeBaby)];
                    var finalTip;
                    if(appTip){
                        finalTip = randomPicker([processDailyTipPick(translatedDailyTips, activeBaby), appTip]);
                    }else{
                        finalTip = processDailyTipPick(translatedDailyTips, activeBaby);
                    }
                    saveCurrentDailyTip(finalTip);
                    deferred.resolve(finalTip);
                })
                .catch(function (error) {
                   deferred.reject(error);
                });
            return deferred.promise;
        }

        /**
         * Gets the last daily tip in localstorage
         * @returns {*|$localStorage.lastDailyTip}
         */
        function getLastDailyTip() {
            return $localStorage.lastDailyTip;
        }

        /**
         * Save the current dailytip to localstorage
         * @param dailyTip - the current daily tip
         */
        function saveCurrentDailyTip(dailyTip) {
            $localStorage.lastDailyTip = dailyTip;
        }

        /**
         * Gets the language used by the app.
         * @returns {String} Something like 'fr', 'en', ...
         */
        function getActiveLanguage() {
            return $translate.use();
        }

        /**
         * Saves time of daily tip was hidden.
         */
        function saveLastHideDailyTip() {
            $localStorage.lastHideDailyTip = parseInt(moment(new Date()).format("x"));
        }

        /**
         * Computes the last time the daily tip was hidden, if more than 0 the dailytips is to be shown again
         * @returns {boolean}
         */
        function showDailtyTip() {
            if(!$localStorage.lastHideDailyTip){
                return true;
            }
            moment.locale('en');
            var now = moment(new Date());
            var lastHideDailyTip = moment($localStorage.lastHideDailyTip);
            var dayDifference = now.diff(lastHideDailyTip, 'days'); // "a day ago"
            return dayDifference > 0;
        }

        return {
            getTranslatedTip: getTranslatedTip,
            saveLastHideDailyTip: saveLastHideDailyTip,
            showDailtyTip: showDailtyTip
        }
    }]);
