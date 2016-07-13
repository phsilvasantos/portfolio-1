angular.module('starter.controllers', [])

/*
TODO FREE
- Compare config.xml for iOS between Sworkit and Sworkit Pro
- After Enable Healtkit button at end of workout is used, Angular isn't updating the text without a tap

TODO
- Add additional reminders
- Custom Kiip notification Android
- Android Drawer Side menu
- Native Low Latency Audio Changes - DONE on iOS, need Android possibly

NEED TO VERIFY
- Improve audio options for next exercise warnings (added as option in Settings, would like feedback)
- give user a calculation of total time estimate - not really possible because you don't know how long they are going to workout

COMPLETE
- Default transition set to 0
- No more back to back pushup exercises during Upper Body
- Inline video play
- Option to turn video off?
- Control the video button
- Select all of a category while building custom workout
- Alphabatize add exercise to reorder
- After second 30 seconds. Time says 3:60 instead of 4:00
- SessionM, disable for international users without access
- Check for Amazon and choose appropriate store
- Check if Nexercise is installed to hide 'banner'
- add new exercises and videos (yoga, redo, pilates)
- Added Pilates Workout
- Help Section
  -TOS, Privacy...
- MyFitnessPal Connnection - done and tested
- Add database - need to test device further on legacy data
- Post workout share - done
- onPause and onResume for Google Analytics and Kiip
- Welcome Screen - also launched from Help-Tutorial (Ben, please review)
- Add ability to go back an exercise with swipe
- Add ability to hide show exercises in downloadable custom workouts
- Add ability to add exercises when changing order of custom workout
- backButton for Android
- Post workout screen - done (open for design changes)
- Add localStorage or localForage data - test device further on legacy data
- URL Schemes (Don't forget to change everything to sworkit:// and sworkitpro://)
- Cross Promotion for Nexerice 
- Google Analytics
- 7-Minute workout configuration
- SessionM - done
- Log - done
- Info for all workouts with (i) button at top right
- Progress counters - done
- Progress graphs - done
- Stats screens - done
- Help Section
  -FAQ - done
  -Send feedback - done
  -Rate Sworkit - done
- Smart weight settings - done
- Smart goals - done
- import custom workouts - done, possibly add loading backdrop
- Reminders - done testing
- Refresh button for Available Custom Workouts - done
- Swipe to skip exercise - done
- download custom workouts - done
- Sync MFP weight - done
- Kiip - done
- Record Side Bend videos - assumed done with new videos

ANDROID CHECKLIST
- Nav title left align - DONE
- Nav buttons android-esque - DONE
- Roboto?
- Nav bar fixed under sidebar
- Actionsheet replaced - DONE
- Toggles - PARTIAL FIX
- Range Select - PARTIAL FIX

SWORKIT FREE CHECKLIST
- Update rate links
- Add upgrade to Sworkit Pro options promos
- Remove ability to disable rewards
- Limit settings and goals
- Change end-workout modal to remove goals
- Lock on progress and logs
- Lock on saving mulitple custom workouts
- Lock on 7-minute workout / bonus workouts
- Lock on Advanced Timing options and add toggle for transition pause
- Change in-workout audio options
- Any need to update notifications?

*/

.controller('BodyCtrl', function($rootScope, $scope,$http,$location,$timeout,$ionicLoading,$stateParams) {
  window.cb = '';
  $scope.callCustom = function(url){
    var schemaParams = deparam(url);
    if (schemaParams["workout"]){
        $ionicLoading.show({
          template: 'Importing workout...'
        });
        var getUrl = 'http://sworkitapi.herokuapp.com/workouts?s=' + schemaParams["workout"] + '&d=true';
        $http.get(getUrl).then(function(resp){
            if (resp.data.name){
               installWorkout(resp.data.name, resp.data.exercises);
               $timeout(function(){
                var tempLocation = $location.$$url.slice(-7);
                $ionicLoading.hide();
                if (tempLocation !== "workout"){
                  $location.path('/app/custom');
                }
               }, 1000)
             } else {
              $ionicLoading.hide();
                navigator.notification.alert(
                  'Unable to download this workout. Please check the link.',  // message
                  nullHandler,         // callback
                  'Invalid Custom Workout',            // title
                  'OK'                  // buttonName
                );
             }
           }, function(err) {
                $ionicLoading.hide();
                navigator.notification.alert(
                  'Unable to download this workout. Please check the link.',  // message
                  nullHandler,         // callback
                  'Invalid Custom Workout',            // title
                  'OK'                  // buttonName
                );
            })
    }
    else if(schemaParams["access_code"]){
        $ionicLoading.show({
          template: 'Authorizing..'
        });
        console.log('access_code: ' + schemaParams);
        myObj.code = schemaParams["access_code"];
        $timeout(function(){
                var tempLocation = $location.$$url.slice(-7);
                $ionicLoading.hide();
                if (tempLocation !== "workout"){
                  $location.path('/app/settings');
                  setTimeout(function(){$rootScope.childBrowserClosed()}, 500);
                }
               }, 1000)
       
        if (window.cb.close){
          window.cb.close();
        }
    }
    else if(schemaParams["mfperror"]){
        console.log('mfperror: ' + schemaParams);
        window.cb.close();
        $rootScope.childBrowserClosed();
    }
  }
})

.controller('AppCtrl', function($rootScope,$scope,$ionicModal,$ionicSlideBoxDelegate,$timeout,$location,$stateParams,WorkoutService) {

  $scope.clickHome = function(){
    var tempURL = $rootScope.$viewHistory.currentView.url.substring(0,9);
    if (tempURL == '#/app/cust') {
      $location.path('/app/custom');
    } else if (tempURL !== '/app/home'){
      $location.path('/app/home');
    }
  }
  $scope.isItemActive = function(shortUrl) {
    var tempURL = '/app/' + shortUrl;
    return (tempURL == $location.$$path.substring(0,9));
  };
  $scope.showWelcome = function(){
    $ionicModal.fromTemplateUrl('welcome.html', function(modal) {
                                  $scope.welcomeModal = modal;
                                  }, {
                                  scope:$scope,
                                  animation: 'slide-in-up',
                                  focusFirstInput: false,
                                  backdropClickToClose: false
                                  });
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
    $scope.closeOpenNexercise = function(){
      $scope.closeModal();
    }
    $scope.openModal = function() {
      $scope.welcomeModal.show();
    };
    $scope.closeModal = function() {
      $scope.welcomeModal.hide();
    };
    $scope.$on('$destroy', function() {
      $scope.welcomeModal.remove();
    });
    $timeout(function(){
             $scope.openModal();
             }, 0);
  }
  $scope.downloadNexerciseMenu = function(){
    trackEvent('More Action', 'Install Nexercise', 0);
    setTimeout(function(){
      if (device.platform.toLowerCase() == 'ios') {
        window.open('http://nxr.cz/nex-ios', '_system', 'location=no,AllowInlineMediaPlayback=yes');
      }  else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=com.nexercise.client.android', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=com.nexercise.client.android"), '_system');}
             );
      } else {
      window.open('market://details?id=com.nexercise.client.android', '_system')
      }
    }, 400)
  }
})

.controller('HomeCtrl', function($rootScope, $scope, $timeout, $ionicSideMenuDelegate, $location, $ionicPopup, $stateParams, UserService) {
  LocalHistory.getCustomHistory.lastHomeURL = $rootScope.$viewHistory.currentView.url;
  $scope.timesUsedVar = parseInt(window.localStorage.getItem('timesUsed'));
  $scope.showRateOption = globalRateOption;
  $scope.rewardSettings = UserService.getUserSettings();
  $rootScope.showPointsBadge = false;
  $rootScope.mPointsTotal = 0;
  // if (timesUsedVar % 2 == 0){
  //   angular.element(document.getElementsByClassName('category-card')).addClass('group-two');
  // }
  $scope.nexerciseInstalled = nexerciseInstalledGlobal.status;
  $timeout(function(){
    $scope.nexerciseInstalled = nexerciseInstalledGlobal.status;
    $scope.showRateOption = globalRateOption;
    $scope.rewardSettings = UserService.getUserSettings();
    if ($rootScope.sessionMAvailable && $scope.rewardSettings.mPoints){
      document.getElementById('home-points').classList.remove( "ng-hide" );
    }
  }, 1000);
  $timeout(function(){
    $scope.nexerciseInstalled = nexerciseInstalledGlobal.status;
    $scope.showRateOption = globalRateOption;
    $scope.rewardSettings = UserService.getUserSettings();
    if ($scope.rewardSettings.mPoints && device && $rootScope.sessionMAvailable){
      sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
          $rootScope.showPointsBadge = (data.unclaimedAchievementCount > 0) ? true : false;
          $rootScope.mPointsTotal = data.unclaimedAchievementCount;
      });
    } else {
      $rootScope.showPointsBadge = false;
    }
    $scope.remindPopup();
  }, 2500);
  $scope.launchMPoints = function(){
    if (device){
      sessionm.phonegap.presentActivity(2);
    }
  }
  $scope.rateApp = function(){
    $scope.showRateOption = false;
    globalRateOption = false;
    localforage.setItem('ratingHome', {show:false,past:true}, function(){
      $timeout(function(){
       upgradeNotice(2);
      }, 200);
    });
  }
  $scope.remindPopup = function(){
    if (globalRemindOption){
      globalRemindOption = false;
      localforage.setItem('remindHome', {show:false,past:true}, function(){
        $timeout(function(){
          $ionicPopup.confirm({
               title: 'Set a Workout Reminder?',
               template: '<p class="padding">Setting reminders can help you stay focused and meet your goals.</p>',
               okType: 'energized',
               cancelText: 'Not Now'
             }).then(function(res) {
               if(res) {
                $location.path('/app/reminders');
                $ionicSideMenuDelegate.toggleLeft(false);

               }
             });

        }, 200);
      });
    }    
  }
  $scope.downloadNexercise = function (){
    trackEvent('More Action', 'Install Nexercise', 0);
    setTimeout(function(){
      if (device.platform.toLowerCase() == 'ios') {
        window.open('http://nxr.cz/nex-ios', '_system', 'location=no,AllowInlineMediaPlayback=yes');
      }  else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=com.nexercise.client.android', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=com.nexercise.client.android"), '_system');}
             );
      } else {
      window.open('market://details?id=com.nexercise.client.android', '_system')
      }
    }, 400)
  }
})

.controller('WorkoutCategoryCtrl', function($rootScope, $scope, $stateParams, WorkoutService) {
  LocalHistory.getCustomHistory.lastHomeURL = $rootScope.$viewHistory.currentView.url;
  $scope.timesUsedVar = parseInt(window.localStorage.getItem('timesUsed'));
  $scope.thisCategory = $stateParams.categoryId;
  $scope.categoryTitle = LocalData.GetWorkoutCategories[$stateParams.categoryId].fullName;
  $scope.categories = WorkoutService.getWorkoutsByCategories($stateParams.categoryId);
  $scope.workoutTypes = WorkoutService.getWorkoutsByType();
  $scope.data = {showInfo:false}
})

.controller('WorkoutCustomCtrl', function($rootScope, $scope, $ionicModal, $ionicLoading, $ionicPopup, $ionicListDelegate, $http, $ionicActionSheet, $ionicScrollDelegate, $location, $timeout, filterFilter, UserService, WorkoutService) {
  LocalHistory.getCustomHistory.lastHomeURL = $rootScope.$viewHistory.currentView.url;
  $scope.customWorkouts = UserService.getCustomWorkoutList();
  if (ionic.Platform.isAndroid()){
    $scope.androidPlatform = true;
  } else{
    $scope.androidPlatform = false;
  }
  $scope.editMode = false;
  $scope.customName = '';
  $scope.currentCustom = UserService.getCurrentCustom();
  $scope.exerciseCategories = [
    {shortName:"upper",longName:"Upper Body", exercises: WorkoutService.getExercisesByCategory('upper') },
    {shortName:"core",longName:"Core Strength", exercises: WorkoutService.getExercisesByCategory('core') },
    {shortName:"lower",longName:"Lower Body", exercises: WorkoutService.getExercisesByCategory('lower') },
    {shortName:"stretch",longName:"Stretches", exercises: WorkoutService.getExercisesByCategory('stretch') },
    {shortName:"back",longName:"Back Strength", exercises: WorkoutService.getExercisesByCategory('back') },
    {shortName:"cardio",longName:"Cardio", exercises: WorkoutService.getExercisesByCategory('cardio') },
    {shortName:"pilates",longName:"Pilates", exercises: WorkoutService.getExercisesByCategory('pilates') },
    {shortName:"yoga",longName:"Yoga", exercises: WorkoutService.getExercisesByCategory('yoga') }
  ];
  $scope.allExercises = [];
  for(var eachExercise in exerciseObject) {
    $scope.allExercises.push(exerciseObject[eachExercise].name);
  }
  $timeout(function(){
    $scope.allExercises.sort();
  }, 1500)
  $scope.listOptions = [
      { text: "Featured", value: "featured" },
      { text: "Popular", value: "popular" }
  ];
  $scope.optionSelected = {
      listType : 'featured'
  };
  $scope.toggleLists = function(){
    if ($scope.optionSelected.listType == 'popular'){
      $scope.downloadedWorkouts = popularWorkouts;
    } else {
      $scope.downloadedWorkouts = downloadableWorkouts;
    }
    
  }
  $scope.addExercise = function(){
    if ($scope.selectedExerciseAdd.selected !== ''){
      $scope.reorderWorkout.push($scope.selectedExerciseAdd.selected);
    }
  }
  $scope.selectedExerciseAdd = {selected: ''};
  $scope.workoutLengths = function(){
    PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.workout.length == 1){element.total = "1 Exercise"} else{element.total = element.workout.length + ' Exercises'}});
  }
  $scope.workoutLengths();
  $scope.editAll = function(){
    if ($scope.editMode){
      angular.element(document.getElementsByClassName('my-customs')).removeClass('edit-mode');
      angular.element(document.getElementsByClassName('item-options')).addClass('invisible');
    }
    else{
      angular.element(document.getElementsByClassName('item-options')).removeClass('invisible');
      angular.element(document.getElementsByClassName('my-customs')).addClass('edit-mode');
    }
    $scope.editMode = !$scope.editMode;
  }
  $scope.shareCustom = function(indexEl, customObjName) {
    var selectedWorkout;
    PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == customObjName){selectedWorkout = element}}); 
    if (selectedWorkout.shareUrl){
      var postURL = 'http://sworkitapi.herokuapp.com/workouts?s=' + selectedWorkout.shareUrl;
    } else{
      var postURL = 'http://sworkitapi.herokuapp.com/workouts';
    }
    $http({
        url: postURL,
        method: "POST",
        data: JSON.stringify({name:customObjName, exercises: selectedWorkout.workout}),
        headers: {'Content-Type': 'application/json'}
      }).then(function(resp){
            selectedWorkout.shareUrl = resp.data.shortURI;
            //TODO: Update this URL with swork.it
            var customMessage = 'Try my workout, ' + resp.data.name + '. Get it now at http://m.sworkit.com/share?w=' + resp.data.shortURI;
            if (device){
              window.plugins.socialsharing.share(customMessage, null, null);
            } else {
              console.log('Share: http://m.sworkit.com/share?w=' + resp.data.name);
            }
          }, function(err) {
            navigator.notification.alert(
                  'Uh oh. Very sorry, but something went wrong. Please try again later. ',  // message
                  nullHandler,         // callback
                  'Share Failed',            // title
                  'OK'                  // buttonName
                );
          $ionicListDelegate.closeOptionButtons();
      });
  }
  $scope.editCustom = function(indexEl, customObjName) {
    if (device && device.platform.toLowerCase() == 'ios'){
      $ionicActionSheet.show({
       buttons: [
         { text: '<b>Add and Remove Exercises</b>' },
         { text: 'Rename' },
       ],
       destructiveText: 'Delete',
       titleText: 'Edit custom workout',
       cancelText: 'Cancel',
       buttonClicked: function(indexNum) {
         $scope.actionButtonClicked(indexNum);
         return true;
       },
       cancel: function(indexNum) {
         $scope.actionCancel(indexNum);
         return true;
       },
       destructiveButtonClicked : function(indexNum) {
         $scope.actionDestructiveButtonClicked(indexNum);
         return true;
       }
     });
      $scope.actionPopup = {
        close : function(){
        }
      }
    } else{
      $scope.actionPopup = $ionicPopup.show({
      title: 'Edit custom workout',
      subTitle: '',
      scope: $scope,
      template: '<div class="action-button" style="padding-bottom:10px"><button class="button button-full button-stable" ng-click="actionButtonClicked(0)">Add and Remove Exercises</button><button class="button button-full button-stable" ng-click="actionButtonClicked(1)">Rename</button><button class="button button-full button-stable assertive-action" ng-click="actionDestructiveButtonClicked()">Delete</button><button class="button button-full button-stable" ng-click="actionCancel()" style="text-align:center;padding-left:0px;margin-bottom:-10px">Cancel</button></div>',
      buttons: []
    });
    }
    $scope.actionButtonClicked =function(indexNum) {
       var selectedItem;
       PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == customObjName){selectedItem = element;}});
       if (indexNum == 0){
        $scope.currentCustom = selectedItem.workout;
        console.log($scope.currentCustom);
        $scope.editMode = true;
        $scope.customName = customObjName;
        $scope.createCustom();
        $scope.actionPopup.close();
       } else if (indexNum == 1){
          $ionicPopup.prompt({
             title: 'New Workout Name:',
             cancelText: 'Cancel',
             inputType: 'text',
             template: '<input ng-model="data.response" type="text" autofocus class="ng-pristine ng-valid">',
             inputPlaceholder: selectedItem.name,
             okText: 'Save',
             okType: 'energized'
             }).then(function(res) {
                if (res && res.length > 1){
                  selectedItem.name = res;
                  localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                }
                $scope.actionPopup.close();
          });
       }
       $ionicListDelegate.closeOptionButtons();
     },
     $scope.actionCancel = function(indexNum) {
       $ionicListDelegate.closeOptionButtons();
       $scope.actionPopup.close();
     };
     $scope.actionDestructiveButtonClicked  = function(indexNum) {
       PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == customObjName){PersonalData.GetCustomWorkouts.savedWorkouts.splice(index, 1);localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);}});                                
       $ionicListDelegate.closeOptionButtons();
       $scope.actionPopup.close();
     }
  }
  $scope.createCustom = function(){
    $ionicLoading.show({
                  template: 'Gathering exercises...',
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  duration:5000
              });
    $timeout(function(){
              $scope.createCustomOpen();
             }, 500);
  }
  $scope.createCustomOpen = function(){
    $ionicModal.fromTemplateUrl('custom-workout.html', function(modal) {
                                  $scope.customModal = modal;
                                  }, {
                                  scope:$scope,
                                  animation: 'fade-implode',
                                  focusFirstInput: false,
                                  backdropClickToClose: false,
                                  hardwareBackButtonClose: false
                                  });
    $timeout(function(){
              $scope.openCreateCustom();
             }, 100);
    $scope.openCreateCustom = function() {
      $scope.customModal.show();
    };
    $scope.cancelCreateCustom = function() {
      $scope.customModal.hide();
      $scope.editMode = false;
      $scope.currentCustom = UserService.getCurrentCustom();
      PersonalData.GetWorkoutArray.workoutArray = $scope.selectedExercises();
    };
    $scope.resetCustom = function() {
      if (device){
            navigator.notification.confirm(
              'Are you sure you want to clear these selections?',
               function(buttonIndex){
                if (buttonIndex == 2){
                  for(var exercise in exerciseObject) {
                    exerciseObject[exercise].selected = false;
                  }
                  PersonalData.GetWorkoutArray.workoutArray = [];
                  $scope.$apply();
                }
               },
              'Reset Custom Workout',
              ['Cancel','OK']
            );
      } else{
        $ionicPopup.confirm({
             title: 'Reset Custom Workout',
             template: '<p class="padding">Are you sure you want to clear these selections?</p>',
             okType: 'energized'
           }).then(function(res) {
             if(res) {
              for(var exercise in exerciseObject) {
                exerciseObject[exercise].selected = false;
              }
              PersonalData.GetWorkoutArray.workoutArray = [];
              $scope.$apply();
             }
           });
      }
    }
    for(var exercise in exerciseObject) {
        exerciseObject[exercise].selected = false;
    }
    $scope.currentCustom.forEach(function(element, index, array){exerciseObject[element].selected = true});
    $scope.selectedExercises = function selectedExercises() {
      var arrUse = [];
      for(var thisExercise in exerciseObject) {
        if (exerciseObject[thisExercise].selected){
          arrUse.push(exerciseObject[thisExercise].name);
        }
      }
      return arrUse;
    };
    $timeout(function(){
              $ionicLoading.hide();
             }, 1000);
    $scope.$on('$destroy', function() {
      $scope.customModal.remove();
    });
    $timeout(function(){
            angular.element(document.getElementsByClassName('body')).removeClass('loading-active');
              $ionicLoading.hide();
             }, 6000);
    };
    $scope.toggleAll = function(shortCat, indexN){
      var indexID = angular.element(document.getElementById('cat' + indexN));
      indexID.toggleClass('group-active');
      if (indexID.hasClass('group-active')){
        $scope.exerciseCategories[indexN].exercises.forEach(function(element, index, array){exerciseObject[element.name].selected = true});
      } else {
        $scope.exerciseCategories[indexN].exercises.forEach(function(element, index, array){exerciseObject[element.name].selected = false});
      }

    }
    $scope.saveCustom = function() {
      PersonalData.GetWorkoutArray.workoutArray = $scope.selectedExercises();
      localforage.setItem('currentCustomArray', PersonalData.GetWorkoutArray);
      if ($scope.editMode){
        var fillTitle = 'Save Changes to ' + $scope.customName + '?';
        if (device){
            navigator.notification.confirm(
              '',
               function(buttonIndex){
                if (buttonIndex == 2 && $scope.selectedExercises().length > 0){
                  PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == $scope.customName){element.workout = $scope.selectedExercises();localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);}});                                
                  $scope.editMode = false;
                  $scope.currentCustom = UserService.getCurrentCustom();
                  $scope.customModal.hide();
                  $scope.workoutLengths();
                }
               },
              fillTitle,
              ['Cancel','OK']
            );
        } else {
            $ionicPopup.confirm({
               title: fillTitle,
               template: '',
               okType: 'energized'
             }).then(function(res) {
               if (res && $scope.selectedExercises().length > 0){
                  PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == $scope.customName){element.workout = $scope.selectedExercises();localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);}});                                
                  $scope.editMode = false;
                  $scope.currentCustom = UserService.getCurrentCustom();
                  $scope.customModal.hide();
                  $scope.workoutLengths();
                }
             });
           }
      } else {
        $ionicPopup.prompt({
                     title: 'Name this workout',
                     text: 'This will replace your current custom workout. With Sworkit Pro you can save multiple custom workouts.',
                     cancelText: 'Cancel',
                     inputType: 'text',
                     template: '<input ng-model="data.response" type="text" autofocus class="ng-pristine ng-valid">',
                     inputPlaceholder: 'name',
                     okText: 'Save',
                     okType: 'energized'
                     }).then(function(res) {
                        if (res.length > 1 && $scope.selectedExercises().length > 0){
                          PersonalData.GetCustomWorkouts.savedWorkouts[0] = {"name": res,"workout": $scope.selectedExercises()};
                          localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                          $scope.editMode = false;
                          $scope.currentCustom = UserService.getCurrentCustom();
                          $scope.customModal.hide();
                          $scope.workoutLengths();
                        }
                        });
    };
    $scope.$on('$destroy', function() {
      $scope.customModal.remove();
    });
    $timeout(function(){
             $scope.openCreateCustom();
             }, 0);
  }

  $scope.reorderCustom = function(passedWorkout){
    $scope.passedWorkoutSave = passedWorkout;
    $ionicModal.fromTemplateUrl('custom-workout-reorder.html', function(modal) {
                                  $scope.customModal2 = modal;
                                  }, {
                                  scope:$scope,
                                  animation: 'fade-implode',
                                  focusFirstInput: false,
                                  backdropClickToClose: false,
                                  hardwareBackButtonClose: false
                                  });
    
    $scope.reorderWorkout = passedWorkout.workout;
    $scope.data = {showReorder:true,showDelete: false};
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.reorderWorkout.splice(fromIndex, 1);
      $scope.reorderWorkout.splice(toIndex, 0, item);
    };
    $scope.onItemDelete = function(item) {
      $scope.reorderWorkout.splice($scope.reorderWorkout.indexOf(item), 1);
    };
    $scope.openReorderCustom2 = function() {
      $scope.customModal2.show();
    };
    $scope.cancelReorderCustom = function() {
      $scope.customModal2.hide();
      $scope.editMode = false;
    };
    $scope.saveReorder = function() {
        var fillTitle = 'Save Changes to ' + $scope.customName + '?';
        if (device){
          navigator.notification.confirm(
          '',
           function(buttonIndex){
            if (buttonIndex == 2){
                                PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == $scope.passedWorkoutSave.name){element.workout = $scope.passedWorkoutSave.workout;localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);}});                                
                  $scope.editMode = false;
                  $scope.customModal2.hide();
                  $scope.workoutLengths();            }
           },
          fillTitle,
          ['Cancel','OK']
          );
        } else{
            $ionicPopup.confirm({
               title: fillTitle,
               template: '',
               okType: 'energized'
             }).then(function(res) {
               if (res){
                  PersonalData.GetCustomWorkouts.savedWorkouts.forEach(function(element, index, array){if (element.name == $scope.passedWorkoutSave.name){element.workout = $scope.passedWorkoutSave.workout;localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);}});                                
                  $scope.editMode = false;
                  $scope.customModal2.hide();
                  $scope.workoutLengths();
                }
             });
        }
    };
    $scope.$on('$destroy', function() {
      $scope.customModal2.remove();
    });
    $timeout(function(){
             $scope.openReorderCustom2();
             }, 0);
  }

  $scope.selectCustom = function(selectedCustom){
    LocalData.GetWorkoutTypes.customWorkout = { id: 100, activityWeight: 6, activityMFP: "134026252709869", activityNames: selectedCustom.name, exercises: selectedCustom.workout},
    $location.path('/app/home/2/customWorkout');
  }
  $scope.downloadedWorkouts = downloadableWorkouts;

  $scope.openDownLink = function(url){
      window.open(url, '_blank', 'location=no,AllowInlineMediaPlayback=yes');
  }
  $scope.showExercises = function(workoutPassed, index){
    var notifyEl = angular.element(document.getElementById('item' + index));
    notifyEl.addClass('green-text');
    $timeout(function(){
      notifyEl.removeClass('green-text');
    }, 1000)
    var tempString = JSON.stringify(workoutPassed.exercises);
    tempString = tempString.replace(/"/g,' ');
    tempString = tempString.replace(/\[/g,'');
    tempString = tempString.replace(/\]/g,'');
    workoutPassed.exercises_view = tempString;
    workoutPassed.show = true;
  }
  $scope.hideExercises = function(workoutPassed){
    workoutPassed.show = false;
  }
  $scope.toggleExercises = function(workoutPassed, index){
    if (workoutPassed.show){
      $scope.hideExercises(workoutPassed);
    } else{
      $scope.showExercises(workoutPassed, index);
    }
  }
  $scope.addCustomWorkout = function(workid, index){
    var selectWorkout;
    $scope.downloadedWorkouts.forEach(function(element, index, array){if (element.shortURI == workid){selectWorkout = element}});
    if (device){
        navigator.notification.confirm(
                                       'This will replace your current custom workout. With Sworkit Pro you can save multiple custom workouts.',
                                       function(button){
                                        if (button == 2){
      var notifyEl = angular.element(document.getElementById('item' + index)).removeClass('ion-plus').addClass('ion-checkmark');
      $timeout(function(){
        angular.element(document.getElementById('item' + index)).removeClass('ion-checkmark').addClass('ion-plus');
      }, 3000)

      PersonalData.GetCustomWorkouts.savedWorkouts[0] = {"name": selectWorkout.name,"workout": selectWorkout.exercises};
      localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
      trackEvent('Download Custom', selectWorkout.workout_name, 0);
      $ionicScrollDelegate.scrollTop(true);

      $scope.workoutLengths();}},
                                       'Install Custom Workout?',
                                       ['Cancel','OK']
                                       );
    }
  }
  $scope.addCustomConfirm = function(button){

  }
  $scope.shareWorkout = function(workid){
    var selectWorkout;
    $scope.downloadedWorkouts.forEach(function(element, index, array){if (element.shortURI == workid){selectWorkout = element}});
    //TODO: Update this URL with swork.it
    workoutMessage = 'This ' + selectWorkout.shortURI + ' workout is awesome! Check it out: http://m.sworkit.com/share?w=' + selectWorkout.shortURI;
    if (device){
      window.plugins.socialsharing.share(workoutMessage, null, null);
    } else {
      console.log('Share: http://m.sworkit.com/share?w=' + selectWorkout.shortURI)
    }
  }
  $scope.updateDownloads = function(){
    getDownloadableWorkouts($http, true, $scope.optionSelected.ListType);
    $timeout(function(){
      $scope.$apply();
    }, 3000)
  }
})

.controller('WorkoutTimeCtrl', function($rootScope, $scope, $stateParams,$location,$timeout,$ionicModal,$ionicPopup,WorkoutService, UserService) {
  LocalHistory.getCustomHistory.lastHomeURL = $rootScope.$viewHistory.currentView.url;
  $scope.thisType = WorkoutService.getTypeName($stateParams.typeId);
  $scope.typeName = $stateParams.typeId;
  $scope.advancedTiming = WorkoutService.getTimingIntervals();
  $scope.userSettings = UserService.getUserSettings();
  if (ionic.Platform.isAndroid() && device){
    $scope.advancedTiming.autoPlay = PersonalData.GetUserSettings.videosDownloaded;
  }
  $scope.sevenTiming = WorkoutService.getSevenIntervals();
  $scope.yogaSelection = false;
  $scope.sevenMinuteSelection = false;
  $scope.times = {lengths: [{id:5, text:5}, {id:10, text:10}, {id:15, text:15}, {id:20, text:20}, {id:30, text:30}, {id:45, text:45}]}
  if ($stateParams.typeId == 'sevenMinute') {
    $scope.sevenMinuteSelection = true;
    $scope.times = {lengths: [{id:7, text: '1 set'}, {id:14, text: '2 sets'}, {id:21, text: '3 sets'}, {id:28, text: '4 sets'}, {id:35, text: '5 sets'}, {id:42, text: '6 sets'}]}
  }
  if ($stateParams.typeId == 'sunSalutation' || $stateParams.typeId == 'fullSequence'){
    $scope.yogaSelection = true;
  }
  $scope.watchTiming = function(){
    if(!$scope.advancedTiming.transition){
      $scope.advancedTiming.transitionTime = 0;
      localforage.setItem('timingSettings',$scope.advancedTiming);
    } else {
      $scope.advancedTiming.transitionTime = 5;
      localforage.setItem('timingSettings',$scope.advancedTiming);
    }

  }
  $scope.customLength = function (){
        $ionicPopup.prompt({
                           title: 'Enter Workout Length',
                           okText: '',
                           inputType: 'number',
                 inputPlaceholder: $scope.advancedTiming.workoutLength,
                 template: '<input id="customLength" ng-model="data.response" autofocus type="tel" class="ng-pristine ng-valid">',
                 okText: 'Begin',
                 okType: 'energized'
                           }).then(function(res) {
                                 if (typeof res === 'undefined'){

                                } else {
                                  var totalLength = document.getElementById("customLength").value;
                                  totalLength = parseInt(totalLength);
                                  if (typeof totalLength  === 'number' && !isNaN(totalLength)){
                                    $scope.advancedTiming.workoutLength = totalLength;
                                    $location.path('/app/home/' + $scope.thisCategory + '/' + $stateParams.typeId + '/' + $scope.advancedTiming.workoutLength + '/workout');
                                  }
                                }
                            });

        $timeout(function(){
          if (!isNaN($scope.advancedTiming.workoutLength)){
            document.getElementById("customLength").value = $scope.advancedTiming.workoutLength;
            $scope.$apply();  
          }
        }, 1500)
  }

})

.controller('WorkoutCtrl', function($rootScope, $scope, $stateParams,$ionicModal,$ionicPopup,$ionicPlatform,$ionicNavBarDelegate,$ionicSideMenuDelegate, $http, $ionicSlideBoxDelegate, $sce,$location,$timeout,$interval, WorkoutService, UserService) {
  LocalHistory.getCustomHistory.lastHomeURL = $rootScope.$viewHistory.currentView.url;
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.healthKitData = {healthKitAvailable: false, showHealthKitOption: false, healthKitStatus: ''}
  if (!ionic.Platform.isAndroid()) {
    if (device){
      window.plugins.healthkit.available(
                                               function(result){
                                                if (result == true){
                                                  $scope.healthKitData.healthKitAvailable = true;
                                                }
                                               },
                                               function(){
                                                  $scope.healthKitData.healthKitAvailable = false;
                                               }
                                        );
    } else {
      //Available in browser for testing purposes
      $scope.healthKitData.healthKitAvailable = true;
    }
  }
  $scope.androidHeader = function(){
    if (ionic.Platform.isAndroid()){
      $scope.androidPlatform = true;
      $scope.iOSPlatform = false;
      angular.element(document.getElementsByClassName('title')).addClass('title-center');
      $ionicNavBarDelegate.align('center');
      if (ionic.Platform.version() >= 4.4){
        $scope.isKitKat = true;
      } else{
        $scope.isKitKat = false;
      }
    } else{
      $scope.androidPlatform = false;
      $scope.iOSPlatform = true;
    }
  }
  $scope.androidHeader();
  
  $timeout(function(){
    $scope.androidHeader();
  }, 800);
  //TODO: Ryan, make this available in settings
  $scope.advancedTiming = WorkoutService.getTimingIntervals();
  $scope.userSettings = UserService.getUserSettings();
  $scope.sevenTiming = WorkoutService.getSevenIntervals();
  $scope.previousExercise = false;
  $scope.endModalOpen = false;
  $scope.unloadQueue = [];
  $scope.ratingRequest = {status:false,message:'', number:0};
  $scope.yogaSelection = false;
  var allWorkouts = WorkoutService.getWorkoutsByType();
  $scope.chosenWorkout = allWorkouts[$stateParams.typeId];
  //Get workout array
  $scope.currentWorkout = [];
  if ($scope.chosenWorkout.exercises){
    $scope.currentWorkout = $scope.currentWorkout.concat($scope.chosenWorkout.exercises);
  } else if ($stateParams.typeId == "fullBody"){
    $scope.currentWorkout = $scope.currentWorkout.concat(allWorkouts['upperBody'].exercises.concat(allWorkouts['lowerBody'].exercises,allWorkouts['coreExercise'].exercises));
  } else if ($stateParams.typeId == "anythingGoes"){
    $scope.currentWorkout = $scope.currentWorkout.concat(allWorkouts['upperBody'].exercises.concat(allWorkouts['lowerBody'].exercises,allWorkouts['coreExercise'].exercises,allWorkouts['stretchExercise'].exercises,allWorkouts['backStrength'].exercises,allWorkouts['cardio'].exercises,allWorkouts['pilatesWorkout'].exercises));
  }
  if ($scope.currentWorkout.length == 1){
    $scope.currentWorkout = $scope.currentWorkout.concat($scope.currentWorkout);
  }
  //Randomize Workouts
  if ($stateParams.typeId == 'headToToe' || $stateParams.typeId == 'sevenMinute' || $stateParams.typeId == 'sunSalutation' || $stateParams.typeId == 'fullSequence'){
  } else {
     if($scope.advancedTiming.randomizationOption || !$scope.advancedTiming.customSet){
        if ($stateParams.typeId == "upperBody"){
          var pushupBased = ["Push-ups","Diamond Push-ups","Wide Arm Push-ups","Alternating Push-up Plank","One Arm Side Push-up", "Dive Bomber Push-ups","Shoulder Tap Push-ups", "Spiderman Push-up", "Push-up and Rotation"];
          var nonPushup = ["Overhead Press","Overhead Arm Clap","Tricep Dips","Jumping Jacks", "Chest Expander", "T Raise","Lying Triceps Lifts","Reverse Plank","Power Circles","Wall Push-ups"]
          pushupBased = pushupBased.sort(function() { return 0.5 - Math.random() });
          nonPushup = nonPushup.sort(function() { return 0.5 - Math.random() });
          var mergedUpper = mergeAlternating(pushupBased,nonPushup)
          $scope.currentWorkout = mergedUpper;
        } else{
          $scope.currentWorkout = $scope.currentWorkout.sort(function() { return 0.5 - Math.random() });
        }
     }
  }
  
  var startedWorkout = [];
  startedWorkout = startedWorkout.concat($scope.currentWorkout);

  $scope.extraSettings = WorkoutService.getTimingIntervals();
  $scope.showTiming = function(){
    $scope.stopTimer();
    $interval.cancel($scope.transitionCountdown);
    $timeout.cancel($scope.delayStart);
    $scope.transitionStatus = false;
    $scope.timerDelay == null;
    showTimingModal($scope,$ionicModal,$timeout, WorkoutService, true);
  }
  $scope.endWorkout = function(){
  $scope.endModalOpen = true;
  var reviewMessages = [{text: '<a>Have a good session? Rate us so we keep providing great workouts!</a>', launch:0},
  {text:'<a>Every rating counts! Tell us what you think!</a>', launch:0},
  {text:'<a>Sweaty? So are our developers. Please consider leaving a review!</a>', launch:1},
  {text:'<a>Want an exercise added?</a>', launch:2},
  {text:'<a>Let others know what you think!</a>', launch:0},
  {text:'<a>Have an idea for a new type of workout?</a>', launch:3},
  {text:'<a>Enjoying Sworkit?</a>', launch:0}
  ]
  var randomNum = Math.floor(Math.random()*reviewMessages.length);
  localforage.getItem('ratingStatus', function(result){$scope.ratingRequest.status = result;$scope.ratingRequest.message = reviewMessages[randomNum].text;$scope.ratingRequest.number = reviewMessages[randomNum].launch;});
  $ionicModal.fromTemplateUrl('workout-complete.html', function(modal) {
                                $scope.endModal = modal;
                                }, {
                                scope:$scope,
                                animation: 'fade-implode',
                                focusFirstInput: false,
                                backdropClickToClose: false,
                                hardwareBackButtonClose: false
                                });
      $scope.openModal = function() {
        $scope.stopTimer();
        $interval.cancel($scope.transitionCountdown);
        $timeout.cancel($scope.delayStart);
        $scope.transitionStatus = false;
        $timeout( function() {
          $ionicSlideBoxDelegate.update();
        },0);
          var mathComp = ($stateParams.timeId * 60) - ((($scope.totalTimer.minutes) * 60) + $scope.totalTimer.seconds);
          $scope.timeToAdd = Math.round( (mathComp / 60) * 2) / 2.0;
          if ($scope.timeToAdd > 0){
                var kilograms;
                var burnValue = $scope.chosenWorkout.activityWeight;
                kilograms=PersonalData.GetUserSettings.weight / 2.2;
                $scope.minutesCompleted = $scope.timeToAdd / 60.0;
                $scope.burn = Math.round(burnValue*kilograms*$scope.minutesCompleted);
          }
          else{
              $scope.burn = 0;
          }
          if ($scope.workoutComplete){
            if ($scope.userSettings.mfpStatus){
              $timeout(function(){$scope.syncMFP();}, 0);
              $timeout(function(){$scope.endWorkoutAnalytics('MyFitnessPal Complete');}, 4000);
            } else{
              $timeout(function(){$scope.endWorkoutAnalytics('Regular Complete');}, 4000);
            }
          }
          window.db.transaction(function(transaction) {
                             transaction.executeSql('INSERT INTO SworkitFree(created_on, minutes_completed, calories, type, utc_created) VALUES ((datetime("now","localtime")),?,?,?,datetime("now"))',[$scope.timeToAdd, $scope.burn, $stateParams.typeId], nullHandler,errorHandler);
                             });
          var totalWeek = parseInt(window.localStorage.getItem('weeklyTotal'));
          totalWeek += $scope.timeToAdd;
          window.localStorage.setItem('weeklyTotal', totalWeek);
          $scope.totals = {'totalEver':0,'todayMinutes':0,'todayCalories':0,'weeklyMinutes':0,'weeklyCalories':0,'topMinutes':0, 'topCalories':0, 'topDayMins':'', 'topDayCals':''};
          $scope.goalSettings = UserService.getGoalSettings();
          $timeout( function() {
            buildStats($scope);
          },0);
          $timeout( function() {
            $ionicSlideBoxDelegate.update();
          },1000);
          $scope.endModal.show();
          
          $timeout(function(){
            if (!$scope.workoutComplete && $scope.timeToAdd > 1){

              // if (device){
              //   navigator.notification.confirm(
              //     'This will end your workout! Are you really ready to stop sworking?',
              //      function(buttonIndex){
              //       if (buttonIndex == 2){
              //         $scope.confirmDone();
              //       }
              //      },
              //     'Are you finished?',
              //     ['No','Yes']
              //   );
              // }
                $ionicPopup.confirm({
                       title: 'Are you finished?',
                       cancelText: 'No',
                       template: '<p class="padding">This will end your workout! Are you really ready to stop Sworking?</p>',
                       okType: 'energized',
                       okText: 'Yes'
                     }).then(function(res) {
                       if(res) {
                          $scope.confirmDone();
                       }
                     }); 
                     

            }

          },1000)
          
      };
      $scope.confirmDone = function(){
        if (device){
          for (i=0;i<$scope.unloadQueue.length;i++){
            LowLatencyAudio.unload($scope.unloadQueue[i]);
          }
        }
        if (!$scope.workoutComplete){
          $scope.workoutComplete = true;
          $scope.playCongratsSound();
          if ($scope.userSettings.mfpStatus){
            $timeout(function(){$scope.syncMFP();}, 0);
            $timeout(function(){$scope.endWorkoutAnalytics('MyFitnessPal Partial');}, 4000);
          } else{
            $timeout(function(){$scope.endWorkoutAnalytics('Regular Partial');}, 4000);
          }
          if (device && $scope.userSettings.mPoints){
                $timeout(function(){$scope.endworkoutReward();}, 400);
              }
          if (device && $scope.userSettings.kiipRewards){
            $timeout(function(){$scope.endworkoutKiip();}, 2000);
          }
          if (device && $scope.userSettings.healthKit){
            $scope.syncHealthKit();
          }
        }
      }
      $scope.cancelModal = function() {
          $scope.endModal.hide();
          $scope.endModal.remove();
          $scope.endModalOpen = false;
          window.db.transaction(function(transaction) {
                               transaction.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = (SELECT MAX(sworkit_id) FROM SworkitFree)');
                               });
          var totalWeek = parseInt(window.localStorage.getItem('weeklyTotal'));
          totalWeek -= $scope.timeToAdd;
          window.localStorage.setItem('weeklyTotal', totalWeek);
      };
      $scope.mainMenu = function() {
          angular.element(document.getElementById('inline-video')).remove();
          $scope.currentWorkout = startedWorkout;
          if ($scope.timeToAdd < 1){
            window.db.transaction(function(transaction) {
                               transaction.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = (SELECT MAX(sworkit_id) FROM SworkitFree)');
                               });
            var totalWeek = parseInt(window.localStorage.getItem('weeklyTotal'));
            totalWeek -= $scope.timeToAdd;
            window.localStorage.setItem('weeklyTotal', totalWeek);
          } 
          $location.path('/app/home');
      };
      $scope.endWorkoutAnalytics =function(mfpRegular){
        if ($stateParams.typeId == "sunSalutation" || $stateParams.typeId == "fullSequence"){
          trackEvent('Yoga Finish', mfpRegular, $scope.timeToAdd);
        } else{
          trackEvent('Workout Finish', mfpRegular, $scope.timeToAdd);
        }
      }
      $scope.endworkoutKiip = function(){
        if ($stateParams.typeId == "sunSalutation" || $stateParams.typeId == "fullSequence"){
          callMoment('yogaCompleteSworkit');
        } else{
          callMoment('workoutCompleteSworkit');
        }
      };
      $scope.endworkoutReward = function(){
        if ($stateParams.typeId == "fullBody" || $stateParams.typeId == "upperBody" || $stateParams.typeId == "coreExercise" || $stateParams.typeId == "lowerBody" || $stateParams.typeId == "anythingGoes"){
          sessionm.phonegap.logAction(LocalData.GetWorkoutTypes[$stateParams.typeId].activityNames);
        } else if ($stateParams.typeId == "stretchExercise" || $stateParams.typeId == "backStrength" || $stateParams.typeId == "headToToe"|| $stateParams.typeId == "pilatesWorkout"){
          sessionm.phonegap.logAction('Stretch');
        } else if ($stateParams.typeId == "sunSalutation" || $stateParams.typeId == "fullSequence"){
          sessionm.phonegap.logAction('Yoga');
        } else if ($stateParams.typeId == "bootCamp" || $stateParams.typeId == "rumpRoaster" || $stateParams.typeId == "bringThePain" || $stateParams.typeId == "sevenMinute"){
          sessionm.phonegap.logAction('Bonus Workout');
        } else if ($stateParams.typeId == "customWorkout"){
          sessionm.phonegap.logAction('Custom Workout');
        } else if ($stateParams.typeId == "cardio" || $stateParams.typeId == "cardioLight"){
          sessionm.phonegap.logAction('Cardio');
        }
        var tempTotal = $scope.totals.todayMinutes;
        if (tempTotal >= 5){
          for (var i = 0; i <Math.floor(tempTotal / 5);i++){
            sessionm.phonegap.logAction('Bonus5');
          }
        }
        if (tempTotal >= 10){
          for (var i = 0; i <Math.floor(tempTotal / 10);i++){
            sessionm.phonegap.logAction('Bonus10');
          }
        }
        if ($scope.timeToAdd > 30){
          sessionm.phonegap.logAction('30 Full Minutes');
        }
        console.log('today: ' + $scope.totals.todayMinutes + ' goal: ' + $scope.goalSettings.dailyGoal);
        if ($scope.totals.todayMinutes > $scope.goalSettings.dailyGoal){
          sessionm.phonegap.logAction('Daily Goal Met');
          console.log('trying to give daily');
        }
        if ($scope.totals.todayMinutes > $scope.goalSettings.weeklyGoal){
          sessionm.phonegap.logAction('Weekly Goal Met');
        }
        window.db.transaction(
                           function(transaction) {
                           transaction.executeSql("SELECT * FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-1 day'))",
                                                  [],
                                                  function(tx, results){
                                                    var workoutsToday = results.rows.length;
                                                    if (workoutsToday == 2){
                                                      sessionm.phonegap.logAction('Double Take');
                                                    } else if(workoutsToday == 3) {
                                                      sessionm.phonegap.logAction('Triple Hit');
                                                    }
                                                  },
                                                  null)
                           }
                           );
        localforage.getItem('ratingHome', function(result){
          if(!result.past){
            globalRateOption = true;
            localforage.setItem('ratingHome', {show:true,past:true});
          }
        });
        localforage.getItem('remindHome', function(result){
          if(!result.past){
            globalRemindOption = true;
            localforage.setItem('remindHome', {show:true,past:true});
            if (!$scope.userSettings.healthKit && $scope.iOSPlatform){
              $scope.healthKitData.showHealthKitOption = $scope.healthKitData.healthKitAvailable;
            }
          }
        });
        $timeout(function(){
          $scope.getSessionMCount();
          $scope.$apply(); 
        }, 3000);

      }
      $scope.$on('$destroy', function() {
                 $scope.endModal.remove();
                 });
      $timeout(function(){
        $scope.openModal();
               }, 0);

    $scope.sessionMCount = {count:false, mPointsAvailable: $rootScope.sessionMAvailable};
    
    $scope.getSessionMCount = function(){
      sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
        $scope.sessionMCount.count = (data.unclaimedAchievementCount == 0) ? false : data.unclaimedAchievementCount;  
        $scope.$apply();
      });
      sessionm.phonegap.listenDidDismissActivity(function callback(data2) {
        $scope.getSessionMCount();
      });
    }
    $scope.launchMPoints = function(){
      if (device){
        sessionm.phonegap.presentActivity(2);
      }
    }

    $scope.challengeFriend = function(){
      var challengeText = 'I am awesome! I just finished ' + $scope.timeToAdd + ' minutes of ' + LocalData.GetWorkoutTypes[$stateParams.typeId].activityNames + ' with Sworkit';
      window.plugins.socialsharing.share(challengeText, null, null, 'http://sworkit.com')
    }

    $scope.enableHealthKit = function(){
      window.plugins.healthkit.requestAuthorization(
                                                          {
                                                          'readTypes'  : [ 'HKQuantityTypeIdentifierBodyMass'],
                                                          'writeTypes' : ['HKQuantityTypeIdentifierActiveEnergyBurned', 'workoutType']
                                                          },
                                                          function(){
                                                            PersonalData.GetUserSettings.healthKit = true;
                                                            localforage.setItem('userSettings', PersonalData.GetUserSettings);
                                                            $scope.syncHealthKit();
                                                            $scope.healthKitData.showHealthKitOption = false;
                                                          },
                                                          function(){}
                                                          );
    }
    $scope.syncHealthKit = function(){
      var workoutHK;
      if ($stateParams.typeId == "upperBody" || $stateParams.typeId == "coreExercise" || $stateParams.typeId == "lowerBody"){
          workoutHK = 'HKWorkoutActivityTypeFunctionalStrengthTraining';
        } else if ($stateParams.typeId == "stretchExercise" || $stateParams.typeId == "backStrength" || $stateParams.typeId == "headToToe"){
          workoutHK = 'HKWorkoutActivityTypePreparationAndRecovery';
        } else if ($stateParams.typeId == "sunSalutation" || $stateParams.typeId == "fullSequence"){
          workoutHK = 'HKWorkoutActivityTypeYoga';
        } else if ($stateParams.typeId == "customWorkout" || $stateParams.typeId == "fullBody"  || $stateParams.typeId == "anythingGoes" || $stateParams.typeId == "bootCamp" || $stateParams.typeId == "rumpRoaster" || $stateParams.typeId == "bringThePain" || $stateParams.typeId == "sevenMinute"){
          workoutHK = 'HKWorkoutActivityTypeCrossTraining';
        } else if ($stateParams.typeId == "cardio" || $stateParams.typeId == "cardioLight"){
          workoutHK = 'HKWorkoutActivityTypeMixedMetabolicCardioTraining';
        } else if ($stateParams.typeId == "pilatesWorkout"){
          workoutHK = 'HKWorkoutActivityTypeDanceInspiredTraining';
        }
      window.plugins.healthkit.saveWorkout({
                                                 'activityType': workoutHK,
                                                 'quantityType': null,
                                                 'startDate': $scope.startDate,
                                                 'endDate': null,
                                                 'duration': $scope.minutesCompleted * 60,
                                                 'energy': $scope.burn,
                                                 'energyUnit': 'cal',
                                                 'distance': null,
                                                 'distanceUnit': 'm'
                                                 },
                                                 function(msg){
                                                  console.log('HealthKit success: ' + msg);
                                                  $scope.healthKitData.healthKitStatus = 'Saved to HealthKit';
                                                 },
                                                 function(msg){
                                                  console.log('HealthKit error: ' + msg);
                                                 }
                                                 );

    }

    $scope.launchRate = function(){
      var rateMessages = ['We want to continue to provide you great content, but to do so we need your help. Help us out by rating our app favorably!',
      'We sweat to bring you the very best workouts possible. Please consider leaving us a positive review to show your appreciation!',
      'We want to continue to provide you great content, but to do so we need your help. Help us out by rating our app favorably! Feel free to leave your exercise suggestion in the review.',
      'We want to continue to provide you great content, but to do so we need your help. Help us out by rating our app favorably! Feel free to leave your workout suggestion in the review.'];
      //Lite
      $ionicPopup.confirm({
         title: 'Rate Sworkit',
         template: '<p class="padding">' + rateMessages[$scope.ratingRequest.number] + '</p>',
         okType: 'calm',
         okText: 'Rate the App'
       }).then(function(res) {
         if(res) {
            localforage.setItem('ratingStatus', true, function(){
              if (device.platform.toLowerCase() == 'ios') {
                window.open('http://itunes.apple.com/app/id527219710', '_system', 'location=no,AllowInlineMediaPlayback=yes');
              } else if (isAmazon()){
                window.appAvailability.check('com.amazon.venezia', function() {
                 window.open('amzn://apps/android?p=sworkitapp.sworkit.com', '_system')},function(){
                 window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=sworkitapp.sworkit.com"), '_system');}
                 );
            } else {
              window.open('market://details?id=sworkitapp.sworkit.com', '_system');
              }
            });
         }
       }); 
    }
  }
  $scope.syncMFP = function(){
    var dateString = $scope.startTime;
    var actionString = "log_cardio_exercise";
    var accessString = PersonalData.GetUserSettings.mfpAccessToken;
    var appID = "79656b6e6f6d";
    var exerciseID = LocalData.GetWorkoutTypes[$stateParams.typeId].activityMFP
    var durationFloat = $scope.timeToAdd * 60000;
    var energyCalories = $scope.burn;
    var unitCountry = "US";
    var statusMessage = "burned %CALORIES% calories doing %QUANTITY% minutes of " + LocalData.GetWorkoutTypes[$stateParams.typeId].activityNames + " with Sworkit";
    console.log('MFP Sync time: ' + $scope.startTime);
    var dataPost = JSON.stringify({'action' : actionString, 'access_token' : accessString,'app_id': appID, 'exercise_id': exerciseID, 'duration': durationFloat, 'energy_expended': energyCalories, 'start_time' : dateString, 'status_update_message': statusMessage, 'units': unitCountry});
    $http({
      method: 'POST',
      url: 'https://www.myfitnesspal.com/client_api/json/1.0.0?client_id=sworkit',
      data: dataPost,
      headers: {'Content-Type': 'application/json'}
    }).then(function(resp){
      showNotification('Successfully logged to MyFitnessPal', 'button-calm', 4000);
     }, function(err) {
      if ($scope){
        showNotification('Unable to log to MyFitnessPal', 'button-assertive', 4000);
      }
    })
  }
            
  $ionicModal.fromTemplateUrl('show-video.html', function(modal) {
                                $scope.videoModal = modal;
                                }, {
                                scope:$scope,
                                animation: 'fade-implode',
                                focusFirstInput: false,
                                backdropClickToClose: false
                                });
  $scope.showVideo = false;
  $scope.openVideoModal = function() {
    $scope.networkConnection = navigator.onLine;
    $scope.stopTimer();
    $interval.cancel($scope.transitionCountdown);
    $timeout.cancel($scope.delayStart);
    $scope.transitionStatus = false;
    $scope.timerDelay == null;
    $scope.videoModal.show();
    if ($scope.androidPlatform && device){
        if (PersonalData.GetUserSettings.videosDownloaded){
        window.plugins.html5Video.initialize({
          "modalvideoplayer" : $scope.currentExercise.video
        })
        $timeout(function(){
          window.plugins.html5Video.play("modalvideoplayer", function(){})
        }, 1400)
        $timeout(function(){
          angular.element(document.getElementById('modalvideoplayer')).css('opacity','1');
        }, 1500)
        $timeout(function(){
            angular.element(document.getElementById('modalvideoplayer')).css('opacity','0.00001');
          }, 0);
      } else{$timeout(function(){
              var videoPlayerFrame = angular.element(document.getElementById('modalvideoplayer'));
              videoPlayerFrame.css('opacity','0.00001');
              videoPlayerFrame[0].src = 'http://m.sworkit.com/assets/exercises/Videos/' + $scope.currentExercise.video;

              videoPlayerFrame[0].addEventListener("timeupdate", function() {
                if (videoPlayerFrame[0].duration > 0 
                  && Math.round(videoPlayerFrame[0].duration) - Math.round(videoPlayerFrame[0].currentTime) == 0) {
                  
                  //if loop atribute is set, restart video
                    if (videoPlayerFrame[0].loop) {
                        videoPlayerFrame[0].currentTime = 0;
                    }
                }
              }, false);
              
              videoPlayerFrame[0].addEventListener("canplay", function(){
                videoPlayerFrame[0].removeEventListener("canplay", this, false);
                videoPlayerFrame[0].play();
                videoPlayerFrame.css('opacity','1');
              }, false);
              
              videoPlayerFrame[0].play();
            }, 100);
        }
    } else {
      $scope.videoAddressModal = 'video/' + $scope.currentExercise.video +'?random=1';
    }
    $scope.showVideo = true;
  } 
  $scope.cancelVideoModal = function() {
    $scope.showVideo = false;
    $scope.videoModal.hide();
    // if($scope.advancedTiming.autoPlay){
    //   var videoElement = angular.element(document.getElementById('inline-video'))[0];
    //   videoElement.muted= true;
    //   videoElement.play();
    // }
  };
  $scope.$on('$destroy', function() {
    $scope.videoModal.remove();
  });

  $scope.isPaused = function () {
    return !$scope.totalTimerRunning;
  }
  //Interval variable is 'start'
  var start;

  $scope.setMinutes = function (){
    var singleSeconds = $scope.advancedTiming.exerciseTime;
    var totalMinutes = $stateParams.timeId;
    if (singleSeconds > 60){
      $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
      $scope.singleTimer.seconds = singleSeconds % 60;
    } else {
      $scope.singleTimer.minutes = 0;
      $scope.singleTimer.seconds = singleSeconds;
    }
    if ($stateParams.typeId == 'sevenMinute' && $stateParams.timeId % 7 == 0){
      var mathMin = ($scope.advancedTiming.exerciseTime * 12) / 60;
      var parseMin = parseInt(mathMin);
      var mathSec = Math.round( (mathMin % parseMin) * 10) / 10;
      mathSec = mathSec * 60;
      if (mathSec.toString().length == 1){
          mathSec = "0" + mathSec;
      }
      $scope.totalTimer.seconds = parseInt(mathSec);
      $scope.totalTimer.minutes =  (parseMin * $stateParams.timeId/7);
    } else {
      $scope.totalTimer.minutes = totalMinutes;
      $scope.totalTimer.seconds = 0;
    }
    $scope.updateTime();
  }
  $scope.updateTime = function() {
    $scope.singleTimer.displayText = $scope.displayTime($scope.singleTimer.minutes, $scope.singleTimer.seconds);
    $scope.totalTimer.displayText = $scope.displayTime($scope.totalTimer.minutes, $scope.totalTimer.seconds);
  }
  $scope.displayTime = function(mins, secs){
    var cleanedTime;
    if (mins > 0 && secs < 10){
      secs = '0' + secs;
    }
    if (mins > 0){
      return mins + ":" + secs;
    } else{
      return secs;
    }
  }
  
  //Set defaults each time
  $scope.setDefaults = function(){
    $scope.currentExercise = exerciseObject[$scope.currentWorkout[0]];
    $scope.nextExercise = {status: false, name: false, image: exerciseObject[$scope.currentWorkout[0]].image};
    if ($scope.androidPlatform && device){
      window.plugins.html5Video.initialize({
        "inlinevideo" : $scope.currentExercise.video
      })
    } else {
      $scope.videoAddress = 'video/' + $scope.currentExercise.video;
    }
    $timeout(function(){
      if ($scope.currentExercise.switchOption){
        $ionicNavBarDelegate.setTitle('Change Sides Half Way');
        angular.element(titleElements[titleLength]).addClass('orange-text');
      } else{
        //LITE
        $ionicNavBarDelegate.setTitle('SWORKIT');
        angular.element(document.getElementsByClassName('title')).removeClass('orange-text');
      }
    }, 1500);
    $scope.hasStarted = false;
    $scope.transitionsStatus = false;
    $scope.timerDelay = null;
    $scope.workoutComplete = false;
    $scope.numExercises = 0;
    if ($stateParams.typeId == 'sevenMinute'){
      $scope.advancedTiming.breakFreq = 0;
      $scope.advancedTiming.exerciseTime = $scope.sevenTiming.exerciseTimeSeven;
      $scope.advancedTiming.breakTime = 0;
      $scope.advancedTiming.transitionTime = $scope.sevenTiming.transitionTimeSeven;
      $scope.advancedTiming.randomizationOption = $scope.sevenTiming.randomizationOptionSeven;
    } else {
      if ($scope.advancedTiming.transition){
        $scope.advancedTiming.transitionTime = 5;
      } else {
        $scope.advancedTiming.transitionTime = 0;
      }
      $scope.advancedTiming.breakFreq = 5;
      $scope.advancedTiming.exerciseTime = 30;
      $scope.advancedTiming.breakTime = 30;
      $scope.advancedTiming.randomizationOption = true;
      if ($stateParams.typeId == 'headToToe' || $stateParams.typeId == 'stretchExercise' || $stateParams.typeId == 'sevenMinute'){
          $scope.advancedTiming.breakFreq = 0;
        }
    }
    if ($stateParams.typeId == 'headToToe'){
      $scope.advancedTiming.randomizationOption = false;
    }
    if ($stateParams.typeId == 'sunSalutation'){
      $scope.yogaSelection = true;
      $scope.advancedTiming.customSet = false;
      $scope.advancedTiming.breakFreq = 0;
      $scope.advancedTiming.exerciseTime = 8;
      $scope.advancedTiming.breakTime = 0;
      $scope.advancedTiming.transitionTime = 0;
      $scope.advancedTiming.transition = false;
      $scope.advancedTiming.randomizationOption = false;
      $scope.advancedTiming.warningAudio = false;
    } else if ($stateParams.typeId == 'fullSequence'){
      $scope.yogaSelection = true;
      $scope.advancedTiming.customSet = false;
      $scope.advancedTiming.breakFreq = 0;
      $scope.advancedTiming.exerciseTime = 21;
      $scope.advancedTiming.breakTime = 0;
      $scope.advancedTiming.transitionTime = 0;
      $scope.advancedTiming.transition = false;
      $scope.advancedTiming.randomizationOption = false;
      $scope.advancedTiming.warningAudio = false;
    }

    $scope.transitionCountdown;

    $scope.singleTimerRunning = false;
    $scope.totalTimerRunning = false;
    $scope.singleTimer = {time: $scope.advancedTiming.exerciseTime, minutes: 0, seconds: 0, displayText: '', status: false}
    $scope.totalTimer = {time: $stateParams.timeId, minutes: 0, seconds: 0, displayText: '', status: false}
    $scope.singleSecondsStart = $scope.advancedTiming.exerciseTime;
    $scope.totalSecondsStart = $stateParams.timeId;

    $scope.setMinutes();
  
    trackEvent('Workout Type', $scope.chosenWorkout.activityNames, $stateParams.timeId);
    $timeout(function(){
          playInlineVideo($scope.advancedTiming.autoPlay);
          $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
    },200)
  }

  $scope.setDefaults();

  $scope.startTimer = function (){
    
    start = $interval(function() {
      if ($scope.totalTimer.seconds == 0 && $scope.totalTimer.minutes == 0){
        $scope.playCongratsSound();
        $scope.workoutComplete = true;
        $scope.endWorkout();
        $scope.stopTimer;
        $scope.singleTimer.seconds = 1;
        $scope.totalTimer.seconds = 1;
        if (device && $scope.userSettings.mPoints){
              $timeout(function(){$scope.endworkoutReward();}, 1200);
            }
        if (device && $scope.userSettings.kiipRewards){
              $timeout(function(){$scope.endworkoutKiip();}, 600);
            }
        if (device && $scope.userSettings.healthKit){
            $timeout(function(){$scope.syncHealthKit();}, 1500);
           }
      }
      else if ($scope.totalTimer.seconds == 0 && $scope.totalTimer.minutes > 0){
        $scope.totalTimer.seconds = 60;
        $scope.totalTimer.minutes --;
      }
      if ($scope.currentExercise.switchOption && $scope.singleTimer.seconds == (Math.round($scope.advancedTiming.exerciseTime / 2))) {
        if ($scope.currentExercise.image !== "Break.jpg"){
          $scope.playSwitchSound();
        }
      } else if ($scope.advancedTiming.warningAudio){
        if ($scope.singleTimer.seconds == 11 && $scope.numExercises !== $scope.advancedTiming.breakFreq - 1 && $scope.advancedTiming.breakFreq !== 0  && $scope.advancedTiming.breakTime > 0){
          if ($scope.totalTimer.minutes == 0){
            if ($scope.totalTimer.seconds > 11){
              $scope.playNextWarning(exerciseObject[$scope.currentWorkout[1]]);
            }
          } else{
            $scope.playNextWarning(exerciseObject[$scope.currentWorkout[1]]);
          }
        } 
        // else if ($scope.singleTimer.seconds == 4){
        //   $scope.playCountdown();
        // }
      }
      if ($scope.singleTimer.seconds == 0 && $scope.singleTimer.minutes == 0){
        $scope.numExercises++;
        if ($scope.numExercises == $scope.advancedTiming.breakFreq && $scope.advancedTiming.breakFreq !== 0  && $scope.advancedTiming.breakTime > 0){
            $scope.nextExercise.status = false;
            $scope.playBreakSound();
            $scope.numExercises = -1;
            $scope.nextExercise.image = "Break.jpg";
            //LITE
            $ionicNavBarDelegate.setTitle('SWORKIT');
            angular.element(document.getElementsByClassName('title')).removeClass('orange-text');
            var breakText = "Take a " + $scope.advancedTiming.breakTime + " Second Break";
            $scope.currentExercise = {"name":breakText,"image":"Break.jpg","youtube":"rN6ATi7fujU","switchOption":false,"video":"Break.mp4","category":false};
            angular.element(document.getElementById('inline-video')).css('opacity','0.00001');
            $scope.videoAddress = 'video/Break.mp4';
            if ($scope.androidPlatform && device){
            } else {
              $scope.videoAddress = 'video/Break.mp4';
            }
            var videoFrame = angular.element(document.getElementById('inline-video'))[0];
            if ($scope.advancedTiming.autoPlay){

              if (ionic.Platform.isAndroid() && device){
                window.plugins.html5Video.initialize({
                  "inlinevideo" : $scope.currentExercise.video
                })
                setTimeout(function(){
                  playInlineVideo($scope.advancedTiming.autoPlay);
                }, 500);
                setTimeout(function(){
                  angular.element(document.getElementById('inlinevideo')).css('opacity','1');
                  $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
                  $scope.$apply();
                }, 1200)
              }
              else{
                var playEventListener = function(){
                  playInlineVideo($scope.advancedTiming.autoPlay);
                  $timeout(function(){
                         $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
                         $scope.$apply()
                         }, 2000);
                  setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');}, 800);
                  videoFrame.removeEventListener('canplaythrough', playEventListener);
                }
                videoFrame.addEventListener('canplaythrough', playEventListener);
              }
            } else {
              setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');
                $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[0]].image;
              }, 500);
              
            }

            var singleSeconds = $scope.advancedTiming.breakTime;
            if (singleSeconds > 60){
              $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
              $scope.singleTimer.seconds = singleSeconds % 60;
            } else {
              $scope.singleTimer.minutes = 0;
              $scope.singleTimer.seconds = singleSeconds;
            }
            $scope.updateTime();
        }
        else{
            $scope.skipExercise();
            $scope.singleTimer.seconds ++;
            $scope.totalTimer.seconds ++;
            if ($scope.totalTimer.seconds > 60){
              $scope.totalTimer.minutes++;
              $scope.totalTimer.seconds = 1;
            }
        }
      } else if ($scope.singleTimer.seconds == 0 && $scope.singleTimer.minutes > 0){
        $scope.singleTimer.seconds = 60;
        $scope.singleTimer.minutes--;
      } else if ($scope.singleTimer.seconds == 4 && $scope.advancedTiming.countdownBeep && $scope.singleTimer.minutes == 0){
        if (!$scope.yogaSelection){
          $scope.playCountdown();
        }
        if($scope.numExercises == $scope.advancedTiming.breakFreq - 1 && $scope.advancedTiming.breakFreq !== 0  && $scope.advancedTiming.breakTime > 0){
          $scope.nextExercise.name = "Take a " + $scope.advancedTiming.breakTime + " Second Break";
          $scope.nextExercise.status = true;
        } else if ($scope.totalTimer.minutes == 0 && $scope.totalTimer.seconds < 5){
        } else {
          $scope.nextExercise.name = exerciseObject[$scope.currentWorkout[1]].name;
          $scope.nextExercise.status = true;
        }
      }
      $scope.singleTimer.seconds --;
      $scope.totalTimer.seconds --;
      $scope.updateTime();
    }, 1000);
    $scope.singleTimer.status = true;
    $scope.totalTimer.status = true;

    //Specific actions for very first START
    if (!$scope.hasStarted){
      $scope.playNextSound(exerciseObject[$scope.currentWorkout[0]]);
      if ($stateParams.typeId !== 'sevenMinute'){
        $scope.transitionAction();
      }
      $scope.startTime = js_yyyy_mm_dd_hh_mm_ss();
      $scope.startDate = new Date();
    }
    $scope.hasStarted = true;
  };

  $scope.stopTimer = function (){
      $interval.cancel(start);
      start = undefined;
      $scope.singleTimer.status = false;
      $scope.totalTimer.status  = false;
  };

  $scope.toggleTimer = function (){
    $timeout.cancel($scope.delayStart);
    if ($scope.timerDelay !== null && !$scope.totalTimer.status){
      $scope.transitionStatus = false;
      $interval.cancel($scope.transitionCountdown);
      $scope.timerDelay = null;
      $scope.startTimer();
    } else if($scope.timerDelay == null && $scope.totalTimer.status) {
      $scope.stopTimer();
    } else if ($scope.timerDelay == null && !$scope.totalTimer.status && !$scope.hasStarted){
      $scope.startTimer();
    } else if ($scope.timerDelay == null && !$scope.totalTimer.status){
      //Leaving this else if in case we want to have the pause always after watching video
      //$scope.transitionAction();
      $scope.startTimer();
    }
  };

  $scope.skipExercise = function (){
    $scope.nextExercise.status = false;
    $interval.cancel($scope.transitionCountdown);
    $timeout.cancel($scope.delayStart);
    $scope.previousExercise = $scope.currentExercise;
    $scope.currentWorkout.shift();
    if ($scope.currentWorkout.length == 1){
      $scope.lastExercise = exerciseObject[$scope.currentWorkout[0]];
      $scope.currentWorkout = $scope.currentWorkout.concat(startedWorkout);
      if ($stateParams.typeId == 'headToToe' || $stateParams.typeId == 'sevenMinute' || $stateParams.typeId == 'sunSalutation' || $stateParams.typeId == 'fullSequence'){
      } else {
         if($scope.advancedTiming.randomizationOption || !$scope.advancedTiming.customSet){
            if ($stateParams.typeId == "upperBody"){
              var pushupBased = ["Push-ups","Diamond Push-ups","Wide Arm Push-ups","Alternating Push-up Plank","One Arm Side Push-up", "Dive Bomber Push-ups","Shoulder Tap Push-ups", "Spiderman Push-up", "Push-up and Rotation"];
              var nonPushup = ["Overhead Press","Overhead Arm Clap","Tricep Dips","Jumping Jacks", "Chest Expander", "T Raise","Lying Triceps Lifts","Reverse Plank","Power Circles","Wall Push-ups"]
              pushupBased = pushupBased.sort(function() { return 0.5 - Math.random() });
              nonPushup = nonPushup.sort(function() { return 0.5 - Math.random() });
              var mergedUpper = mergeAlternating(pushupBased,nonPushup)
              $scope.currentWorkout = mergedUpper;
            } else{
              $scope.currentWorkout = $scope.currentWorkout.sort(function() { return 0.5 - Math.random() });
            }
         }
      }
      $scope.currentWorkout.shift();
      $scope.currentWorkout.unshift($scope.lastExercise.name);
    }
    $scope.currentExercise = exerciseObject[$scope.currentWorkout[0]];

    if ($scope.androidPlatform && device){
      angular.element(document.getElementById('inlinevideo')).css('opacity','0.00001');
    } else {
      angular.element(document.getElementById('inline-video')).css('opacity','0.00001');
      setTimeout(function(){
        $scope.videoAddress = 'video/' + $scope.currentExercise.video;
      }, 0);
    }
    
    if ($scope.advancedTiming.autoPlay){
      var videoFrame = angular.element(document.getElementById('inline-video'))[0];
      if (ionic.Platform.isAndroid() && device){
          window.plugins.html5Video.initialize({
            "inlinevideo" : $scope.currentExercise.video
          })
          setTimeout(function(){
            playInlineVideo($scope.advancedTiming.autoPlay);
          }, 500);
          setTimeout(function(){
            angular.element(document.getElementById('inlinevideo')).css('opacity','1');
            $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
            $scope.$apply();
          }, 1000)
      } else {
        var playEventListener = function(){
          playInlineVideo($scope.advancedTiming.autoPlay);
          setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');
            $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
            $scope.$apply();
          }, 500);
          videoFrame.removeEventListener('canplaythrough', playEventListener);
        }
        videoFrame.addEventListener('canplaythrough', playEventListener);
        setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');
          }, 1500);
      }
    } else {
      setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');
        $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
      }, 500);   
    }
    var singleSeconds = $scope.advancedTiming.exerciseTime;
    if (singleSeconds > 60){
      $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
      $scope.singleTimer.seconds = singleSeconds % 60;
    } else {
     $scope.singleTimer.minutes = 0;
      $scope.singleTimer.seconds = singleSeconds;
    }
    if ($scope.totalTimer.status && $scope.timerDelay != null){
      $scope.transitionAction();
    } else if (!$scope.totalTimer.status && $scope.timerDelay != null){
      $scope.transitionTimer = $scope.advancedTiming.transitionTime;
      $scope.transitionAction();
    } else if ($scope.totalTimer.status && $scope.timerDelay == null){
      $scope.transitionTimer = $scope.advancedTiming.transitionTime;
      $scope.transitionAction();
    }
    $scope.playNextSound($scope.currentExercise);
    $scope.updateTime();
    if ($scope.currentExercise.switchOption){
      $ionicNavBarDelegate.setTitle('Change Sides Half Way');
      angular.element(document.getElementsByClassName('title')).addClass('orange-text');
    } else{
      //LITE
      $ionicNavBarDelegate.setTitle('SWORKIT');
      angular.element(document.getElementsByClassName('title')).removeClass('orange-text');
    }
  };
  $scope.backExercise = function (){
    if ($scope.previousExercise){
      angular.element(document.getElementById('video-background')).css('opacity','0.00001');
      $scope.nextExercise.status = false;
      $interval.cancel($scope.transitionCountdown);
      $timeout.cancel($scope.delayStart);
      $scope.currentWorkout.unshift($scope.previousExercise.name);
      $scope.previousExercise = false;
      $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[0]].image;
      $scope.currentExercise = exerciseObject[$scope.currentWorkout[0]];
      angular.element(document.getElementById('inline-video')).css('opacity','0.00001');
      if ($scope.androidPlatform && device){
      } else {
        $scope.videoAddress = 'video/' + $scope.currentExercise.video;
      }
      var videoFrame = angular.element(document.getElementById('inline-video'))[0];
      if ($scope.advancedTiming.autoPlay){
        if (ionic.Platform.isAndroid() && device){
          window.plugins.html5Video.initialize({
            "inlinevideo" : $scope.currentExercise.video
          })
          setTimeout(function(){
            playInlineVideo($scope.advancedTiming.autoPlay);
          }, 500);
          setTimeout(function(){
            angular.element(document.getElementById('video-background')).css('opacity','1');
            angular.element(document.getElementById('inlinevideo')).css('opacity','1');
            $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
            $scope.$apply();
          }, 1500)

        } else{
          var playEventListener = function(){
            setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');
              playInlineVideo($scope.advancedTiming.autoPlay);
              $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
              $scope.$apply();
            }, 500);
            angular.element(document.getElementById('video-background')).css('opacity','1');
            videoFrame.removeEventListener('canplaythrough', playEventListener);
          }
          videoFrame.addEventListener('canplaythrough', playEventListener);
        }
      } else {
        setTimeout(function(){angular.element(document.getElementById('inline-video')).css('opacity','1');
          $scope.nextExercise.image = exerciseObject[$scope.currentWorkout[1]].image;
        }, 500);
        angular.element(document.getElementById('video-background')).css('opacity','1');
      }

      var singleSeconds = $scope.advancedTiming.exerciseTime;
      if (singleSeconds > 60){
        $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
        $scope.singleTimer.seconds = singleSeconds % 60;
      } else {
       $scope.singleTimer.minutes = 0;
        $scope.singleTimer.seconds = singleSeconds;
      }
      if ($scope.totalTimer.status && $scope.timerDelay != null){
        $scope.transitionAction();
      } else if (!$scope.totalTimer.status && $scope.timerDelay != null){
        $scope.transitionTimer = $scope.advancedTiming.transitionTime;
        $scope.transitionAction();
      } else if ($scope.totalTimer.status && $scope.timerDelay == null){
        $scope.transitionTimer = $scope.advancedTiming.transitionTime;
        $scope.transitionAction();
      }
      $scope.playNextSound($scope.currentExercise);
      $scope.updateTime();
    }

  };
  $scope.swipeLeftSkip = function(){
    $scope.skipExercise();
  }
  $scope.swipeRightBack = function(){
    $scope.backExercise();
  }
  $scope.$on('$destroy', function() {
    $scope.stopTimer();
    angular.element(document.getElementsByClassName('title')).removeClass('title-center');
    $ionicSideMenuDelegate.canDragContent(true);
    localforage.getItem('timingSettings', function(result){TimingData.GetTimingSettings = result})
    LowLatencyAudio.unload('ding');
    LowLatencyAudio.unload('begin');
    LowLatencyAudio.unload('switch');
    LowLatencyAudio.unload('switchding');
    LowLatencyAudio.unload('next');
    LowLatencyAudio.unload('countdown');
    LowLatencyAudio.unload('countdownVoice');
    LowLatencyAudio.unload('break');
    LowLatencyAudio.unload('congrats');
  });

  //Audio section
  if (device){
    LowLatencyAudio.preloadAudio('ding', 'audio/ding.mp3', 1);
    LowLatencyAudio.preloadAudio('begin', 'audio/begin.mp3', 1);
    LowLatencyAudio.preloadAudio('switch', 'audio/changeSides.mp3', 1);
    LowLatencyAudio.preloadAudio('switchding', 'audio/switch.mp3', 1);
    LowLatencyAudio.preloadAudio('next', 'audio/Next.mp3', 1);
    LowLatencyAudio.preloadAudio('countdown', 'audio/beepsequence.mp3', 1);
    LowLatencyAudio.preloadAudio('countdownVoice', 'audio/countdownVoice.mp3', 1);
    LowLatencyAudio.turnOffAudioDuck();
  }

  $scope.urlCounter=Math.floor(Math.random()*100000);
  $scope.playNextSound = function(currentEx){
    if (device) {
      $scope.urlCounter = $scope.urlCounter +1;
      var muteUnmute = $scope.extraSettings.audioOption;
      var exerciseNum = "exercise" + $scope.urlCounter.toString();
      var audioURL = "audio/"+ currentEx.audio;
      LowLatencyAudio.preloadAudio(exerciseNum, audioURL, 1);
      $scope.unloadQueue.unshift(exerciseNum);
      if (muteUnmute){
        $timeout(function(){
           LowLatencyAudio.play(exerciseNum, 'duck');
           $scope.unloadAudio();
           }, 300);
      } else {
        LowLatencyAudio.play('ding', 'duck');
      }
    } else {
      console.log('Sound: Exercise name ');
    }
      
  }
  $scope.playBreakSound = function(){
    if (device){
      var muteUnmute = $scope.extraSettings.audioOption;
      if ($scope.advancedTiming.breakTime == 30){
          LowLatencyAudio.preloadAudio('break', 'audio/Break.mp3',1);
      } else{
          LowLatencyAudio.preloadAudio('break', 'audio/TakeBreak.mp3',1);
      }
      if (muteUnmute){
        $timeout(function(){
          LowLatencyAudio.play('break', 'duck');
        }, 300);
      } else {
        LowLatencyAudio.play('ding', 'duck');
      }
    } else {
      console.log('Sound: take a break');
    }
  }
  $scope.playSwitchSound = function(){
    $scope.transitionPause();
    if (device){
      var muteUnmute = $scope.extraSettings.audioOption;
      if (muteUnmute){
        $timeout(function(){
          LowLatencyAudio.play('switch', 'duck');
        }, 300);
      }
      else{
        $timeout(function(){
          LowLatencyAudio.play('switchding', 'duck');
        }, 300);
      }
    } else {
      console.log('Sound: switch sides');
    }
  }
  $scope.playNextWarning = function(currentEx){
    if (device){
      $scope.urlCounter = $scope.urlCounter +1;
      var muteUnmute = $scope.extraSettings.audioOption;
      var exerciseNum = "exercise" + $scope.urlCounter.toString();
      var audioURL = "audio/"+ currentEx.audio;
      var muteUnmute = $scope.extraSettings.audioOption;
      if (muteUnmute){
        $timeout(function(){
          LowLatencyAudio.play('next', 'duck');
        },0);
        LowLatencyAudio.preloadAudio(exerciseNum, audioURL, 1);
        $scope.unloadQueue.unshift(exerciseNum);
        $timeout(function(){
           LowLatencyAudio.play(exerciseNum, 'duck');
        }, 1500);
      }
      else{
        $timeout(function(){
          LowLatencyAudio.play('switchding', 'duck');
        }, 300);
      }
    } else {
      console.log('Sound: next warning');
    }
  }
  $scope.playCountdown = function(){
    if (device && $scope.extraSettings.countdownStyle){
      $timeout(function(){
        LowLatencyAudio.play('countdownVoice', 'noduck');
      }, 300);
    } else if (device){
      $timeout(function(){
        LowLatencyAudio.play('countdown', 'noduck');
      }, 300);
    } else {
      console.log('Sound: Countdown');
    }
  }
  $scope.playBeginSound = function(){
    if (device){
      $timeout(function(){
        LowLatencyAudio.play('begin', 'duck');
      }, 300);
    } else {
      console.log('Sound: Begin');
    }
  }
  $scope.playCongratsSound = function(){
    if (device){
      LowLatencyAudio.preloadAudio('congrats', 'audio/Congrats.mp3', 1);
      $timeout(function(){
        LowLatencyAudio.play('congrats', 'duck');
      }, 300);
    } else {
      console.log('Sound: Congrats!');
    }
  }
  $scope.unloadAudio = function(){
    $timeout(function(){
        for (i=$scope.unloadQueue.length-1;i>=2;i--){
          LowLatencyAudio.unload($scope.unloadQueue[i]);
          $scope.unloadQueue.splice((i), 1);
        }
    }, 2500);
  }
  $scope.toggleAudio = function(){
    $scope.extraSettings.audioOption = !$scope.extraSettings.audioOption;
  }
  $scope.toggleVideo = function(e){
    var videoElement = angular.element(document.getElementById('inline-video'))[0];
    videoElement.paused ? playInlineVideo($scope.advancedTiming.autoPlay) : videoElement.pause();
    videoElement.muted= true;
  }
  $scope.increaseTempo = function(){
    $scope.advancedTiming.exerciseTime ++;
    var singleSeconds = $scope.advancedTiming.exerciseTime;
    if (singleSeconds > 60){
      $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
      $scope.singleTimer.seconds = singleSeconds % 60;
    } else {
      $scope.singleTimer.minutes = 0;
      $scope.singleTimer.seconds = singleSeconds;
    }
    $scope.updateTime();
  }
  $scope.decreaseTempo = function(){
    $scope.advancedTiming.exerciseTime --;
    var singleSeconds = $scope.advancedTiming.exerciseTime;
    if (singleSeconds > 60){
      $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
      $scope.singleTimer.seconds = singleSeconds % 60;
    } else {
      $scope.singleTimer.minutes = 0;
      $scope.singleTimer.seconds = singleSeconds;
    }
    $scope.updateTime();
  }
  $scope.transitionAction = function(){
    var transitionLength = $scope.advancedTiming.transitionTime;
    $scope.transitionTimer = $scope.advancedTiming.transitionTime;
    $scope.transitionCountdown = $interval(function(){$scope.transitionTimer--;}, 1000)
    if (transitionLength == 10 && $stateParams.typeId == 'sevenMinute'){
        $scope.timerDelay = 0;
        $scope.stopTimer();
        $scope.transitionStatus = true;
        $scope.delayStart = $timeout(function(){$scope.playBeginSound();$scope.startTimer();$scope.timerDelay = null;$scope.transitionStatus = false;$interval.cancel($scope.transitionCountdown);
        }, 10300);
    }
    //Do not use 'begin' sound if under 4 seconds, too repetitive
    else if (transitionLength > 0 && transitionLength < 4 ){
        $scope.timerDelay = 0;
        $scope.stopTimer();
        $scope.transitionStatus = true;
        $scope.delayStart = $timeout(function(){$scope.startTimer();$scope.timerDelay = null;$scope.transitionStatus = false;$interval.cancel($scope.transitionCountdown);
        }, transitionLength*1000);
    }
    else if (transitionLength > 4){
        $scope.timerDelay = 0;
        $scope.stopTimer();
        $scope.transitionStatus = true;
        $scope.delayStart = $timeout(function(){$scope.playBeginSound();$scope.startTimer();$scope.timerDelay = null;$scope.transitionStatus = false;$interval.cancel($scope.transitionCountdown);
        }, transitionLength*1000);
    } 
    else{
      $interval.cancel($scope.transitionCountdown);
    }
  }
  $scope.transitionPause = function(){
      if ($scope.advancedTiming.transitionTime > 0){
          $scope.timerDelay = 0;
          $scope.stopTimer();
          $scope.transitionTimer = 5;
          $scope.transitionCountdown = $interval(function(){$scope.transitionTimer--;}, 1000);
          $scope.transitionStatus = true;
          $scope.delayStart = $timeout(function(){$scope.startTimer();$scope.timerDelay = null;$scope.transitionStatus = false;$interval.cancel($scope.transitionCountdown);
          }, 5000);
      } else{
        $scope.timerDelay = 0;
          $scope.stopTimer();
          $scope.transitionTimer = 3;
          $scope.transitionCountdown = $interval(function(){$scope.transitionTimer--;console.log('interval: ' + $scope.transitionTimer)}, 1000);
          $scope.transitionStatus = true;
          $scope.delayStart = $timeout(function(){$scope.startTimer();$scope.timerDelay = null;$scope.transitionStatus = false;$interval.cancel($scope.transitionCountdown);
          }, 3000);
      }
  }

  if (ionic.Platform.isAndroid()){
    var workoutBack = $ionicPlatform.registerBackButtonAction(
      function () {
        if (!$scope.endModalOpen){
          $scope.endWorkout();
        }
      }, 250
    );
  }
  $scope.$on('$destroy', workoutBack);
})

.controller('RewardsCtrl', function($rootScope, $scope, UserService) {
  $scope.sessionmStatus = sessionmAvailable;
  $scope.rewardStatus = UserService.getUserSettings();
  $scope.sessionMCount = {count:false};

  $scope.getSessionMCount = function(){
    sessionm.phonegap.getUnclaimedAchievementCount(function callback(data) {
        $scope.sessionMCount.count = (data.unclaimedAchievementCount == 0) ? false : data.unclaimedAchievementCount;
        $rootScope.mPointsTotal = data.unclaimedAchievementCount;  
        $scope.$apply();
      });
  }
  if (device){
    $scope.getSessionMCount();
    sessionm.phonegap.listenDidDismissActivity(function callback(data2) {
      $scope.getSessionMCount();
    });
  }
  $scope.launchSessionM = function(){
    if (device){
      console.log('trying to launch sessionm');
      sessionm.phonegap.presentActivity(2);
    }
  }
  $scope.rewardsFAQ = function(){
    window.open('http://sworkit.com/rewards', 'blank', 'location=yes,AllowInlineMediaPlayback=yes' );
  }
  $scope.disableRewards = function(typeReward){
    if (typeReward == 'sessionm' && $scope.rewardStatus.mPoints == true){
      trackEvent('More Action', 'Disable SessionM', 0);
    } else if (typeReward == 'kiip' && $scope.rewardStatus.kiipRewards == true){
      trackEvent('More Action', 'Disable Kiip', 0);
    }
  }

  angular.element(document.getElementsByClassName('bar-stable')).addClass('green-bar');
  $scope.$on('$destroy', function() {
               localforage.setItem('userSettings', PersonalData.GetUserSettings);
               angular.element(document.getElementsByClassName('bar-stable')).removeClass('green-bar');
               });
})

.controller('ProgressCtrl', function($scope, $location, $ionicPlatform, UserService) {
   $scope.totals = {'totalEver':0,'todayMinutes':0,'todayCalories':0,'weeklyMinutes':0,'weeklyCalories':0, 'totalMonthMin':0, 'topMinutes':0, 'topCalories':0, 'topDayMins':'', 'topDayCals':''};
   $scope.goalSettings = UserService.getGoalSettings();
   buildStats($scope);
})

.controller('LogCtrl', function($scope, $ionicLoading, $location, $ionicPlatform, $ionicPopup, $http, UserService) {
  $ionicLoading.show({
      template: 'Loading workouts...'
  });
  $scope.noLogs = false;
  $scope.userSettings = UserService.getUserSettings();
  db.transaction(
               function(transaction) {
               transaction.executeSql("SELECT * FROM SworkitFree",
                                      [],
                                      $scope.createLog,
                                      null)
               }
               );
  $scope.createLog = function(tx, results){
            $scope.allLogs = [];
            if (results.rows.length ==0){
                $scope.noLogs = true;
                $ionicLoading.hide();
            }
            var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var totalRows = 0;
            for (var i = results.rows.length - 1; i > -1; i--) {
                var useID = results.rows.item(i)['sworkit_id'];
                var useDate = results.rows.item(i)['created_on'].split(/[- :]/);
                var createdDate = new Date(useDate[0], useDate[1]-1, useDate[2], useDate[3], useDate[4], useDate[5]);
                var ampm = (createdDate.getHours() > 11) ? "pm" : "am";
                var useHour = (createdDate.getHours() > 11) ? createdDate.getHours() - 12 : createdDate.getHours();
                var useMinute = (createdDate.getMinutes() < 10) ? "0" + createdDate.getMinutes()  : createdDate.getMinutes();
                createdDate = month_names_short[createdDate.getMonth()] + ' ' + createdDate.getDate() + ', ' + useHour + ":" + useMinute + " " + ampm;
                var activityTitle = LocalData.GetWorkoutTypes[results.rows.item(i)['type']].activityNames;
                var useCalories = results.rows.item(i)['calories'];
                var useMinutes = results.rows.item(i)['minutes_completed'];

                if (!activityTitle){
                    activityTitle = "Misc. Workout";
                }
                $scope.allLogs.push({'id':useID, 
                  'date': useDate, 
                  'createdDate': createdDate, 
                  'ampm': ampm, 
                  'useHour': useHour, 
                  'useMinutes': useMinutes,
                  'activityTitle': activityTitle,
                  'useCalories': useCalories,
                })
                totalRows++;
                if (totalRows = results.rows.length){
                  $ionicLoading.hide();
                }
            }
  }
  $scope.syncRow = function (rowId){
    var fakeData = {"sworkit_id":44,"created_on":"2014-06-26 14:08:06","minutes_completed":0,"calories":0,"type":"fullBody","utc_created":"2014-06-26 13:08:06"} 
    db.transaction(function(transaction) {
                           transaction.executeSql('SELECT * FROM SworkitFree WHERE sworkit_id = ?',[rowId],
                                                  function(tx, results){
                                                    var syncableWorkout = results.rows.item(0);
                                                    var dateString = syncableWorkout["utc_created"];
                                                    var actionString = "log_cardio_exercise";
                                                    var accessString = PersonalData.GetUserSettings.mfpAccessToken;
                                                    var appID = "79656b6e6f6d";
                                                    var exerciseID = LocalData.GetWorkoutTypes[syncableWorkout["type"]].activityMFP;
                                                    var durationFloat = syncableWorkout["minutes_completed"] * 60000;
                                                    var energyCalories = syncableWorkout["calories"];;
                                                    var unitCountry = "US";
                                                    var statusMessage = "burned %CALORIES% calories doing %QUANTITY% minutes of " + LocalData.GetWorkoutTypes[syncableWorkout["type"]].activityNames + " with Sworkit";
                                                    var dataPost = JSON.stringify({'action' : actionString, 'access_token' : accessString,'app_id': appID, 'exercise_id': exerciseID, 'duration': durationFloat, 'energy_expended': energyCalories, 'start_time' : dateString, 'status_update_message': statusMessage, 'units': unitCountry});
                                                    $http({
                                                      method: 'POST',
                                                      url: 'https://www.myfitnesspal.com/client_api/json/1.0.0?client_id=sworkit',
                                                      data: dataPost,
                                                      headers: {'Content-Type': 'application/json'}
                                                    }).then(function(resp){
                                                      showNotification('Successly logged to MyFitnessPal', 'button-calm', 2000);
                                                     }, function(err) {
                                                      if ($scope){
                                                        showNotification('Unable to log to MyFitnessPal', 'button-assertive', 2000);
                                                      }
                                                    })
                                                  },
                                                  null);
                           });
  }
  $scope.deleteRow = function(rowId){
    if (device){
            navigator.notification.confirm(
          'Are you sure you want to delete this workout?',
           function(buttonIndex){
            if (buttonIndex == 2){
              db.transaction(function(transaction) {
                              transaction.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = ?',[rowId]);
                              });
              $scope.allLogs.forEach(function(element, index, array){if (element.id == rowId){$scope.allLogs.splice(index, 1);}});
              $sceop.$apply();
            }
           },
          'Delete Workout',
          ['Cancel','Delete']
      );
    } else{
      $ionicPopup.confirm({
             title: 'Delete Workout',
             template: '<p class="padding">Are you sure you want to delete this workout?</p>',
             okType: 'assertive',
             okText: 'Delete'
           }).then(function(res) {
             if(res) {
                db.transaction(function(transaction) {
                              transaction.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = ?',[rowId]);
                              });
                $scope.allLogs.forEach(function(element, index, array){if (element.id == rowId){$scope.allLogs.splice(index, 1);}});
                $scope.$apply();
             }
           }); 
      }              
    }
})

.controller('TimingCtrl', function($scope, UserService) {
   $scope.advancedTimingSettings = 
   $scope.goalSettings = UserService.getGoalSettings();
   buildStats($scope);
})

.controller('RemindersCtrl', function($scope, UserService) {
  angular.element(document.getElementsByClassName('bar-stable')).addClass('blue-bar');
  if (isNaN(LocalData.SetReminder.daily.minutes)){
    LocalData.SetReminder.daily.minutes = 0;
  } 
  if (isNaN(LocalData.SetReminder.daily.time)){
    LocalData.SetReminder.daily.time = 7;
  }
  if (isNaN(LocalData.SetReminder.inactivity.minutes)){
    LocalData.SetReminder.inactivity.minutes = 0;
  } 
  if (isNaN(LocalData.SetReminder.inactivity.time)){
    LocalData.SetReminder.inactivity.time = 7;
  }
  if (isNaN(LocalData.SetReminder.inactivity.frequency)){
    LocalData.SetReminder.inactivity.frequency = 2;
  }
  $scope.reminderTimes = {selected: 7, times:[{id:0, real: '12', time:'12 am', short:'am'},{id:1, real: '1', time:'1 am', short:'am'},{id:2, real: '2', time:'2 am', short:'am'},{id:3, real: '3', time:'3 am', short:'am'},{id:4, real: '4', time:'4 am', short:'am'},{id:5, real: '5', time:'5 am', short:'am'},{id:6, real: '6', time:'6 am', short:'am'},{id:7, real: '7', time:'7 am', short:'am'},{id:8, real: '8', time:'8 am', short:'am'},{id:9, real: '9', time:'9 am', short:'am'},{id:10, real: '10', time:'10 am', short:'am'},{id:11, real: '11', time:'11 am', short:'am'},{id:12, real: '12', time:'12 pm', short:'pm'},{id:13, real: '1', time:'1 pm', short:'pm'},{id:14, real: '2', time:'2 pm', short:'pm'},{id:15, real: '3', time:'3 pm', short:'pm'},{id:16, real: '4', time:'4 pm', short:'pm'},{id:17, real: '5', time:'5 pm', short:'pm'},{id:18, real: '6', time:'6 pm', short:'pm'},{id:19, real: '7', time:'7 pm', short:'pm'},{id:20, real: '8', time:'8 pm', short:'pm'},{id:21, real: '9', time:'9 pm', short:'pm'},{id:22, real: '10', time:'10 pm', short:'pm'},{id:23, real: '11', time:'11 pm', short:'pm'}], reminder: false};
  $scope.inactivityTimes = {frequency: 2, selected: 7, times:[{id:0, real: '12', time:'12 am', short:'am'},{id:1, real: '1', time:'1 am', short:'am'},{id:2, real: '2', time:'2 am', short:'am'},{id:3, real: '3', time:'3 am', short:'am'},{id:4, real: '4', time:'4 am', short:'am'},{id:5, real: '5', time:'5 am', short:'am'},{id:6, real: '6', time:'6 am', short:'am'},{id:7, real: '7', time:'7 am', short:'am'},{id:8, real: '8', time:'8 am', short:'am'},{id:9, real: '9', time:'9 am', short:'am'},{id:10, real: '10', time:'10 am', short:'am'},{id:11, real: '11', time:'11 am', short:'am'},{id:12, real: '12', time:'12 pm', short:'pm'},{id:13, real: '1', time:'1 pm', short:'pm'},{id:14, real: '2', time:'2 pm', short:'pm'},{id:15, real: '3', time:'3 pm', short:'pm'},{id:16, real: '4', time:'4 pm', short:'pm'},{id:17, real: '5', time:'5 pm', short:'pm'},{id:18, real: '6', time:'6 pm', short:'pm'},{id:19, real: '7', time:'7 pm', short:'pm'},{id:20, real: '8', time:'8 pm', short:'pm'},{id:21, real: '9', time:'9 pm', short:'pm'},{id:22, real: '10', time:'10 pm', short:'pm'},{id:23, real: '11', time:'11 pm', short:'pm'}], reminder: false};         
  $scope.reminderMins = getMinutesObj();
  $scope.reminderMins.selected = $scope.reminderMins.times[LocalData.SetReminder.daily.minutes];
  $scope.reminderTimes.selected = $scope.reminderTimes.times[LocalData.SetReminder.daily.time];
  $scope.reminderTimes.reminder = LocalData.SetReminder.daily.status;
  $scope.inactivityMins = getMinutesObj();
  $scope.inactivityMins.selected = $scope.inactivityMins.times[LocalData.SetReminder.inactivity.minutes];
  $scope.inactivityTimes.selected = $scope.inactivityTimes.times[LocalData.SetReminder.inactivity.time];
  $scope.inactivityTimes.reminder = LocalData.SetReminder.inactivity.status;
  $scope.inactivityTimes.frequency = LocalData.SetReminder.inactivity.frequency;
  $scope.inactivityOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  if (device){window.plugin.notification.local.cancelAll();}
  var newDate = new Date();
  newDate.setHours($scope.reminderTimes.selected.id);
  newDate.setMinutes($scope.reminderMins.selected.id);
  var newDate2 = new Date();
  newDate2.setHours($scope.inactivityTimes.selected.id);
  newDate2.setMinutes($scope.inactivityMins.selected.id);

  $scope.datePickerOpen = function () {
    if (device){
      datePicker.show(
                                   {
                                   "date": newDate,
                                   "mode": "time"
                                   },
                                   function(returnDate){
                                    if (!isNaN(returnDate.getHours())){
                                      $scope.reminderTimes.selected = $scope.reminderTimes.times[returnDate.getHours()];
                                      $scope.reminderMins.selected = $scope.reminderMins.times[returnDate.getMinutes()];
                                      $scope.$apply();
                                    }
                                   }
                                   )
    }

  }
  $scope.datePicker2Open = function () {
    if (device){
      datePicker.show(
                               {
                               "date": newDate2,
                               "mode": "time"
                               },
                               function(returnDate){
                                if (!isNaN(returnDate.getHours())){
                                 $scope.inactivityTimes.selected = $scope.inactivityTimes.times[returnDate.getHours()];
                                 $scope.inactivityMins.selected = $scope.inactivityMins.times[returnDate.getMinutes()];
                                 $scope.$apply();
                                }
                               }
                               )
    }

  }

  $scope.closeScreen = function ($event) {
    if (device){
      LocalData.SetReminder.daily.time = $scope.reminderTimes.selected.id;
      LocalData.SetReminder.daily.minutes = $scope.reminderMins.selected.id;
      LocalData.SetReminder.daily.status = $scope.reminderTimes.reminder;
      LocalData.SetReminder.inactivity.time = $scope.inactivityTimes.selected.id;
      LocalData.SetReminder.inactivity.minutes = $scope.inactivityMins.selected.id;
      LocalData.SetReminder.inactivity.status = $scope.inactivityTimes.reminder;
      LocalData.SetReminder.inactivity.frequency = $scope.inactivityTimes.frequency;
      if ($scope.reminderTimes.reminder){
        var dDate = new Date();
        var tDate = new Date();
        dDate.setHours($scope.reminderTimes.selected.id);
        dDate.setMinutes($scope.reminderMins.selected.id);
        dDate.setSeconds(0);
        if ($scope.reminderTimes.selected.id <= tDate.getHours() && $scope.reminderMins.selected.id <= tDate.getMinutes()){
        dDate.setDate(dDate.getDate() + 1);
        }
        window.plugin.notification.local.add({
                                             id:         1,
                                             date:       dDate,    // This expects a date object
                                             message:    "Time to Swork Out. Bring it on.",  // The message that is displayed
                                             title:      'Workout Reminder',  // The title of the message
                                             repeat:     'daily',
                                             autoCancel: true,
                                             icon: 'ic_launcher',
                                             smallIcon: 'ic_launcher'
                                             });
        window.plugin.notification.local.onclick = function (id, state, json) {
            window.plugin.notification.local.cancel(1);
            var nDate = new Date();
            var tDate = new Date();
            nDate.setHours(LocalData.SetReminder.daily.time);
            nDate.setMinutes(LocalData.SetReminder.daily.minutes);
            nDate.setSeconds(0);
            if (tDate.getHours() <= nDate.getHours() && tDate.getMinutes() <= nDate.getMinutes()){
                nDate.setDate(nDate.getDate() + 1);
            }
            $timeout( function (){window.plugin.notification.local.add({
                                                                   id:         1,
                                                                   date:       nDate,    // This expects a date object
                                                                   message:    "Time to Swork Out. Bring it on.",  // The message that is displayed
                                                                   title:      'Workout Reminder',  // The title of the message
                                                                   repeat:     'daily',
                                                                   autoCancel: true,
                                                                   icon: 'ic_launcher',
                                                                   smallIcon: 'ic_launcher'
                                                                   });}, 2000);
        }
      }
      if ($scope.inactivityTimes.reminder){
        var dDate = new Date();
        dDate.setHours($scope.inactivityTimes.selected.id);
        dDate.setMinutes($scope.inactivityMins.selected.id);
        dDate.setSeconds(0);
        dDate.setDate(dDate.getDate() + $scope.inactivityTimes.frequency);
        window.plugin.notification.local.add({
                                             id:         2,
                                             date:       dDate,    // This expects a date object
                                             message:    "It's been too long. Time to Swork Out.",  // The message that is displayed
                                             title:      'Workout Reminder',  // The title of the message
                                             autoCancel: true,
                                             icon: 'ic_launcher',
                                             smallIcon: 'ic_launcher'
                                             });
        window.plugin.notification.local.onclick = function (id, state, json) {
            window.plugin.notification.local.cancel(2);
            var nDate = new Date();
            nDate.setHours(LocalData.SetReminder.inactivity.time);
            nDate.setMinutes(LocalData.SetReminder.inactivity.minutes);
            nDate.setSeconds(0);
            nDate.setDate(nDate.getDate() + $scope.inactivityTimes.frequency);
            $timeout( function (){window.plugin.notification.local.add({
                                                                   id:         2,
                                                                   date:       nDate,    // This expects a date object
                                                                   message:    "It's been too long. Time to Swork Out.",  // The message that is displayed
                                                                   title:      'Workout Reminder',  // The title of the message
                                                                   autoCancel: true,
                                                                   icon: 'ic_launcher',
                                                                   smallIcon: 'ic_launcher'
                                                                   });}, 2000);
        }
      }

      localforage.setItem('reminder',{daily: {
        status:$scope.reminderTimes.reminder,
        time:$scope.reminderTimes.selected.id,
        minutes:$scope.reminderMins.selected.id},
        inactivity: {
          status:$scope.inactivityTimes.reminder,
          time:$scope.inactivityTimes.selected.id,
          minutes:$scope.inactivityMins.selected.id,
          frequency:$scope.inactivityTimes.frequency
        }
        });
    }
  }

  $scope.$on('$destroy', function() {
               $scope.closeScreen();
               angular.element(document.getElementsByClassName('bar-stable')).removeClass('blue-bar');
               });
})

.controller('SettingsCtrl', function($rootScope, $scope, $http, $ionicModal, $timeout, $ionicPopup, UserService) {
  $scope.userSettings = UserService.getUserSettings();
  $scope.goalSettings = UserService.getGoalSettings();
  $scope.timeSettings = UserService.getTimingIntervals();
  $scope.healthKitAvailable = false;
  if (ionic.Platform.isAndroid()){
    $scope.androidPlatform = true;
  } else{
    $scope.androidPlatform = false;
    if (device){
      window.plugins.healthkit.available(
                                               function(result){
                                                if (result == true){
                                                  $scope.healthKitAvailable = true;
                                                }
                                               },
                                               function(){
                                                $scope.healthKitAvailable = false;
                                               }
                                               );
    } else {
      //Available in browser for testing purposes
      $scope.healthKitAvailable = true;
    }
  }
  $scope.mfpWeightStatus = {data: $scope.userSettings.mfpWeight}
  $scope.displayWeight = {data: 0};
  $scope.weightTypes = [{id: 0, title:"lbs"}, {id:1, title:"kgs"}]
  $scope.selectedType = {data: $scope.weightTypes[$scope.userSettings.weightType]};
  $scope.convertWeight = function(){
    if ($scope.userSettings.weightType == 0){
      $scope.displayWeight.data = $scope.userSettings.weight;
    } else{
      $scope.displayWeight.data = Math.round(($scope.userSettings.weight / 2.20462));
    }
  }
  $scope.convertWeight();
  $scope.$watch('selectedType.data', function(newValue, oldValue) {
        $scope.userSettings.weightType = newValue.id;
        $scope.convertWeight();
  })
  $scope.$watch('displayWeight.data', function(val) {
    if ($scope.userSettings.weightType == 0){
      $scope.userSettings.weight = $scope.displayWeight.data;
    } else{
      $scope.userSettings.weight = Math.round(($scope.displayWeight.data * 2.20462));
    }
  })
  $scope.syncWeight = function(){
    if (!$scope.mfpWeightStatus.data){
      getMFPWeight($http, $scope);
    }
  }
  $scope.connectHealthKit = function(){
    
    $timeout(function(){
      window.plugins.healthkit.requestAuthorization(
                                                          {
                                                          'readTypes'  : [ 'HKQuantityTypeIdentifierBodyMass'],
                                                          'writeTypes' : ['HKQuantityTypeIdentifierActiveEnergyBurned', 'workoutType']
                                                          },
                                                          function(){
                                                            PersonalData.GetUserSettings.healthKit = true;
                                                            localforage.setItem('userSettings', PersonalData.GetUserSettings);
                                                            $scope.readWeight();
                                                          },
                                                          function(){}
                                                          );
    }, 1000);
  }
  $scope.reconnectHealthKit = function(){
    $scope.healthPopup = $ionicPopup.show({
      title: '',
      subTitle: '',
      scope: $scope,
      template: '<button class="button button-full button-calm" ng-click="hideHealthPopup();healthKitHelp()">Update Settings</button><button class="button button-full button-assertive" ng-click="hideHealthPopup();disableHealthKit();">Disable</button>',
      buttons: [
        { text: 'Cancel' }
      ]
    });
  }
  $scope.readWeight = function(){
    window.plugins.healthkit.readWeight({
                                                'unit': 'lb'
                                                },
                                                function(msg){
                                                  if (!isNaN(msg)){
                                                    PersonalData.GetUserSettings.weight = msg;
                                                    $scope.convertWeight();
                                                  }
                                                },
                                                function(){}
                                                );
  }
  $scope.hideHealthPopup = function(){
    $scope.healthPopup.close();
  }
  $scope.healthKitHelp = function(){
    $scope.healthModal.show();
  }
  $ionicModal.fromTemplateUrl('healthkit-help.html', function(modal) {
                                $scope.healthModal = modal;
                                }, {
                                scope:$scope,
                                animation: 'slide-in-up',
                                focusFirstInput: false,
                                backdropClickToClose: true,
                                hardwareBackButtonClose: false
                                });
  $scope.closeHealthModal = function(){
    $scope.healthModal.hide();
  }
  $scope.disableHealthKit = function(){
    PersonalData.GetUserSettings.healthKit = false;
    localforage.setItem('userSettings', PersonalData.GetUserSettings);
  }

  $scope.reconnectMFP = function(){
    $scope.mfpPopup = $ionicPopup.show({
      title: '',
      subTitle: '',
      scope: $scope,
      template: '<button class="button button-full button-calm" ng-click="hidePopup();connectMFP();">Reconnect</button><button class="button button-full button-assertive" ng-click="hidePopup();disconnectMFP();">Disconnect</button>',
      buttons: [
        { text: 'Cancel' }
      ]
    });
  }
  $scope.hidePopup = function(){
    $scope.mfpPopup.close();
  }
  $scope.disconnectMFP = function(){
            var refresher = PersonalData.GetUserSettings.mfpRefreshToken;
            var newURL = "https://www.myfitnesspal.com/oauth2/revoke?client_id=sworkit&refresh_token=" + refresher;
            $http({
            method: 'POST',
            url: newURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(resp){
            PersonalData.GetUserSettings.mfpAccessToken = false;
            PersonalData.GetUserSettings.mfpRefreshToken = false;
            PersonalData.GetUserSettings.mfpStatus = false;
            PersonalData.GetUserSettings.mfpWeight = false;
            localforage.setItem('userSettings', PersonalData.GetUserSettings);
            showNotification('Disconnect completed.', 'button-balanced', 2000);
           }, function(err) {
            showNotification('There was an error, please try again.', 'button-assertive', 2000);
      })
  }
  $scope.connectMFP = function(){
    var randomNumber = (new Date().valueOf()).toString() + Math.floor(Math.random()*900);
    var authUrl = 'https://www.myfitnesspal.com/oauth2/authorize?client_id=sworkit&scope=diary&redirect_uri=http://m.sworkit.com/mfp-auth.html&access_type=offline&response_type=code';
    
    cb = window.open(authUrl, '_blank', 'location=no,AllowInlineMediaPlayback=yes,clearcache=yes,clearsessioncache=yes');
    
    cb.addEventListener('loadstart', function(event){$rootScope.interceptFacebook(event.url)});
    
    cb.addEventListener('loadstop', function(event){$rootScope.locationChanged(event.url)});
    
    cb.addEventListener('exit', function(event){$rootScope.childBrowserClosed()});
    
  }

  $rootScope.interceptFacebook = function(url){
      console.log("starting to load: " + url);
      if (url == "http://m.sworkit.com/intercept.html"){
          window.open("https://www.myfitnesspal.com/oauth2/authorize?client_id=sworkit&scope=diary&redirect_uri=http://m.sworkit.com/mfp-auth.html&state=proapp&access_type=offline&response_type=code", "_system", "location=no,AllowInlineMediaPlayback=yes");
      }
  }

  $rootScope.locationChanged = function(url) {
     cb.executeScript({
                     code: '$("#facebook-login-css").click(function() {window.location = "http://m.sworkit.com/intercept.html"})'
      }, function() {
      });
      myObj = deparam(url);
  }

  $rootScope.childBrowserClosed = function(){
      if (myObj.code){
          var newURL = "https://www.myfitnesspal.com/oauth2/token?client_id=sworkit&client_secret=192867e0c606f7a7b953&grant_type=authorization_code&code=" + myObj.code;
          $http({
            method: 'POST',
            url: newURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(resp){
            PersonalData.GetUserSettings.mfpAccessToken = resp.data.access_token;
            PersonalData.GetUserSettings.mfpRefreshToken = resp.data.refresh_token;
            PersonalData.GetUserSettings.mfpStatus = true;
            localforage.setItem('userSettings', PersonalData.GetUserSettings);
            showNotification('Authorization was successful.', 'button-balanced', 2000);
            trackEvent('More Action', 'MyFitnessPal Connection', 0);
            sessionm.phonegap.logAction('MyFitnessPal');
           }, function(err) {
            showNotification('There was an error, please try again.', 'button-assertive', 2000);
      })
      }
      else {
          navigator.notification.confirm(
                                   'Tap Help for additional information, or feel free to email us for assistance at contact@sworkit.com.',
                                   $scope.getHelp,
                                   'Connection Error',
                                   ['Cancel','Help']
                                   );
      }
      
  }
  $scope.getHelp = function(buttonIndex){
    if (buttonIndex == 2){
      window.open('http://sworkit.com/mfp', 'blank', 'location=no,AllowInlineMediaPlayback=yes');
    }
  }
  $scope.rateSworkit = function ($event) {
    $timeout(function(){
       upgradeNotice(2);
      }, 500);
  }
  $scope.downloadVideosChange = function(){
    if ($scope.userSettings.videosDownloaded){
      navigator.notification.confirm(
         'Ready to download the videos for autoplay in workouts? Total size: 40MB',
         $scope.downloadQuestion,
         'Download Videos',
         ['Yes','Cancel']
      );
    } else{
      navigator.notification.confirm(
         'Are you sure you want to delete the videos and disable autoplay?',
         $scope.deleteQuestion,
         'Delete Videos',
         ['Yes','Cancel']
      );
    }
  }

  $scope.downloadQuestion = function(buttonIndex){
    if (buttonIndex == 1){
      downloadProgress();
      downloadAllExercise();
      PersonalData.GetUserSettings.downloadDecision = false;
      localforage.setItem('userSettings', PersonalData.GetUserSettings);
    } else if(buttonIndex == 2){
      $scope.userSettings.videosDownloaded = false;
      $scope.$apply();
    }
  }

  $scope.deleteQuestion = function(buttonIndex){
    if (buttonIndex == 1){
      videoDownloader.deleteVideos()
      PersonalData.GetUserSettings.downloadDecision = false;
      PersonalData.GetUserSettings.videosDownloaded = false;
      localforage.setItem('userSettings', PersonalData.GetUserSettings);
    } else if(buttonIndex == 2){
      $scope.userSettings.videosDownloaded = true;
      $scope.$apply();
    }
  }

  $scope.$on('$destroy', function() {
               if ($scope.mfpWeightStatus.data){
                PersonalData.GetUserSettings.mfpWeight = true;
               }
               localforage.setItem('userSettings', PersonalData.GetUserSettings);
               localforage.setItem('userGoals', PersonalData.GetUserGoals);
               localforage.setItem('timingSettings', TimingData.GetTimingSettings);
               });
})

.controller('ExerciseListCtrl', function($scope, $ionicModal, $timeout, $http, $sce, WorkoutService) {
  $scope.exerciseCategories = [
    {shortName:"upper",longName:"Upper Body", exercises: WorkoutService.getExercisesByCategory('upper') },
    {shortName:"core",longName:"Core Strength", exercises: WorkoutService.getExercisesByCategory('core') },
    {shortName:"lower",longName:"Lower Body", exercises: WorkoutService.getExercisesByCategory('lower') },
    {shortName:"stretch",longName:"Stretches", exercises: WorkoutService.getExercisesByCategory('stretch') },
    {shortName:"back",longName:"Back Strength", exercises: WorkoutService.getExercisesByCategory('back') },
    {shortName:"cardio",longName:"Cardio", exercises: WorkoutService.getExercisesByCategory('cardio') },
    {shortName:"pilates",longName:"Pilates", exercises: WorkoutService.getExercisesByCategory('pilates') },
    {shortName:"yoga",longName:"Yoga", exercises: WorkoutService.getExercisesByCategory('yoga') }
  ];
  if (ionic.Platform.isAndroid()){
    $scope.androidPlatform = true;
  } else{
    $scope.androidPlatform = false;
  }
  $scope.showVideo = false;
  $scope.currentExercise = exerciseObject['Squats'];
  $ionicModal.fromTemplateUrl('show-video.html', function(modal) {
                              $scope.videoModal = modal;
                              }, {
                              scope:$scope,
                              animation: 'fade-implode',
                              focusFirstInput: false,
                              backdropClickToClose: false
                              });
  $scope.openVideoModal = function(exerciseEl) {
    $scope.currentExercise = exerciseObject[exerciseEl.name];
    $scope.networkConnection = navigator.onLine;
    $scope.videoModal.show();
      if ($scope.androidPlatform && device){
      if (PersonalData.GetUserSettings.videosDownloaded){
        window.plugins.html5Video.initialize({
          "videoplayerscreen" : $scope.currentExercise.video
        })
        $timeout(function(){
          window.plugins.html5Video.play("videoplayerscreen", function(){})
        }, 1400);
        $timeout(function(){
          angular.element(document.getElementById('videoplayerscreen')).css('opacity','1');
        }, 1500);
        $timeout(function(){
          angular.element(document.getElementById('videoplayerscreen')).css('opacity','0.00001');
        }, 0);
      } else{$timeout(function(){
          var videoPlayerFrame = angular.element(document.getElementById('videoplayerscreen'));
          videoPlayerFrame.css('opacity','0.00001');
          videoPlayerFrame[0].src = 'http://m.sworkit.com/assets/exercises/Videos/' + $scope.currentExercise.video;

          videoPlayerFrame[0].addEventListener("timeupdate", function() {
            if (videoPlayerFrame[0].duration > 0 
              && Math.round(videoPlayerFrame[0].duration) - Math.round(videoPlayerFrame[0].currentTime) == 0) {
              
              //if loop atribute is set, restart video
                if (videoPlayerFrame[0].loop) {
                    videoPlayerFrame[0].currentTime = 0;
                }
            }
          }, false);
          
          videoPlayerFrame[0].addEventListener("canplay", function(){
            videoPlayerFrame[0].removeEventListener("canplay", this, false);
            videoPlayerFrame[0].play();
            videoPlayerFrame.css('opacity','1');
          }, false);
          
          videoPlayerFrame[0].play();
        }, 100);
      }

    } else {
      $scope.videoAddress = 'video/' + $scope.currentExercise.video;
    }
    var calcHeight = (angular.element(document.getElementsByClassName('modal')).prop('offsetHeight'))   * .7;
    calcHeight = calcHeight +'px';
    // if (ionic.Platform.isAndroid() && !isKindle()){
    //   angular.element(document.querySelector('#videoplayer')).html("<video id='video2' poster='img/exercises/"+$scope.currentExercise.image+"' preload='auto' autoplay loop muted webkit-playsinline='webkit-playsinline' ><source src='"+$scope.videoData.videoURL+"'></source></video>");
    // }
    $scope.showVideo = true;

  };
  $scope.cancelVideoModal = function() {
    // if (ionic.Platform.isAndroid() && !isKindle()){
    //   angular.element(document.querySelector('#videoplayer')).html("");
    // }
    $scope.videoData = {youtubeURL: '',videoURL: ''};
    var videoPlayerFrame = angular.element(document.getElementById('videoplayerscreen'));
    if ($scope.androidPlatform){
      videoPlayerFrame[0].src = '';
    }
    $scope.videoModal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.videoModal.remove();
  });
})

.controller('HelpCtrl', function($scope, UserService) {
  angular.element(document.getElementsByClassName('bar-stable')).addClass('blue-bar');
  $scope.$on('$destroy', function() {
               angular.element(document.getElementsByClassName('bar-stable')).removeClass('blue-bar');
               });

  $scope.sendFeedback = function ($event) {
     if (ionic.Platform.isAndroid()){
        $scope.appVersion = '5.00.10'
      } else {
        $scope.appVersion = '3.0.3'
      }
      var emailBody = "<p>Device Type: " + device.model + "</p><p>Platform Version: "  + device.platform + " " + device.version  + "</p>" + "<p>App Version: "+$scope.appVersion+"</p><p>Feedback: </p>";
      //Lite
      window.plugin.email.open({
                       to:      ['contact@sworkit.com'],
                       subject: 'Feedback: Sworkit',
                       body:    emailBody,
                       isHtml:  true
                       });
  };
  $scope.openInstructions = function ($event){
    window.open('http://sworkit.com/about#instructions', '_blank', 'location=yes,AllowInlineMediaPlayback=yes');
  }
  $scope.openFAQ = function ($event){
    window.open('http://sworkit.com/about#faq', '_blank', 'location=yes,AllowInlineMediaPlayback=yes');
  }
  $scope.openTOS = function ($event){
    window.open('http://m.sworkit.com/TOS.html', '_blank', 'location=yes,AllowInlineMediaPlayback=yes');
  }
  $scope.openPrivacy = function ($event){
    window.open('http://m.sworkit.com/privacy.html', '_blank', 'location=yes,AllowInlineMediaPlayback=yes');
  }
  $scope.openRules = function ($event){
    window.open('http://m.sworkit.com/rules.html', '_blank', 'location=yes,AllowInlineMediaPlayback=yes');
  }
  $scope.shareTwitter = function ($event) {
    if (device){
      window.plugins.socialsharing.shareViaTwitter('Download @Sworkit for customizable circuit training workouts.', null, 'http://sworkit.com', function(){sessionm.phonegap.logAction('Share')}, null)
    }
  }
  $scope.shareFacebook = function ($event) {
    if (device){
      window.plugins.socialsharing.shareViaFacebook('Download #Sworkit for customizable circuit training workouts. at http://sworkit.com', null, function(){sessionm.phonegap.logAction('Share')}, null)
    }
  }
  $scope.shareEmail = function ($event) {
      window.plugin.email.open({
                       to:      [],
                       subject: 'Check out Sworkit',
                       body:    'Download Sworkit for customizable circuit training workouts. More at http://sworkit.com',
                       isHtml:  true
                       });
  }
  $scope.rateSworkit = function ($event) {
    if (device.platform.toLowerCase() == 'ios') {
      window.open('http://itunes.apple.com/app/id527219710', '_system', 'location=no,AllowInlineMediaPlayback=yes');
    } else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=sworkitapp.sworkit.com', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=sworkitapp.sworkit.com"), '_system');}
             );
    }  else {
      window.open('market://details?id=sworkitapp.sworkit.com', '_system');
    }
  }
  var hiddenURL = window.open('http://sworkit.com/app', '_blank', 'hidden=yes,AllowInlineMediaPlayback=yes');
})

.controller('PartnerAppsCtrl', function($scope, $location, UserService) {
  angular.element(document.getElementsByClassName('bar-stable')).addClass('blue-bar');
  $scope.$on('$destroy', function() {
               angular.element(document.getElementsByClassName('bar-stable')).removeClass('blue-bar');
               });
  $scope.learnNexercise = function (){
    if (device.platform.toLowerCase() == 'ios') {
      window.open('http://nxr.cz/nex-ios', '_system', 'location=no,AllowInlineMediaPlayback=yes');
    }  else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=com.nexercise.client.android', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=com.nexercise.client.android"), '_system');}
             );
    }  else {
      window.open('market://details?id=com.nexercise.client.android', '_system')
    }
  }
  $scope.learnMyFitnessPal = function (){
    $location.path('/app/settings');
  }
})

.controller('SworkitProAppCtrl', function($scope, $rootScope,  $ionicSideMenuDelegate, $location, UserService) {
  angular.element(document.getElementsByClassName('bar-stable')).addClass('blue-bar').addClass('title-margin');
  $scope.$on('$destroy', function() {
               angular.element(document.getElementsByClassName('bar-stable')).removeClass('blue-bar').removeClass('title-margin');
               });
  $scope.downloadSworkitPro = function (){
    trackEvent('More Action', 'Install Sworkit Pro', 0);
    setTimeout(function(){
      if (device.platform.toLowerCase() == 'ios') {
        window.open('http://nxr.cz/sk-pro-ios', '_system', 'location=no,AllowInlineMediaPlayback=yes');
      }  else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=sworkitproapp.sworkit.com', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=sworkitproapp.sworkit.com"), '_system');}
             );
      } else {
      window.open('market://details?id=sworkitproapp.sworkit.com', '_system')
      }
    }, 400)
  }
  $scope.goBack = function(){
    if ($rootScope.$viewHistory.backView !== null){
      $location.path($rootScope.$viewHistory.backView.url);
      $ionicSideMenuDelegate.toggleLeft(false);
    } else {
      $location.path('/app/home');
      $ionicSideMenuDelegate.toggleLeft(false);
    }
    
  }
})

.controller('NexerciseAppCtrl', function($scope, $location, UserService) {
  angular.element(document.getElementsByClassName('bar-stable')).addClass('blue-bar');
  $scope.$on('$destroy', function() {
               angular.element(document.getElementsByClassName('bar-stable')).removeClass('blue-bar');
               });
  $scope.downloadNexercise = function (){
    trackEvent('More Action', 'Install Nexercise', 0);
    setTimeout(function(){
      if (device.platform.toLowerCase() == 'ios') {
        window.open('http://nxr.cz/nex-ios', '_system', 'location=no,AllowInlineMediaPlayback=yes');
      }  else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=com.nexercise.client.android', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=com.nexercise.client.android"), '_system');}
             );
      } else {
      window.open('market://details?id=com.nexercise.client.android', '_system')
      }
    }, 400)
  }
})

.directive('integer', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(function(viewValue){
                return parseInt(viewValue);
            });
        }
    };
});

function showTimingModal($scope, $ionicModal, $timeout, WorkoutService, parent){
  $scope.toggleOptions = {data:true}
  if (ionic.Platform.isAndroid()){
    $scope.androidPlatform = true;
  } else{
    $scope.androidPlatform = false;
  }
  if (parent){
    $scope.toggleOptions = {data:false};
  }
  var tempExerciseTime = $scope.advancedTiming.exerciseTime;
    $ionicModal.fromTemplateUrl('advanced-timing.html', function(modal) {
                                $scope.timeModal = modal;
                                }, {
                                scope:$scope,
                                animation: 'slide-in-up',
                                focusFirstInput: false,
                                backdropClickToClose: false
                                });
    $scope.openModal = function() {
      $scope.timeModal.show();
    };
    $scope.closeModal = function() {
      TimingData.GetTimingSettings.breakFreq = parseInt(TimingData.GetTimingSettings.breakFreq);
      TimingData.GetTimingSettings.exerciseTime = parseInt(TimingData.GetTimingSettings.exerciseTime);
      TimingData.GetTimingSettings.breakTime = parseInt(TimingData.GetTimingSettings.breakTime);
      TimingData.GetTimingSettings.transitionTime = parseInt(TimingData.GetTimingSettings.transitionTime);
      if ($scope.extraSettings.transition){
        $scope.advancedTiming.transitionTime = 5;
        TimingData.GetTimingSettings.transitionTime = 5;
      } else {
        $scope.advancedTiming.transitionTime = 0;
        TimingData.GetTimingSettings.transitionTime = 0;
      }
      
      if (parent && tempExerciseTime !== $scope.advancedTiming.exerciseTime){
        var singleSeconds = $scope.advancedTiming.exerciseTime;
        if (singleSeconds > 60){
          $scope.singleTimer.minutes = Math.floor(singleSeconds / 60);
          $scope.singleTimer.seconds = singleSeconds % 60;
        } else {
          $scope.singleTimer.minutes = 0;
          $scope.singleTimer.seconds = singleSeconds;
        }
        $scope.updateTime();
      } else if (parent){
        playInlineVideo($scope.advancedTiming.autoPlay);
        localforage.setItem('timingSettings', TimingData.GetTimingSettings);
      } else {
          localforage.setItem('timingSettings', TimingData.GetTimingSettings);
      }
      $scope.timeModal.hide();
      $scope.timeModal.remove();    };
    $scope.resetDefaults =  function(){
      var getAudio = TimingData.GetTimingSettings.audioOption;
      var getWarning = TimingData.GetTimingSettings.warningAudio;
      var getCountdown = TimingData.GetTimingSettings.countdownBeep;
      var getStyle = TimingData.GetTimingSettings.countdownStyle;
      var getAutoPlay = TimingData.GetTimingSettings.autoPlay;
      $scope.advancedTiming = {"customSet":false,"breakFreq":5,"exerciseTime":30,"breakTime":30,"transitionTime":0,"transition":false,"randomizationOption":true,"workoutLength":60, "audioOption": getAudio, "warningAudio": getWarning, "countdownBeep": getCountdown, "autoPlay": getAutoPlay, "countdownStyle": getStyle} 
      TimingData.GetTimingSettings = $scope.advancedTiming;
      WorkoutService.getTimingIntervals = function () {
        var timingData = {
          customSet: false,
          breakFreq: 5,
          exerciseTime: 30,
          breakTime: 30,
          transitionTime: 0,
          transition:false,
          randomizationOption: true,
          workoutLength: 60,
          audioOption: getAudio, 
          warningAudio: getWarning,
          countdownBeep: getCountdown,
          autoPlay: getAutoPlay,
          countdownStyle: getStyle
        };
        return timingData;
      }
    }
    $scope.$on('$destroy', function() {
               $scope.timeModal.remove();
               });
    $timeout(function(){
             $scope.openModal();
             }, 0);
}

function buildStats($scope){
  $scope.getTotal = function(){
            window.db.transaction(
                           function(transaction) {
                           transaction.executeSql("SELECT SUM(minutes_completed) AS minutes FROM SworkitFree",
                                                  [],
                                                  function(tx, results){
                                                    $scope.totals.totalEver = results.rows.item(0)["minutes"] || 0;
                                                    $scope.$apply();
                                                  },
                                                  null)
                           }
                           );
            window.db.transaction(
                           function(transaction) {
                           transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-1 day')) GROUP BY strftime('%Y-%m-%d', created_on)",
                                                  [],
                                                  function(tx, results){
                                                    try{
                                                      if (results.rows.item(0)){
                                                       $scope.totals.todayMinutes = results.rows.item(results.rows.length -1)["minutes"];
                                                       $scope.totals.todayCalories = results.rows.item(results.rows.length -1)["calories"];
                                                      }
                                                    } catch(e){
                                                      $scope.totals.todayMinutes = 0;
                                                      $scope.totals.todayCalories = 0;
                                                    }
                                                  },
                                                  null)
                           }
                           );
            window.db.transaction(
                         function(transaction) {
                         transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-7 day')) GROUP BY strftime('%Y-%m-%d', created_on)",
                                                [],
                                                function(tx, results){
                                                    dateHashMin = {}
                                                    dateHashCal = {}
                                                    for (var i = 0; i < results.rows.length; i++) { dateHashMin[results.rows.item(i)["day"]] = results.rows.item(i)["minutes"];
                                                    dateHashCal[results.rows.item(i)["day"]] = results.rows.item(i)["calories"]; }
                                                    
                                                    $scope.graphData7Min = [];
                                                    $scope.graphData7Cal = [];
                                                    for (var i = 0; i < 7; i++) {
                                                        date = new Date();
                                                        date.setTime(date.getTime() - (i * 24 * 60 * 60 * 1000));
                                                        
                                                        day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate().toString();
                                                        month = (date.getMonth() < 9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
                                                        createdOnFormat = date.getFullYear() + "-" + month + "-" + day;
                                                        
                                                        minutes = dateHashMin[createdOnFormat] || 0;
                                                        calories = dateHashCal[createdOnFormat] || 0;
                                                        
                                                        
                                                        displayDate = (i == 0) ? "today" : (date.getMonth() + 1) + "." + date.getDate();
                                                        
                                                        $scope.graphData7Min.unshift([displayDate, minutes]);
                                                        $scope.graphData7Cal.unshift([displayDate, calories]);
                                                    }
                                                  },
                                                null)
                         }
                         );
            window.db.transaction(
                                     function(transaction) {
                                     transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree WHERE created_on > (SELECT DATETIME('now', '-30 day')) GROUP BY strftime('%Y-%m-%d', created_on)",
                                                            [],
                                                            function(tx, results){
                                                                var totalMonthMinutes = 0;
                                                                dateHashMin30 = {}
                                                                dateHashCal30 = {}
                                                                for (var i = 0; i < results.rows.length; i++) { dateHashMin30[results.rows.item(i)["day"]] = results.rows.item(i)["minutes"];
                                                                dateHashCal30[results.rows.item(i)["day"]] = results.rows.item(i)["calories"]; }
                                                                
                                                                $scope.graphData30Min = [];
                                                                $scope.graphData30Cal = [];
                                                                for (var i = 0; i < 30; i++) {
                                                                    date = new Date();
                                                                    date.setTime(date.getTime() - (i * 24 * 60 * 60 * 1000));
                                                                    
                                                                    day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate().toString();
                                                                    month = (date.getMonth() < 9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
                                                                    createdOnFormat = date.getFullYear() + "-" + month + "-" + day;
                                                                    
                                                                    minutes = dateHashMin30[createdOnFormat] || 0;
                                                                    calories = dateHashCal30[createdOnFormat] || 0;
                                                                    
                                                                    
                                                                    displayDate = (i == 0) ? "today" : (date.getMonth() + 1) + "." + date.getDate();
                                                                    if (minutes > 0){
                                                                      totalMonthMinutes++
                                                                    }
                                                                     
                                                                    $scope.graphData30Min.unshift([displayDate, minutes]);
                                                                    $scope.graphData30Cal.unshift([displayDate, calories]);
                                                                }
                                                                $scope.totals.totalMonthMin = totalMonthMinutes;
                                                              },
                                                            null)
                                     }
                                     );
            window.db.transaction(
                                     function(transaction) {
                                     transaction.executeSql("SELECT type, SUM(minutes_completed) AS minutes_completed FROM SworkitFree GROUP BY type",
                                                            [],
                                                            function(tx, results){
                                                              if (results.rows.length === 0){
                                                              }
                                                              else{
                                                                  var totalMin=0;
                                                                  
                                                                  for (var i=0; i<results.rows.length; i++){
                                                                      
                                                                      totalMin+=parseFloat(results.rows.item(i)['minutes_completed']);
                                                                      
                                                                  }
                                                                  
                                                                  $scope.dataPie = new Array();
                                                                  
                                                                  for (var i=0; i<results.rows.length; i++){
                                                                      
                                                                      var a = new Array();
                                                                      var typeName = LocalData.GetWorkoutTypes[results.rows.item(i)['type']].activityNames;
                                                                      a.push({'key': typeName, 'y':results.rows.item(i)['minutes_completed']});
                                                                      
                                                                      if ((results.rows.item(i)['minutes_completed'])/totalMin > 0){
                                                                        $scope.dataPie.push(a[0]);
                                                                      }

                                                                  }
                                                                  
                                                              }
                                                              
                                                              $scope.drawGraph();
                                                              $scope.$apply();
                                                          },
                                                            null)
                                     }
                                     );
            window.db.transaction(
                           function(transaction) {
                           transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree GROUP BY strftime('%Y-%m-%d', created_on) ORDER BY minutes DESC LIMIT 1",
                                                  [],
                                                  function(tx, results){
                                                    try{
                                                      if (results.rows.item(0)){
                                                       $scope.totals.topMinutes = results.rows.item(results.rows.length -1)["minutes"];
                                                       $scope.totals.topDayMins = results.rows.item(results.rows.length -1)["day"];
                                                      }
                                                    } catch(e){
                                                      $scope.totals.topMinutes = 0;
                                                      $scope.totals.topDayMins = '';
                                                    }
                                                  },
                                                  null)
                           }
                           );
            window.db.transaction(
                           function(transaction) {
                           transaction.executeSql("SELECT strftime('%Y-%m-%d', created_on) AS day, SUM(minutes_completed) AS minutes, SUM(calories) AS calories FROM SworkitFree GROUP BY strftime('%Y-%m-%d', created_on) ORDER BY calories DESC LIMIT 1",
                                                  [],
                                                  function(tx, results){
                                                    try{
                                                      if (results.rows.item(0)){
                                                       $scope.totals.topCalories = results.rows.item(results.rows.length -1)["calories"];
                                                       $scope.totals.topDayCals = results.rows.item(results.rows.length -1)["day"];
                                                      }
                                                    } catch(e){
                                                      $scope.totals.topCalories = 0;
                                                      $scope.totals.topDayCals = '';
                                                    }
                                                    $scope.$apply();
                                                  },
                                                  null)
                           }
                           );
        }
  $scope.getTotal();
  $scope.weeklyMinutes = parseInt(window.localStorage.getItem('weeklyTotal'));
  $scope.drawGraph = function(){
    $scope.dailyData = [
      {
          "key": "Series1",
          "color": "#FF8614",
          "values": [
              ["You" , $scope.totals.todayMinutes ],
              ["Goal" , $scope.goalSettings.dailyGoal ]
          ]
      }
    ];
    $scope.weeklyData = [
        {
            "key": "Series2",
            "color": "#FF8614",
            "values": [
                ["You" , $scope.weeklyMinutes ],
                ["Goal" , $scope.goalSettings.weeklyGoal ]
            ]
        }
    ];
    $scope.weeklyCals = [
                    {
                        "key": "Series 1",
                        "color": "#FF8614",
                        "values": $scope.graphData7Cal
                    }
              ];
    $scope.weeklyMins = [
                  {
                      "key": "Series 1",
                      "color": "#FF8614",
                      "values": $scope.graphData7Min
                  }
            ];
    
    $scope.monthlyCals = [
                  {
                      "key": "Series 1",
                      "color": "#FF8614",
                      "values": $scope.graphData30Cal
                  }
            ];
    
    $scope.monthlyMins = [
                  {
                      "key": "Series 1",
                      "color": "#FF8614",
                      "values": $scope.graphData30Min
                  }
            ];
    }

    $scope.xFunction = function(){
        return function(d) {
            return d.key;
        };
    }
    $scope.yFunction = function(){
        return function(d) {
            return d.y;
        };
    }

    $scope.descriptionFunction = function(){
        return function(d){
            return d.key;
        }
    }
}

function installWorkout(workoutName, workoutList){
  if (device){
    navigator.notification.confirm(
                                   'This will replace your current custom workout. With Sworkit Pro you can save multiple custom workouts.',
                                   function(button){
                                    if (button == 2){
                                      PersonalData.GetCustomWorkouts.savedWorkouts[0] ={"name": workoutName,"workout": workoutList};
                                      localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                                      trackEvent('URL Scheme', workoutName, 0)
                                    }},
                                   'Import Custom Workout?',
                                   ['Cancel','OK']
                                   );
  }
}
function showNotification(message, style, duration){
  var notifyEl = angular.element(document.getElementById('status-notification'));
  notifyEl.html('<button class="button button-full '+style+' fade-in-custom">'+message+'</button>');
  setTimeout(function(){
    notifyEl.html('<button class="button button-full '+style+' fade-out-custom">'+message+'</button>');
    notifyEl.html('');
  }, duration)
}
function getMinutesObj(){
    var minuteObj = {selected: 0, times:[]};
    for (i=0;i<60;i++){
        var stringNum = (i < 10) ? '0' + i : i;
        minuteObj.times.push({'id':i,'time':stringNum});
    }
    return minuteObj;
}
function forceUpdate(){
  if (device){
    navigator.notification.confirm(
                                   'Please update Sworkit',
                                   upgradeNotice,
                                   'Not Available',
                                   ['Cancel','Upgrade']
                                   );
  } else{
    alert('Force Update');
  }
}
function upgradeNotice(button){
  if (button == 2){
    if (device.platform.toLowerCase() == 'ios') {
      window.open('http://itunes.apple.com/app/id527219710', '_system', 'location=no,AllowInlineMediaPlayback=yes');
    } else if (isAmazon()){
        window.appAvailability.check('com.amazon.venezia', function() {
             window.open('amzn://apps/android?p=sworkitapp.sworkit.com', '_system')},function(){
             window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=sworkitapp.sworkit.com"), '_system');}
             );
    } else {
      window.open('market://details?id=sworkitapp.sworkit.com', '_system');
    }
  }
}

function playInlineVideo(autoState){
  if (autoState && ionic.Platform.isAndroid() && device){
    window.plugins.html5Video.play("inlinevideo", function(){
    })
  }
  else if(autoState){
    var videoElement = angular.element(document.getElementById('inline-video'))[0];
    videoElement.play();
    videoElement.muted= true;
  }
}
function setBackButton($scope,$location,$ionicPlatform, customLocation){
  $scope.customBack = $ionicPlatform.registerBackButtonAction(
          function () {
              if (customLocation){
                var customString = '/app/' + customLocation;
                $location.path(customString);
              } else{
                $location.path('/app/home');
              }
              
          }, 100
  );
  $scope.$on('$destroy', $scope.customBack);
}
