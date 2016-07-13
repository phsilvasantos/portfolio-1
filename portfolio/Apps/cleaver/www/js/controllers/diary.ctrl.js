angular.module('cleverbaby.controllers')
    .controller('DiaryCtrl', ['$location', '$scope', '$ionicModal', 'DailytipService', '$ionicSlideBoxDelegate', 'ActivityService', 'BabyModal', '$rootScope', 'network', '$interval', '$localStorage', 'ConvertunitService',
        function ($location, $scope, $ionicModal, DailytipService, $ionicSlideBoxDelegate, ActivityService, BabyModal, $rootScope, network, $interval, $localStorage, convert) {

            $scope.editBaby = function(){
                BabyModal.showModal($rootScope.baby);
            };            

            var start, limit;
            function load(baby){
                $scope.canBeloadedMore = true;
                start = 0;
                limit = 10;
                ActivityService.getAllActivitiesByBabyId(baby.uuid, start, limit, false).then(function(activities){
                    $scope.activities = activities;
                    console.log($scope.activities );
                });
                ActivityService.getTodayCount(baby.uuid).then(function(counts) {
                    $scope.TodayPlay = counts.playCount > 0;
                    $scope.TodayBath = counts.bathCount > 0;
                    $scope.BathCount = counts.bathCount;
                    $scope.PlayCount = counts.playCount;
                    $scope.DiaperCount = counts.diaperCount;
                    $scope.NurseCount = counts.nurseCount;
                    $scope.SleepCount = counts.sleepCount;
                });
            }

            $scope.refresherPromise = null;
            $scope.babysAge = '';

            $scope.hasBabyAge = function () {
                if(angular.isUndefined($localStorage.babies))
                    return false;
                if(angular.isUndefined($localStorage.babies[$rootScope.babyId]))
                    return false;
                if($localStorage.babies[$rootScope.babyId].born)
                    return true;
                return false;
            };

            $scope.calculateEtaTimes = function () {
                // get average times
                var feedEtaTime = 0,
                    diaperEtaTime = 0;

                if($localStorage.settings && $localStorage.settings.eta && $localStorage.settings.eta.feed && !isNaN($localStorage.settings.eta.feed) && $localStorage.settings.eta.feed > 0) {
                    feedEtaTime = $localStorage.settings.eta.feed;
                } else {
                    feedEtaTime = ActivityService.getActivityEtaByType($rootScope.babyId, 'feed');
                }

                if($localStorage.settings && $localStorage.settings.eta && $localStorage.settings.eta.diaper && !isNaN($localStorage.settings.eta.diaper) && $localStorage.settings.eta.diaper > 0) {
                    diaperEtaTime = $localStorage.settings.eta.diaper;
                } else {
                    diaperEtaTime = ActivityService.getActivityEtaByType($rootScope.babyId, 'diaper');
                }

                var feedLastActivity = ActivityService.getLastActivityByType($rootScope.babyId, 'feed'),
                    diaperLastActivity = ActivityService.getLastActivityByType($rootScope.babyId, 'diaper');

                // feed calculation
                if(feedLastActivity && feedEtaTime !== null) {
                    var now = moment(),
                        feedBeginning =  moment(feedLastActivity.time),
                        feedPassed = now.diff(feedBeginning, 'minutes', true);

                    var feedRemain = Math.max(feedEtaTime - feedPassed, 0),
                        feedProgress = feedEtaTime == 0 ? 0 : Math.round(100 * feedPassed / feedEtaTime);

                    $scope.feedEtaProgress = Math.min(100, Math.max(0, feedProgress));

                    if(feedRemain <= 0) {
                        $scope.feedEtaText = 'time to feed';
                    } else {
                        $scope.feedEtaText = moment.duration(feedRemain, 'minutes').humanize();
                    }

                    $scope.feedEtaAvailable = true;
                } else {
                    $scope.feedEtaAvailable = false;
                }

                // diaper calculation
                if(diaperLastActivity && diaperEtaTime !== null) {
                    var now = moment(),
                        diaperBeginning =  moment(diaperLastActivity.time),
                        diaperPassed = now.diff(diaperBeginning, 'minutes', true);

                    var diaperRemain = Math.max(diaperEtaTime - diaperPassed, 0),
                        diaperProgress = diaperEtaTime == 0 ? 0 : Math.round(100 * diaperPassed / diaperEtaTime);

                    $scope.diaperEtaProgress = Math.min(100, Math.max(0, diaperProgress));
                    
                    if(diaperRemain <= 0) {
                        $scope.diaperEtaText = 'time to change';
                    } else {
                        $scope.diaperEtaText = moment.duration(diaperRemain, 'minutes').humanize();
                    }

                    $scope.diaperEtaAvailable = true;
                } else {
                    $scope.diaperEtaAvailable = false;
                }
            }

            $scope.startRefresher = function () {
                if($scope.refresherPromise) {
                    $interval.cancel($scope.refresherPromise);
                }
                
                $scope.refresherPromise = $interval(function () {
                    $scope.calculateEtaTimes();
                }, 60000);
            };

            $scope.stopRefresher = function () {
                if($scope.refresherPromise)
                    $interval.cancel($scope.refresherPromise);
            };

            // progress coloring rules
            $scope.getProgressColor = function (value) {
                if(value >= 100)
                    return '#ff5500' // red
                if(value > 50) {
                    return '#ffcc66'; // yellow
                }
                return '#66cc00'; // green                
            };

            // updates baby birthday on request
            function updateBirth (baby) {
                moment.locale('en');
                // fill baby information
                var born = moment(baby.born),
                    now = moment();
                var ms = now.diff(born, 'milliseconds', true);
                $scope.babysAge = humanizeDuration(ms, {
                    language: "en",
                    spacer: " ",
                    round: true,
                    delimiter: " ",
                    units: ["y", "mo", "d"]
                });
            }

            function updateAvgTimes (baby) {
                $scope.calculateEtaTimes();
                // start automatic refresh
                $scope.startRefresher();
            }

            // general function for UPDATING diary quick data
            function updateActivityQuickData (baby) {
                updateBirth(baby);
                updateAvgTimes(baby);
                
                var lastGrowth = ActivityService.getLastActivityByType($rootScope.babyId, 'growth');
                if(lastGrowth) {
                    $scope.babysWeight = convert.weight[lastGrowth.growth_weight_unit].toString(lastGrowth.growth_weight) + ", "; 
                    $scope.babysHeight = convert.length[lastGrowth.growth_height_unit].toString(lastGrowth.growth_height);
                } else {
                    $scope.babysWeight = '';
                    $scope.babysHeight = '';
                }
            }

            if($rootScope.babyId){
                load($rootScope.baby);
                updateActivityQuickData($rootScope.baby);
            }
            $rootScope.$on('babySelected', function(event, baby){
                load(baby);
                updateActivityQuickData(baby);
            });

            $scope.loadMore = function(){
                loadMore(limit).then(function(){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            };

            function loadMore(count){
                start+=count;
                return ActivityService.getAllActivitiesByBabyId($rootScope.baby.uuid, start, count, false).then(function(activities){
                    if(activities.length == 0){
                        $scope.canBeloadedMore = false;
                    }
                    Array.prototype.push.apply($scope.activities, activities);
                    return activities;
                });
            }

            /**
             * Add activity by the checkbox.
             * @param type - type of activity
             */
            $scope.addActivityByType = function(type){
                var requiredScope = 'Today'+ type[0].toUpperCase() + type.substring(1);
                $scope[requiredScope] = true;
                var data = {
                    time: new Date(),
                    type: type,
                    media: []
                };
                ActivityService.addActivity(data, $rootScope.baby.uuid).then(function(activity){
                    $scope.$broadcast('activityAdd', activity);
                });
            };

            function isToDay(date){
                return new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
            }

            function isFuture(date){
                return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
            }

            function getActivityByUUID(uuid){
                for(var i = 0; i<$scope.activities.length; ++i) {
                    if ($scope.activities[i].uuid == uuid) {
                        return i;
                    }
                }
            }

            function increaseTodayStatus(activity){
                if(isToDay(activity.time)){
                    if(activity.type == 'diaper'){
                        ++$scope.DiaperCount;
                    }
                    if(activity.type == 'nurse'){
                        ++$scope.NurseCount;
                    }
                    if(activity.type == 'bath'){
                        ++$scope.BathCount;
                        $scope.TodayBath = true;
                    }
                    if(activity.type == 'play'){
                        ++$scope.PlayCount;
                        $scope.TodayPlay = true;
                    }
                    if(activity.type == 'sleep'){
                        ++$scope.SleepCount;
                        $scope.TodaySleep = true;
                    }
                }
            }

            function decreaseTodayStatus(activity){
                if(activity.type == 'diaper'){
                    --$scope.DiaperCount;
                }
                if(activity.type == 'nurse'){
                    --$scope.NurseCount;
                }
                if(activity.type == 'bath'){
                    --$scope.BathCount;
                    $scope.TodayBath = $scope.BathCount>0;
                }
                if(activity.type == 'play'){
                    --$scope.PlayCount;
                    $scope.TodayPlay = $scope.PlayCount>0;
                }
                if(activity.type == 'sleep'){
                    --$scope.SleepCount;
                    $scope.TodaySleep = $scope.SleepCount>0;
                }
            }


            $scope.$on('activityAdd', function(event, activity){
                if(moment().diff(moment(activity.time)) < 0)
                    return;
                if($scope.activities.length < limit || activity.time > $scope.activities[$scope.activities.length-1].time){
                    ++start;
                    increaseTodayStatus(activity);
                    refreshActivity(activity, 'add');
                } else {
                    $scope.canBeloadedMore = true;
                }
            });

            $scope.$on('activityEdit', function(event, activity){
                var i = getActivityByUUID(activity.uuid);
                if(isToDay($scope.activities[i].time) && !isToDay(activity.time)){
                    decreaseTodayStatus(activity);
                } else if(!isToDay($scope.activities[i].time) && isToDay(activity.time)){
                    increaseTodayStatus(activity);
                }

                if(!isFuture(activity.time) && (activity.time > $scope.activities[$scope.activities.length-1].time || $scope.activities.length < limit)) {
                    refreshActivity(activity, 'edit', i);
                } else {
                    --start;
                    refreshActivity(activity, 'delete', i);
                    $scope.canBeloadedMore = true;
                }
            });

            $scope.$on('activityDelete', function (event, activity) {
                var i = getActivityByUUID(activity.uuid);
                refreshActivity(activity, 'delete', i);
                $scope.canBeloadedMore = true;
            });

            $scope.$on('babyUpdate', function (event, baby) {
                updateBirth(baby);
            });

            $scope.$on('babyDelete', function (event, baby) {
                updateBirth(baby);
            });

            function refreshActivity(activity, mode, index){
                var activities = angular.copy($scope.activities);
                function addActivity(activity){
                    for(var i=0; i<activities.length; ++i){
                        if(activity.time>activities[i].time){
                            break;
                        }
                    }
                    var middle = [];
                    Array.prototype.push.apply(middle, activities.slice(0, i));
                    middle.push(activity);
                    Array.prototype.push.apply(middle, activities.slice(i, activities.length));
                    activities = middle;
                }
                function deleteActivity(i){
                    var middle = [];
                    Array.prototype.push.apply(middle, activities.slice(0, i));
                    Array.prototype.push.apply(middle, activities.slice(i+1, activities.length));
                    activities = middle;
                }

                if(mode == 'add'){
                    addActivity(activity);
                }
                if(mode =='delete'){
                    deleteActivity(index);
                }
                if(mode == 'edit'){
                    deleteActivity(index);
                    addActivity(activity);
                }
                $scope.activities = activities;

                updateActivityQuickData($rootScope.baby);
            }

            $scope.editBaby = function(){
                BabyModal.showModal($rootScope.baby);
            };

            var showTip = DailytipService.showDailtyTip();

            if(showTip) {
                var activeBaby = {'gender':'m', 'birthday': 1429682270000 };
                DailytipService.getTranslatedTip(activeBaby).then(function(dailyTip){
                    $scope.showTip = true;
                    $scope.dailyTip = dailyTip.text;
                    $scope.clickTip = function() {
                        $location.path(dailyTip.route);
                    };
                });
            }

            /**
             * This function hides the daily tip
             */
            $scope.hideDailyTip = function(){
                $scope.showTip = false;
                DailytipService.saveLastHideDailyTip();
            };

            $scope.$on('$ionicView.enter', function(){
                $ionicSlideBoxDelegate.update();
            });

            // ETA Settings
            $ionicModal.fromTemplateUrl('templates/modals/etasettings.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.etaSettingsModal = modal;
            });

            $scope.etaSetting = function(type) {
                $scope.etaSettingsModal.mode = type;
                $scope.etaSettingsModal.show();
            };

            // Home timeline helpers
            $scope.getElementHeight = function (activity, index) {
                var titledHeight = 79,
                    normalHeight = 50;

                if(index == 0)
                    return titledHeight;

                if($scope.activities.length <= 0)
                    return normalHeight;

                var firstMoment = moment($scope.activities[index - 1].time),
                    nextMoment = moment(activity.time);

                if(nextMoment.isSame(firstMoment, 'd'))
                    return normalHeight;
                return titledHeight;
            };

            $scope.showTitle = function (activity, index) {
                if(index == 0)
                    return true;

                if($scope.activities.length <= 0)
                    return false;

                var firstMoment = moment($scope.activities[index - 1].time),
                    nextMoment = moment(activity.time);

                return !nextMoment.isSame(firstMoment, 'd');
            };

            $scope.nextIsTitle = function (activity, index) {
                if($scope.activities.length <= 0 || index == ($scope.activities.length - 1) || index > ($scope.activities.length - 1))
                    return true;
                
                var firstMoment = moment($scope.activities[index + 1].time),
                    nextMoment = moment(activity.time);

                return !nextMoment.isSame(firstMoment, 'd');
            };

            $scope.getCalendarDay = function (date) {
                var calDay = moment(date).calendar(),
                    timeIndex = String(calDay).indexOf(' at ');
                if(timeIndex == -1)
                    return moment(date).format('ddd, LL');
                return calDay.substring(0, timeIndex);
            };
        }
    ]
);
