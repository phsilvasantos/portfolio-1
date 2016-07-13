angular.module('starter.services', [])

.factory('WorkoutService', function() {
         return {
         getWorkoutsByCategories: function(categoryId) {
         return LocalData.GetWorkoutCategories[categoryId].workoutTypes;
         },
         getCategoryName: function(categoryId) {
         return LocalData.GetWorkoutCategories[categoryId].fullName;
         },
         getTypeName: function(typeId) {
         return LocalData.GetWorkoutTypes[typeId].activityNames;
         },
         getWorkoutsByType: function() {
         return LocalData.GetWorkoutTypes;
         },
         getTimingIntervals: function() {
         return TimingData.GetTimingSettings;
         },
         getSevenIntervals: function() {
         return TimingData.GetSevenMinuteSettings;
         },
         getExercisesByCategory: function(categoryName) {
         var arr = [];
         for(var exercise in exerciseObject) {
         if (exerciseObject[exercise].category == categoryName){
         arr.push(exerciseObject[exercise])
         }
         }
         arr.sort(function(a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                  });
         return arr;
         },getAllExercises: function() {
         return exerciseObject;
         }
         }
         })

.factory('UserService', function() {
         return {
         getUserSettings: function() {
         return PersonalData.GetUserSettings;
         }, getCustomWorkoutList: function() {
         return PersonalData.GetCustomWorkouts;
         }, getCurrentCustom: function() {
         return PersonalData.GetWorkoutArray.workoutArray;
         }, getUserSettings: function() {
         return PersonalData.GetUserSettings;
         }, getGoalSettings: function() {
         return PersonalData.GetUserGoals;
         }, getTimingIntervals: function() {
         return TimingData.GetTimingSettings;
         }
         }
         })

.run(function($rootScope, $timeout, $http, $ionicPlatform, $ionicPopup, $location, $ionicSideMenuDelegate) { $ionicPlatform.ready(function() {
                                                                                  //localforage.clear(null);
                                                                                  if (window.localStorage.getItem('firstUse') === null){
                                                                                    setupNewUser();
                                                                                  } else if (window.localStorage.getItem('refreshUpdated') === null){
                                                                                    convertUser();
                                                                                  } else{
                                                                                    loadStoredData();
                                                                                  }
                                                                                  try {
                                                                                  if (device.platform.toLowerCase() !== 'android'){
                                                                                  $timeout(function(){
                                                                                           navigator.splashscreen.hide();
                                                                                           }, 1000);
                                                                                  //Just in case :)
                                                                                  $timeout(function(){
                                                                                           navigator.splashscreen.hide();
                                                                                           }, 2400);
                                                                                  }
                                                                                  }
                                                                                  catch (e) {
                                                                                  window.device = false;
                                                                                  }
                                                                                  
                                                                                  //Setup Extra data like weekly stats
                                                                                  setupExtraData($http);
                                                                                  //Download custom workouts
                                                                                  getDownloadableWorkouts($http);
                                                                                  //Setup Workout Database
                                                                                  setupDatabase();
                                                                                  $timeout(function(){
                                                                                           if(!window.db){
                                                                                           setupDatabase();
                                                                                           }
                                                                                           }, 3000);
                                                                                  
                                                                                  //Initialize SessionM and call 'visit' activity
                                                                                  //Tell LowLatency session is beginning
                                                                                  if (device){
                                                                                  $timeout(function(){initializeAnalytics()},2000);
                                                                                  $timeout(function(){initializeSessionM($rootScope);},3000);
                                                                                  $timeout(function(){initializeKiip()},4000);
                                                                                  LowLatencyAudio.turnOffAudioDuck();
                                                                                  }

                                                                                  if (ionic.Platform.isAndroid()){
                                                                                    if (device) {
                                                                                      checkTotalDownloads();
                                                                                    }
                                                                                    $ionicPlatform.registerBackButtonAction(
                                                                                      function () {
                                                                                          var tempURL = $rootScope.$viewHistory.currentView.url.substring(0,9);
                                                                                          var isHome = function(){
                                                                                            if ($rootScope.$viewHistory.currentView.url == '/app/home'){
                                                                                              return true;
                                                                                            } else{
                                                                                              return false;
                                                                                            }
                                                                                          }
                                                                                          if (isHome()){
                                                                                            ionic.Platform.exitApp();
                                                                                          }
                                                                                          else if (tempURL == '#/app/cust') {
                                                                                            $location.path('/app/custom');
                                                                                          } else if (tempURL == '/app/home'){
                                                                                            $rootScope.$viewHistory.backView.go();
                                                                                          } else if ($rootScope.$viewHistory.currentView.url == '/app/progress/log'){
                                                                                            $location.path('/app/progress');
                                                                                            $ionicSideMenuDelegate.toggleLeft(false);
                                                                                          } else if (tempURL == '/app/swor' && $rootScope.$viewHistory.backView !== null){
                                                                                            $location.path($rootScope.$viewHistory.backView.url);
                                                                                            $ionicSideMenuDelegate.toggleLeft(false);
                                                                                          } else {
                                                                                            $location.path('/app/home');
                                                                                            $ionicSideMenuDelegate.toggleLeft(false);
                                                                                          }
                                                                                      }, 180
                                                                                      );
                                                                                      document.addEventListener("resume", onResume, false);
                                                                                      document.addEventListener("pause", onPause, false);
                                                                                    }
                                                                                    if (ionic.Platform.isIOS() && device) {
                                                                                      document.addEventListener("resume", onResumeIOS, false);
                                                                                      appAvailability.check(
                                                                                        'nxr://',
                                                                                        function() {
                                                                                          nexerciseInstalledGlobal.status = true;
                                                                                        },
                                                                                        function() {
                                                                                          nexerciseInstalledGlobal.status = false;
                                                                                        }
                                                                                      );
                                                                                      if (device.version < "7") {
                                                                                          ionic.Platform.fullScreen(true, true);
                                                                                      }
                                                                                    } else if (ionic.Platform.isAndroid() && device) {
                                                                                      appAvailability.check(
                                                                                        'com.nexercise.client.android',
                                                                                        function() {
                                                                                          nexerciseInstalledGlobal.status = true;
                                                                                        },
                                                                                        function() {
                                                                                          nexerciseInstalledGlobal.status = false;
                                                                                        }
                                                                                      );
                                                                                      if (ionic.Platform.version() < 4.1){
                                                                                        lowerAndroidGlobal = true;
                                                                                      } else{
                                                                                        lowerAndroidGlobal = false;
                                                                                      }
                                                                                      localforage.getItem('userSettings', function(result){
                                                                                        var decisionCondition;
                                                                                        console.log('totalVideosInstalled is ' + totalVideosInstalled)
                                                                                        if (result == null){
                                                                                          decisionCondition = true;
                                                                                        } else {
                                                                                          decisionCondition = result.downloadDecision;
                                                                                        }
                                                                                        if (decisionCondition && totalVideosInstalled < 168){
                                                                                          $rootScope.downloadPopup = $ionicPopup.show({
                                                                                            title: 'Download Videos',
                                                                                            subTitle: '',
                                                                                            scope: $rootScope,
                                                                                            template: '<p class="centered padding" style="border-bottom: 1px solid rgb(174, 174, 174);margin-bottom: 0px;">Get the very best experience by downloading the videos for autoplay and offline use. Only 40MB!</p><div class="action-button"><button class="button button-full button-stable" ng-click="downloadPopupClose(0)" style="color: #0099cc;">Yes! Download Videos Now</button><button class="button button-full button-stable" ng-click="downloadPopupClose(1)">Reminder Me Later</button><button class="button button-full button-stable" ng-click="downloadPopupClose(2)">No Thanks.</button></div>',
                                                                                            buttons: []
                                                                                          });
                                                                                          $rootScope.downloadPopupClose = function(inputIndex){
                                                                                            if (inputIndex === 0){
                                                                                              downloadProgress();
                                                                                              downloadAllExercise();
                                                                                              PersonalData.GetUserSettings.downloadDecision = false;
                                                                                              localforage.setItem('userSettings', PersonalData.GetUserSettings);
                                                                                              $rootScope.downloadPopup.close();
                                                                                            } else if (inputIndex === 1){
                                                                                              $rootScope.downloadPopup.close();
                                                                                            } else if (inputIndex === 2){
                                                                                              PersonalData.GetUserSettings.downloadDecision = false;
                                                                                              localforage.setItem('userSettings', PersonalData.GetUserSettings);
                                                                                              $rootScope.downloadPopup.close();
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                        
                                                                                      })
                                                                                      
                                                                                    }
                                                                                    if (ionic.Platform.isAndroid() && device && window.innerWidth < 594 && window.innerHeight < 594){
                                                                                      try{
                                                                                        cordova.plugins.screenorientation.lockOrientation('portrait');
                                                                                      } catch(e){
                                                                                        screen.lockOrientation('portrait');
                                                                                      }
                                                                                    }
                                                                                  });
     });

var nexerciseInstalledGlobal = {status:false};
var lowerAndroidGlobal = {status:false};
var globalExternal = false;
var globalRateOption = false;
var globalRemindOption = false;
function handleOpenURL(url) {
    window.setTimeout(function () {
                      var body = document.getElementsByTagName("body")[0];
                      var appLaunchedController = angular.element(body).scope();
                      appLaunchedController.callCustom(url);
                      }, 2000);
}

function setupNewUser(){
    console.log('Data Test: New User');
    window.localStorage.setItem('firstUse',28);
    window.localStorage.setItem('timesUsed',0);
    window.localStorage.setItem('refreshUpdated',true);
    localforage.setItem('timingSettings', TimingData.GetTimingSettings);
    localforage.setItem('timingSevenSettings', TimingData.GetSevenMinuteSettings);
    localforage.setItem('reminder',{daily: {status:false,time:7,minutes:0}, inactivity: {frequency: 2, status:false,time:7,minutes:0}});
    LocalData.SetReminder = {daily: {status:false,time:7,minutes:0}, inactivity: {frequency: 2, status:false,time:7,minutes:0}};
    localforage.setItem('userSettings', PersonalData.GetUserSettings);
    localforage.setItem('userGoals', PersonalData.GetUserGoals);
    localforage.setItem('userProgress', PersonalData.GetUserProgress);
    localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
    localforage.setItem('currentCustomArray', PersonalData.GetWorkoutArray);
    localforage.setItem('ratingStatus', false);
    localforage.setItem('ratingHome', {show:false,past:false});
    localforage.setItem('remindHome', {show:false,past:false});
    localforage.setItem('externalStorage', false);
}

function convertUser(){
    console.log('Data Test: Converting User');
    window.localStorage.setItem('firstUse',28);
    window.localStorage.setItem('timesUsed',0);
    if (parseInt(window.localStorage.getItem('breakSetting')) == 1){
        window.localStorage.setItem('breakFreq', 0);
        console.log('Data Test: breakFreqWasSet: true');
    }
    if (parseInt(window.localStorage.getItem('randomizationOption')) == 1){
        window.localStorage.setItem('randomizationOption',true);
        console.log('Data Test: randomizationOption was: 1');
    } else if (parseInt(window.localStorage.getItem('randomizationOption')) == 0){
        window.localStorage.setItem('randomizationOption',false);
        console.log('Data Test: randomizationOption was: 0');
    }
    if (parseInt(window.localStorage.getItem('audioOption')) == 0){
        window.localStorage.setItem('audioOption',true);
        console.log('Data Test: audioOption was: 0');
    } else if (parseInt(window.localStorage.getItem('audioOption')) == 1){
        window.localStorage.setItem('audioOption',false);
        console.log('Data Test: audioOption was: 1');
    }

    //Sworkit Free Special Change ('Special Change' means it is worth noting in case of big changes)
    if (parseInt(window.localStorage.getItem('transition')) == 0){
        window.localStorage.setItem('transitionTime',0);
        window.localStorage.setItem('transition',false);
        console.log('Data Test: transition was: 0');
    } else if (parseInt(window.localStorage.getItem('transition')) == 5){
        window.localStorage.setItem('transitionTime',5);
        window.localStorage.setItem('transition',true);
        console.log('Data Test: transition was: 5 (on)');
    } else{
      window.localStorage.setItem('transition',false);
    }
    window.localStorage.setItem('kiipRewards',true);
    if (window.localStorage.getItem("workoutArray") !== null){
        var currentCustomWorkout = JSON.parse(window.localStorage.getItem("workoutArray"));
        var savedWorkoutsUnstring = [];
        savedWorkoutsUnstring[0] = {"name": 'My Awesome Workout',"workout": currentCustomWorkout};
        console.log('Data Test: currentCustomWorkout was: ' + JSON.stringify(window.localStorage.getItem("workoutArray")));
    } else{
      var savedWorkoutsUnstring = [];
      var currentCustomWorkout = [];
    }
    //End Special Changes

    if (parseInt(window.localStorage.getItem('customSet')) == 1){
        window.localStorage.setItem('customSet',true);
        console.log('Data Test: customSet was: 1');
    } else if (parseInt(window.localStorage.getItem('audioOption')) == 0){
        window.localStorage.setItem('customSet',false);
        console.log('Data Test: customSet was: 0');
    }
    if (parseInt(window.localStorage.getItem('mfpStatus')) == 1){
        window.localStorage.setItem('mfpStatus',true);
        console.log('Data Test: mfpStatus was: 1');
    } else if (parseInt(window.localStorage.getItem('mfpStatus')) == 0){
        window.localStorage.setItem('mfpStatus',false);
        console.log('Data Test: mfpStatus was: 1');
    } else {
      window.localStorage.setItem('mfpStatus',false);
    }
    if (parseInt(window.localStorage.getItem('myFitnessReady')) == 1){
        window.localStorage.setItem('myFitnessReady',true);
        console.log('Data Test: myFitnessReady was: 1');
    } else if (parseInt(window.localStorage.getItem('myFitnessReady')) == 0){
        window.localStorage.setItem('myFitnessReady',false);
        console.log('Data Test: myFitnessReady was: 0');
    } else {
      window.localStorage.setItem('myFitnessReady',false);
    }
    if (parseInt(window.localStorage.getItem('mfpWeight')) == 0){
        window.localStorage.setItem('mfpWeight',false);
    } else if (window.localStorage.getItem('mfpWeight')){
        window.localStorage.setItem('mfpWeight',true);
    } 
    console.log("Data Test: breakFreq was: " + window.localStorage.getItem('breakFreq'));
    console.log("Data Test: exerciseTime was: " + window.localStorage.getItem('exerciseTime'));
    console.log("Data Test: breakTime was: " + window.localStorage.getItem('breakTime'));
    console.log("Data Test: transitionTime was: " + window.localStorage.getItem('transitionTime'));
    console.log("Data Test: randomizationOption was: " + window.localStorage.getItem('randomizationOption'));
    console.log("Data Test: workoutLength was: " + window.localStorage.getItem('workoutLength'));
    console.log("Data Test: audioOption was: " + window.localStorage.getItem('audioOption'));
    localforage.setItem('timingSettings', {
                        customSet: (window.localStorage.getItem('customSet')  === "true")  || false,
                        breakFreq: parseInt(window.localStorage.getItem('breakFreq')) || 5,
                        exerciseTime: parseInt(window.localStorage.getItem('exerciseTime')) || 30,
                        breakTime: parseInt(window.localStorage.getItem('breakTime')) || 30,
                        transitionTime: parseInt(window.localStorage.getItem('transitionTime')) || 0,
                        transition: (window.localStorage.getItem('transition')  === "true"),
                        randomizationOption: (window.localStorage.getItem('randomizationOption')  === "true") || true,
                        workoutLength: parseInt(window.localStorage.getItem('workoutLength')) || 15,
                        audioOption: (window.localStorage.getItem('audioOption')  === "true") || true,
                        warningAudio: true,
                        countdownBeep: true,
                        autoPlay: true,
                        countdownStyle: true
                        });
    localforage.setItem('timingSevenSettings', {
                        customSetSeven: true,
                        breakFreqSeven: 0,
                        exerciseTimeSeven: 30,
                        breakTimeSeven: 0,
                        transitionTimeSeven: 10,
                        randomizationOptionSeven: false,
                        workoutLengthSeven: 7
                        });
    console.log("Data Test: weight was: " + window.localStorage.getItem('weight'));
    console.log("Data Test: weightType was: " + window.localStorage.getItem('weightType'));
    console.log("Data Test: kiipRewards was: " + window.localStorage.getItem('kiipRewards'));
    console.log("Data Test: mfpStatus was: " + window.localStorage.getItem('mfpStatus'));
    console.log("Data Test: myFitnessReady was: " + window.localStorage.getItem('myFitnessReady'));
    console.log("Data Test: mfpWeight was: " + window.localStorage.getItem('mfpWeight'));
    console.log("Data Test: mfpAccessToken was: " + window.localStorage.getItem('mfpAccessToken'));
    console.log("Data Test: mfpRefreshToken was: " + window.localStorage.getItem('mfpRefreshToken'));

    localforage.setItem('userSettings', {
                        weight: parseInt(window.localStorage.getItem('weight')) || 150,
                        weightType: parseInt(window.localStorage.getItem('weightType')) || 0,
                        kiipRewards: true,
                        mPoints: true,
                        mfpStatus: (window.localStorage.getItem('mfpStatus') === "true"),
                        myFitnessReady: (window.localStorage.getItem('myFitnessReady') === "true"),
                        mfpWeight: (window.localStorage.getItem('mfpWeight') === "true"),
                        mfpAccessToken: window.localStorage.getItem('mfpAccessToken') || false,
                        mfpRefreshToken: window.localStorage.getItem('mfpRefreshToken') || false,
                        videosDownloaded: false,
                        downloadDecision: true,
                        healthKit: false                     
                      });
    console.log("Data Test: dailyGoal was: " + window.localStorage.getItem('dailyGoal'));
    console.log("Data Test: weeklyGoal was: " + window.localStorage.getItem('weeklyGoal'));
    localforage.setItem('userGoals', {
                        dailyGoal: parseInt(window.localStorage.getItem('dailyGoal')) || 15,
                        weeklyGoal: parseInt(window.localStorage.getItem('weeklyGoal')) || 75
                        });
    console.log("Data Test: weeklyTotal was: " + window.localStorage.getItem('weeklyTotal'));
    console.log("Data Test: week was: " + window.localStorage.getItem('week'));
    localforage.setItem('userProgress', {
                        monthlyTotal: 0,
                        weeklyTotal: parseInt(window.localStorage.getItem('weeklyTotal')) || 0,
                        dailyTotal: 0,
                        totalCalories: 0,
                        totalProgress: 0,
                        day: 0,
                        week: parseInt(window.localStorage.getItem('week')) || 0
                        });
    localforage.setItem('customWorkouts', {
                        savedWorkouts: savedWorkoutsUnstring
                        });
    localforage.setItem('reminder',{daily: {status:false,time:7,minutes:0}, inactivity: {frequency: 2, status:false,time:7,minutes:0}});
    LocalData.SetReminder = {daily: {status:false,time:7,minutes:0}, inactivity: {frequency: 2, status:false,time:7,minutes:0}};
    localforage.setItem('ratingStatus', false);
    localforage.setItem('ratingHome', {show:false,past:false});
    localforage.setItem('remindHome', {show:false,past:false});
    //Callback for last item includes loadStoredData()
    localforage.setItem('currentCustomArray', {
                        workoutArray: currentCustomWorkout
                        }, function(){loadStoredData()});
    window.localStorage.setItem('refreshUpdated',true);
    console.log('Data Test: refreshUpdate: ' + window.localStorage.getItem("refreshUpdated"));
}
function loadStoredData(){
    localforage.getItem('timingSettings', function (result){
      if (result == null){
        localforage.setItem('timingSettings', TimingData.GetTimingSettings);
      } else{
        TimingData.GetTimingSettings = result
      }
      });
    localforage.getItem('timingSevenSettings', function(result){
      if (result == null){
        localforage.setItem('timingSevenSettings', TimingData.GetSevenMinuteSettings);
      } else{
         TimingData.GetSevenMinuteSettings = result
      }
     });
    localforage.getItem('reminder', function(result){
      if (result == null){
        localforage.setItem('reminder',{daily: {status:false,time:7,minutes:0}, inactivity: {frequency: 2, status:false,time:7,minutes:0}});
      } else{
        LocalData.SetReminder = result;
        checkForNotification();
                            if (LocalData.SetReminder.inactivity.status){
                            window.plugin.notification.local.cancel(2);
                            var nDate = new Date();
                            nDate.setHours(LocalData.SetReminder.inactivity.time);
                            nDate.setMinutes(LocalData.SetReminder.inactivity.minutes);
                            nDate.setSeconds(0);
                            nDate.setDate(nDate.getDate() + LocalData.SetReminder.inactivity.frequency);
                            setTimeout( function (){window.plugin.notification.local.add({
                                                                                         id:         2,
                                                                                         date:       nDate,    // This expects a date object
                                                                                         message:    "It's been too long. Time to Swork Out.",  // The message that is displayed
                                                                                         title:      'Workout Reminder',  // The title of the message
                                                                                         autoCancel: true,
                                                                                         icon: 'ic_launcher',
                                                                                         smallIcon: 'ic_launcher_small'
                                                                                         });console.log('inactivity notification set for: ' + JSON.stringify(nDate))}, 4000);
        } if(LocalData.SetReminder.daily.status){
            setupNotificationDaily();
        }
      }   
    });
    localforage.getItem('userSettings', function (result){
      if (result == null){
        localforage.setItem('userSettings', PersonalData.GetUserSettings);
      } else{
        if (result.healthKit == null){
          result.healthKit = false;
        }
        PersonalData.GetUserSettings = result;
      }
    });
    localforage.getItem('userGoals', function (result){
      if (result == null){
        localforage.setItem('userGoals', PersonalData.GetUserGoals);
      } else{
         PersonalData.GetUserGoals = result;
      }
    });
    localforage.getItem('userProgress', function (result){
      if (result == null){
        localforage.setItem('userProgress', PersonalData.GetUserProgress);
      } else{
         PersonalData.GetUserProgress = result;
      }
    });
    localforage.getItem('customWorkouts', function (result){
      if (result == null){
        localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
      } else{
         PersonalData.GetCustomWorkouts = result;
      }
    });
    localforage.getItem('currentCustomArray', function (result){
      if (result == null){
        localforage.setItem('currentCustomArray', PersonalData.GetWorkoutArray);
      } else{
         PersonalData.GetWorkoutArray = result;
      }
    });
    localforage.getItem('ratingStatus', function (result){
      if (result == null){
        localforage.setItem('ratingStatus', false);
      }
    });
    localforage.getItem('externalStorage', function (result){
      if (result == null){
        localforage.setItem('externalStorage', false);
      } else{
         globalExternal = result;
      }
    });
    localforage.getItem('ratingHome', function (result){
      if (result == null){
        localforage.setItem('ratingHome', {show:false,past:false});
      } else{
         globalRateOption = result.show;
      }
    });
    localforage.getItem('remindHome', function (result){
      if (result == null){
        localforage.setItem('remindHome', {show:false,past:false});
      } else{
         globalRemindOption = result.show;
      }
    });
    var timesUsedVar = parseInt(window.localStorage.getItem('timesUsed'));
    timesUsedVar++;
    window.localStorage.setItem('timesUsed', (timesUsedVar));
}

function setupExtraData($http){
    var c = new Date();
    var thisWeek = c.getWeek();
    var testWeek = window.localStorage.getItem('week');
    if (thisWeek != testWeek){
        window.localStorage.setItem('weeklyTotal', 0);
        window.localStorage.setItem('week', thisWeek);
        if (PersonalData.GetUserSettings.mfpWeight){
            getMFPWeight($http);
        } else if (PersonalData.GetUserSettings.healthKit){
          window.plugins.healthkit.readWeight({
                                                'unit': 'lb'
                                                },
                                                function(msg){
                                                  if (!isNaN(msg)){
                                                    PersonalData.GetUserSettings.weight = msg;
                                                  }
                                                },
                                                function(){}
                                                );
        }
    }
    window.backendVersion = 1;
    window.myObj = {};
}

function setupDatabase(){
    window.db=false;
    window.db = openDatabase('SworkitDBFree', '1.0', 'SworkitDBFree',1048576);
    window.db.transaction(function(tx){
                          tx.executeSql( 'CREATE TABLE IF NOT EXISTS SworkitFree(sworkit_id INTEGER NOT NULL PRIMARY KEY, created_on DATE DEFAULT NULL, minutes_completed INTEGER NOT NULL,calories INTEGER NOT NULL, type TEXT NOT NULL, utc_created DATE DEFAULT NULL)', [],window.nullHandler,window.errorHandler);},window.errorHandler,window.successCallBack);
    
    window.errorHandler = function(transaction, error) {
        alert('Error: ' + error.message + ' code: ' + error.code);
    }
    window.successCallBack = function() {
        //alert("DEBUGGING: success");
        console.log('Data Test - Database success' );
    }
    window.nullHandler = function(){
        //console.log('Data Test - Database null' );
    };
    db.transaction(function(tx){
    tx.executeSql( 'SELECT utc_created from Sworkitfree', [], nullHandler,addColumn);},nullHandler,successCallBack);
}
var sessionmAvailable = true;
function initializeSessionM($rootScope){
    $rootScope.sessionMAvailable = true;
    if (ionic.Platform.isAndroid()){
      sessionm.phonegap.startSession('9b7155b57da13b714bdafb7ee3ff175d839a7786');
    } else{
      sessionm.phonegap.startSession('c46b4d571681af4803890c8a18b71c26ce4ff3d3');
    }
    sessionm.phonegap.setAutoPresentMode(true);

    setTimeout(function(){
        if (PersonalData.GetUserSettings.mPoints){
          logActionSessionM('visit');
          sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
            $rootScope.showPointsBadge = (data.unclaimedAchievementCount > 0) ? true : false;
            $rootScope.mPointsTotal = data.unclaimedAchievementCount;
          });
        }
    }, 3000);
    sessionm.phonegap.listenFailures(function(data) {
      //two variables because we prefer not to use $rootScope but it is necessary for menu
      sessionmAvailable = false;
      $rootScope.sessionMAvailable = false;
    });
}

function logActionSessionM(activity){
    if (PersonalData.GetUserSettings.mPoints){
      sessionm.phonegap.logAction(activity);
    }
}
var hasInit = false;
function initializeKiip(){
    if (ionic.Platform.isAndroid()){
      kiip.init("bc6cb0d9be1514798803fb42f977fd51", "ef63e020384de2d45321fc3c1a0c5c1b", function(){console.log('kiip initialized');hasInit = true;}, null);
    } else{
      kiip.init("9db7edde78c1b9b9d0234811e6285433", "902ae5b5d0251fba66617a2ed05f41eb", function(){console.log('kiip initialized');hasInit = true;}, null);
    }
}

function callMoment(typeWorkout){
    kiip.saveMoment(typeWorkout, null, null);
}

function initializeAnalytics(){
    analytics.startTrackerWithId('UA-38468920-2');
    analytics.trackView('/index.html');
}
function trackEvent(action, label, value){
  if (device){
    var platformCategory = (device.platform.toLowerCase() == 'ios') ? 'Sworkit iOS' : 'Sworkit Google'
    analytics.trackEvent(platformCategory, action, label, value);
  }
}
function addColumn(){
            db.transaction(function(transaction) {
                           transaction.executeSql('ALTER TABLE Sworkitfree ADD utc_created DATE DEFAULT NULL',[] , nullHandler,errorHandler);
                           });
        }
window.downloadableWorkouts = [];
window.downloadableWorkouts = [];
function getDownloadableWorkouts($http, caller, type){
    $http.get('http://sworkitapi.herokuapp.com/workouts?q=featured').then(function(resp){
                                                                    localforage.setItem('downloadableWorkouts', resp.data);
                                                                    window.downloadableWorkouts = resp.data;
                                                                    if (caller){
                                                                      showNotification('Custom workout list updated', 'button-balanced', 1500);
                                                                    }
                                                                    getPopularWorkouts($http, caller, type);
                                                                    }, function(err) {
                                                                      localforage.getItem('downloadableWorkouts', function(result){
                                                                        if (result === null){
                                                                          localforage.setItem('downloadableWorkouts', []);
                                                                        } else {
                                                                          window.downloadableWorkouts = result;
                                                                        }
                                                                      })
                                                                      if (caller){
                                                                      showNotification('Unable to connect. Please try again.', 'button-assertive', 2500);
                                                                      }
                                                                    })
}
window.popularWorkouts = [];
function getPopularWorkouts($http, caller, type){
    $http.get('http://sworkitapi.herokuapp.com/workouts?q=popular').then(function(resp){
                                                                    localforage.setItem('popularWorkouts', resp.data);
                                                                    window.popularWorkouts = resp.data;
                                                                    if (type == 'popular'){
                                                                      window.downloadableWorkouts = resp.data;
                                                                    }
                                                                      }, function(err) {
                                                                      localforage.getItem('popularWorkouts', function(result){
                                                                        if (result === null){
                                                                          localforage.setItem('popularWorkouts', []);
                                                                        } else {
                                                                          window.popularWorkouts = result;
                                                                        }
                                                                      })
                                                                    })
}

function getMFPWeight($http, $scope){
    var d = new Date();
    var dateString = d.getFullYear() + "-" + (d.getMonth() +1) + "-" + d.getDate();
    var actionString = "get_weight";
    var accessString = PersonalData.GetUserSettings.mfpAccessToken;
    var appID = "79656b6e6f6d";
    var unitType = 'US';
    //console.log('MFP Weight Sync time: ' + dateString);
    var dataPost = JSON.stringify({'action' : actionString, 'access_token' : accessString,'entry_date' : dateString, 'units' : unitType, 'app_id': appID});
    $http({
          method: 'POST',
          url: 'https://www.myfitnesspal.com/client_api/json/1.0.0?client_id=sworkit',
          data: dataPost,
          headers: {'Content-Type': 'application/json'}
          }).then(function(resp){
                  PersonalData.GetUserSettings.mfpWeight = resp.data['updated_at'] || false;
                  PersonalData.GetUserSettings.weight = resp.data['weight'] || 150;
                  localforage.setItem('userSettings', PersonalData.GetUserSettings);
                  if ($scope){
                  $scope.mfpWeightStatus.date = resp.data['updated_at'];
                  $scope.mfpWeightStatus.data = true;
                  $scope.convertWeight();
                  }
                  }, function(err) {
                  if ($scope){
                  showNotification('Could not retreive weight.', 'button-assertive', 2000);
                  }
                  })
}

var deparam = function (querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
    var params = {}, pair, d = decodeURIComponent, i;
    // march and parse
    for (i = querystring.length; i > 0;) {
        pair = querystring[--i].split('=');
        params[d(pair[0])] = d(pair[1]);
    }
    
    return params;
};//--  fn  deparam

function createDateAsUTC(date){
    var now = new Date();
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    return now_utc;
}

function js_yyyy_mm_dd_hh_mm_ss() {
    var todayLocal = new Date();
    now = createDateAsUTC(todayLocal);
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function checkForNotification(){
    if (device){
      window.plugin.notification.local.onclick = function (id, state, json) {
          if (id == 1 || id == "1"){
              setTimeout(setupNotificationDaily(), 4000);
          }
      }
    }
}
function setupNotificationDaily(){
    window.plugin.notification.local.cancel(1);
    var nDate = new Date();
    var tDate = new Date();
    nDate.setHours(LocalData.SetReminder.daily.time);
    nDate.setMinutes(LocalData.SetReminder.daily.minutes);
    nDate.setSeconds(0);
    if (tDate.getHours() <= nDate.getHours() && tDate.getMinutes() <= nDate.getMinutes()){
        nDate.setDate(nDate.getDate() + 1);
    }
    setTimeout( function (){window.plugin.notification.local.add({
                                                                 id:         1,
                                                                 date:       nDate,    // This expects a date object
                                                                 message:    "Time to Swork Out. Bring it on.",  // The message that is displayed
                                                                 title:      'Workout Reminder',  // The title of the message
                                                                 repeat:     'daily',
                                                                 autoCancel: true,
                                                                 icon: 'ic_launcher',
                                                                 smallIcon: 'ic_launcher_small'
                                                                 });console.log('daily notification set for: ' + JSON.stringify(nDate));}, 4000);
}

function mergeAlternating(array1, array2) {
    var mergedArray = [];

    for (var i = 0, len = Math.max(array1.length, array2.length); i < len; i++) {
        if (i < array1.length) {
            mergedArray.push(array1[i]);
        }
        if (i < array2.length) {
            mergedArray.push(array2[i]);
        }
    }
    return mergedArray;
}

Date.prototype.getWeek = function(){
    var day_miliseconds = 86400000,
    onejan = new Date(this.getFullYear(),0,1,0,0,0),
    onejan_day = (onejan.getDay()==0) ? 7 : onejan.getDay(),
    days_for_next_monday = (8-onejan_day),
    onejan_next_monday_time = onejan.getTime() + (days_for_next_monday * day_miliseconds),
    first_monday_year_time = (onejan_day>1) ? onejan_next_monday_time : onejan.getTime(),
    this_date = new Date(this.getFullYear(), this.getMonth(),this.getDate(),0,0,0),// This at 00:00:00
    this_time = this_date.getTime(),
    days_from_first_monday = Math.round(((this_time - first_monday_year_time) / day_miliseconds));
    
    var first_monday_year = new Date(first_monday_year_time);
    
    return (days_from_first_monday>=0 && days_from_first_monday<364) ? Math.ceil((days_from_first_monday+1)/7) : 52;
}

function getExercisesList(categoryName){var arr = [];
         for(var exercise in exerciseObject) {
         if (exerciseObject[exercise].category == categoryName){
         arr.push(exerciseObject[exercise])
         }
         }
         arr.sort(function(a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                  });
         return arr;}
var downloadStore;
var errorDownloads = [];
var stillErrors = [];
var totalVideosInstalled = 0;
var downloadableCategories = ['upper','core', 'lower', 'stretch', 'back', 'cardio', 'pilates', 'yoga'];
var assetURL = "http://m.sworkit.com.s3.amazonaws.com/assets/exercises/Videos/android/";
var videoDownloader = {
  updateVideos: function(videoCategory) {
    this.remoteVideos = videoCategory;
    this.downloadVideos();
  },

  updateErrorVideos: function(videoCategory) {
    this.remoteVideos = videoCategory;
    this.retryErrors();
  },

  downloadVideos: function() {
    var _this = this; // for use in the callbacks

    // stop if we've processed all of the videos
    if (this.remoteVideos.length === 0) {
      videoDownloader.updateErrorVideos(errorDownloads);
      return;
    }

    // get the next video from the array
    var videoObject = this.remoteVideos.shift();
    var videoName = videoObject.video;
    console.log(encodeURI(assetURL + videoName));
    console.log(encodeURI(downloadStore + videoName));
    window.resolveLocalFileSystemURL(downloadStore + videoName, function(){
      totalVideosInstalled++;
      if (_this.remoteVideos.length === 0) {
          _this.downloadVideos();
        }
    }, function(){
      var fileTransfer = new FileTransfer();
      fileTransfer.download(encodeURI(assetURL + videoName), downloadStore + videoName, 
      function(entry) {
        console.log("Downloaded: " + videoName);
        if (_this.remoteVideos.length === 0) {
          totalVideosInstalled++;
          _this.downloadVideos();
        }
      }, 
      function(err) {
        console.log("Error downloading: " + videoName);
        errorDownloads.push(videoObject);
        if (_this.remoteVideos.length === 0) {
          _this.downloadVideos();
        }
      }, true);
    });
    if (_this.remoteVideos.length !== 0){
      var videoObject2 = this.remoteVideos.shift();
      var videoName2 = videoObject2.video;
      console.log(encodeURI(assetURL + videoName2));
      console.log(encodeURI(downloadStore + videoName2));
      window.resolveLocalFileSystemURL(downloadStore + videoName2, function(){totalVideosInstalled++;_this.downloadVideos()}, function(){
        var fileTransfer = new FileTransfer();
        fileTransfer.download(encodeURI(assetURL + videoName2), downloadStore + videoName2, 
        function(entry) {
          console.log("Downloaded: " + videoName2);
          totalVideosInstalled++;
          _this.downloadVideos();
        }, 
        function(err) {
          console.log("Error downloading: " + videoName2);
          errorDownloads.push(videoObject2);
          _this.downloadVideos();
        }, true);
      });
    }
    
  }, 

  deleteVideos: function(){
    if (globalExternal){
      downloadStore = cordova.file.externalDataDirectory;
    } else{
      downloadStore = cordova.file.dataDirectory;
    }
    window.resolveLocalFileSystemURL(downloadStore, function(entry){
    function success(entries) {
        var i;
        for (i=0; i<entries.length; i++) {
            console.log(entries[i].remove());
        }
    }

    function fail(error) {
        alert("Failed to list directory contents: " + error.code);
    }

    // Get a directory reader
    var directoryReader = entry.createReader();

    // Get a list of all the entries in the directory
    directoryReader.readEntries(success,fail);

    }, function(){console.log('Failed to find directory to delete from.')})
  },

  listVideos: function(){
    if (globalExternal){
      downloadStore = cordova.file.externalDataDirectory;
    } else{
      downloadStore = cordova.file.dataDirectory;
    }
    window.resolveLocalFileSystemURL(downloadStore, function(entry){
    function success(entries) {
        var i;
        for (i=0; i<entries.length; i++) {
            console.log(entries[i].name);
        }
    }

    function fail(error) {
        alert("Failed to list directory contents: " + error.code);
    }

    // Get a directory reader
    var directoryReader = entry.createReader();

    // Get a list of all the entries in the directory
    directoryReader.readEntries(success,fail);

    }, function(){console.log('Failed to find directory to delete from.')})
  },

  countVideos: function(){
    if (globalExternal){
      downloadStore = cordova.file.externalDataDirectory;
    } else{
      downloadStore = cordova.file.dataDirectory;
    }
    window.resolveLocalFileSystemURL(downloadStore, function(entry){
    function success(entries) {
        var i;
        var downloadCount = 0;
        for (i=0; i<entries.length; i++) {
            downloadCount++;
            if (i == entries.length-1){
              totalVideosInstalled = downloadCount;
              if (downloadCount > 167){
                PersonalData.GetUserSettings.videosDownloaded = true;
                localforage.setItem('userSettings', PersonalData.GetUserSettings);
                //TODO: Alert to the user that they have finished downloads
              }
            }
        }
    }

    function fail(error) {
        alert("Failed to list directory contents: " + error.code);
    }

    // Get a directory reader
    var directoryReader = entry.createReader();

    // Get a list of all the entries in the directory
    directoryReader.readEntries(success,fail);

    }, function(){console.log('Failed to find directory to delete from.')})
  },

  retryErrors: function() {
    var _this = this; // for use in the callbacks

    // stop if we've processed all of the videos
    if (this.remoteVideos.length === 0) {
      console.log(this.remoteVideos);
      checkTotalDownloads();
      //downloadableCategories.shift();
      if (stillErrors.length > 0){
        console.log('Unable to Download all videos. Please try to finish them later.');
        stillErrors = [];
      } else if (downloadableCategories.length > 0) {
        //videoDownloader.updateVideos(getExercisesList(downloadableCategories[0]));
      }
      return;
    }
    
    // get the next video from the array
    var videoObject3 = this.remoteVideos.shift();
    var videoName3 = videoObject3.video;
    console.log(encodeURI(assetURL + videoName3));
    console.log(encodeURI(downloadStore + videoName3));
    window.resolveLocalFileSystemURL(downloadStore + videoName3, function(){_this.downloadVideos()}, function(){
      var fileTransfer = new FileTransfer();
      fileTransfer.download(encodeURI(assetURL + videoName3), downloadStore + videoName3, 
      function(entry) {
        console.log("Downloaded: " + videoName3);
        totalVideosInstalled++;
        _this.retryErrors();
      }, 
      function(err) {
        console.log("Error downloading: " + videoName3);
        stillErrors.push(videoObject3);
        _this.retryErrors();
      }, true);
    });
    
  }
}

function cloneObject(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function downloadAllExercise(){
  if (cordova.file.externalRootDirectory !== null){
    downloadStore = cordova.file.externalDataDirectory;
    localforage.setItem('externalStorage', true);
    globalExternal = true;
  } else{
    downloadStore = cordova.file.dataDirectory;
    localforage.setItem('externalStorage', false);
    globalExternal = false;
  }
  totalVideosInstalled = 0;
  var getUpper = cloneObject(videoDownloader);
  var getCore = cloneObject(videoDownloader);
  var getLower = cloneObject(videoDownloader);
  var getStretch = cloneObject(videoDownloader);
  var getBack = cloneObject(videoDownloader);
  var getYoga = cloneObject(videoDownloader);
  var getPilates = cloneObject(videoDownloader);
  var getCardio = cloneObject(videoDownloader);
  var getExtras = cloneObject(videoDownloader);
  getUpper.updateVideos(getExercisesList('upper'));
  getCore.updateVideos(getExercisesList('core'));
  getLower.updateVideos(getExercisesList('lower'));
  getYoga.updateVideos(getExercisesList('yoga'));
  getPilates.updateVideos(getExercisesList('pilates'));
  getCardio.updateVideos(getExercisesList('cardio'));
  getStretch.updateVideos(getExercisesList('stretch'));
  getBack.updateVideos(getExercisesList('back'));
  getExtras.updateVideos([{"name":"Break","image":"Break.jpg","youtube":"rN6ATi7fujU","switchOption":false,"video":"Break.mp4","category":false}]);
}
 
function checkTotalDownloads(){
  videoDownloader.countVideos();
  return totalVideosInstalled;
}

function downloadProgress(){
  var timeoutMax = 150000;
  var timeoutCount = 0;
  var notifyEl = angular.element(document.getElementById('status-notification'));
  var progressInterval = setInterval(function(){
      notifyEl.html('<div style="background-color:#2B2B2B;height:45px;width:100%;position:absolute;bottom:0px"><p style="margin-bottom:0px;color:#24CC92;font-size:14px;padding-top:11px;text-align:center;">Downloading Exercise ' + totalVideosInstalled + ' of 168</p><div style="height:4px;background-color:#24CC92;position: absolute;bottom: 0px;width:' + ((totalVideosInstalled/168)*100)+ '%"></div></div>"');
      if (totalVideosInstalled > 167){
        notifyEl.html('<button class="button button-full button-calm fade-out-custom">Downloads Complete</button>');
        PersonalData.GetUserSettings.videosDownloaded = true;
        PersonalData.GetUserSettings.autoPlay = true;
        setTimeout(function(){notifyEl.html('')}, 1500);
        clearInterval(progressInterval);
      }
      timeoutCount = timeoutCount + 1500;
      if (timeoutCount > timeoutMax){
        navigator.notification.confirm(
              'Downloads are taking longer than expected. What would you like to do?',
               function(buttonIndex){
                if (buttonIndex == 2){
                  timeoutMax = timeoutMax + 150000;
                  downloadProgress();
                  downloadAllExercise();
                } else {
                  notifyEl.html('<button class="button button-full button-assertive">Download Failed: Retry in Settings</button>');
                  setTimeout(function(){notifyEl.html('')}, 2000);
                }
               },
              'Download Progress',
              ['Try Later','Continue Download']
            );

        clearInterval(progressInterval);
      }
    }, 1500);
}

function onResume() {
  console.log('On Resume');
  if (hasInit){
    kiip.startSession(function(){
      console.log("Kiip Resume: success");
    },
    function(){
      console.log("Kiip Resume: failure");
    });
  }
  var currentLocation = window.location.hash.slice(-7);
  if (currentLocation == "workout"){
    playInlineVideo(TimingData.GetTimingSettings.autoPlay);
  }
}
function onResumeIOS(){
    var currentLocation = window.location.hash.slice(-7);
    if (currentLocation == "workout"){
        playInlineVideo(TimingData.GetTimingSettings.autoPlay);
    }
}
function onPause() {
  console.log('On Pause');
  if (hasInit){
    kiip.endSession(function(){
      console.log("Kiip Pause: success");
    },
    function(){
      console.log("Kiip Pause: failure");
    });
  }
}
function isAmazon(){
  return false;
}