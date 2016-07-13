angular.module('cleverbaby.directives')
    .directive('timerNurse', ['ActivityService', '$timeout', '$interval', '$rootScope', function (ActivityService, $timeout, $interval, $rootScope) {

    	var texts = {
    		'buttonLeft': ['Start Left', 'END LEFT'],
    		'buttonRight': ['Start Right', 'END RIGHT']
    	};

    	var timerEventDataTemplate = {
    		'type': 'nurse',
    		'eventName': '',
    		'backPropagation': false,
    		'direction': false,
    		'command': '', // start, stop
    		'isRunning': false,
    		'isShown': false,
    		'params': {}, // other parameters
    		'activity': null,
    	};

        return {
            restrict: 'E',
            scope: {
                'isShown': '=',
            },
            templateUrl: 'templates/elements/timer-nurse.html',
            link: function (scope, element) {
            	// private
            	var intervalId = null,
            		intervalMinute = null,
            		intervalTrackTime = null;
            	
            	// public
            	scope.isShown = false;
            	scope.inProgress = 'none';
            	scope.activity = null;
            	scope.timeLeft = 0;
            	scope.timeRight = 0;
            	scope.timeBoth = 0;

            	// fomatted values
            	scope.timeLeftF = 0;
            	scope.timeRightF = 0;
            	scope.timeBothF = 0;

            	// button texts (future updates happens depending progress)
            	scope.leftButton = texts.buttonLeft[0];
            	scope.rightButton = texts.buttonRight[0];

            	function formatTime(t) {
            		var d = moment.duration(t, 'seconds'),
            			s = d.seconds(),
            			m = d.minutes();

        			var st = String(s),
        				mt = String(m);

            		if(s === 0) st = '00';
            		else if(s < 10) st = '0' + String(s);

            		if(m === 0) mt = '00';
            		else if(m < 10) mt = '0' + String(m);

            		return mt + ':' + st;
            	}

            	function roundToMinutes(s) {
            		if(isNaN(s))
            			return 0;
            		var m = 0;
            		if(s % 60 <= 30) {
            			m = (s - s % 60);
            		} else {
            			m = (s + (60 - s % 60));
            		} 
            		return m;
            	}

            	// call to update time data of activity
            	function updateActivity () {
            		// should be rounded to minutes
            		scope.activity.nurse_timeleft = roundToMinutes(scope.timeLeft);
            		scope.activity.nurse_timeright = roundToMinutes(scope.timeRight);
            		scope.activity.nurse_timeboth = scope.activity.nurse_timeleft + scope.activity.nurse_timeright;

            		ActivityService.editActivity(scope.activity.uuid, scope.activity, $rootScope.babyId).then(function(activity){
                    	$rootScope.$broadcast('activityEdit', activity);
                	});
            	}

            	function refresher() {
            		if(scope.inProgress == 'none')
            			return;

            		var now = moment(),
            			passed = now.diff(intervalTrackTime, 'seconds', true);

        			passed = Number(Number(passed).toFixed(0));

            		if(scope.inProgress == 'left')
            			scope.timeLeft += passed;
            		if(scope.inProgress == 'right')
            			scope.timeRight+= passed;

            		intervalTrackTime = moment();
            	}

            	function autoSavePerMinute() {
            		updateActivity();
            	}

            	scope.open = function () {
            		var data = angular.copy(timerEventDataTemplate);
            		data.eventName = 'open';
            		data.isShown = true;
            		data.activity = scope.activity;
            		$rootScope.$broadcast('timerEvent', data);
            	};

            	scope.close = function () {
            		scope.stop();
            		scope.isShown = false;

            		var data = angular.copy(timerEventDataTemplate);
            		data.eventName = 'close';
            		data.isShown = false;
            		data.activity = scope.activity;
            		$rootScope.$broadcast('timerEvent', data);
            	};

            	scope.start = function () {
            		if(intervalId)
            			$interval.cancel(intervalId);
            		if(intervalMinute)
            			$interval.cancel(intervalMinute);

            		intervalTrackTime = moment();
            		scope.isShown = true;
            		
            		intervalId = $interval(refresher, 1000); // per second
            		intervalMinute = $interval(autoSavePerMinute, 60000); // per minute
            	};

            	scope.stop = function () {
            		if(intervalId)
            			$interval.cancel(intervalId);
            		if(intervalMinute)
            			$interval.cancel(intervalMinute);

            		// we save time data when timer is stopped
            		if(scope.activity) {
            			updateActivity();
            		}
            		
            		intervalTrackTime = null;
            		scope.inProgress = 'none';
            	};

            	scope.reset = function (initL, initR) {
            		scope.timeLeft = angular.isDefined(initL) ? Number(initL) : 0;
            		scope.timeRight = angular.isDefined(initR) ? Number(initR) : 0;
            	};


            	// LEFT start
            	scope.left = function () {
            		// if left is running we just stop it
            		if(scope.inProgress == 'left') {
            			scope.stop();
            			return;
            		}

            		// if right is running we stop it to start left
            		if(scope.inProgress == 'right') {
            			scope.stop();
            		}

            		scope.inProgress = 'left';
            		scope.start();
            	}

            	// RIGHT start
            	scope.right = function () {
            		// if right is running we just stop it
            		if(scope.inProgress == 'right') {
            			scope.stop();
            			return;
            		}

            		// if left is running we stop it to start right
            		if(scope.inProgress == 'left') {
            			scope.stop();
            		}

            		scope.inProgress = 'right';
            		scope.start();
            	};

            	$rootScope.$on('timerEvent', function (event, data) {
            		if(!data.type || data.type != 'nurse' || !data.activity || data.backPropagation)
            			return;

            		scope.activity = data.activity;
            		var initL = 0,
            			initR = 0;

        			if(angular.isDefined(data.params)) {
        				if(angular.isDefined(data.params.timeLeft)) {
        					initL = Number(data.params.timeLeft);
        					if(isNaN(initL))
        						initL = 0;
        				}
        				if(angular.isDefined(data.params.timeRight)) {
        					initR = Number(data.params.timeRight);
        					if(isNaN(initR))
        						initR = 0;
        				}
        			}

            		if(angular.isDefined(data.command) && data.command) {
            			switch(data.command) {
            				// 
            				case 'start-left':
            					scope.reset(initL, initR);
            					scope.left();
            					break;
        					// 
        					case 'start-right':
        						scope.reset(initL, initR);
        						scope.right();
        						break; 
            			}
            			return;
            		}
            	});

            	scope.$watch('timeLeft', function (tl) {
            		if(angular.isUndefined(tl))
            			return;
            		if(isNaN(tl))
            			return;
            		scope.timeLeftF = formatTime(tl);
            		scope.timeBoth = Number(tl) + Number(scope.timeRight);
            	});

            	scope.$watch('timeRight', function (tr) {
            		if(angular.isUndefined(tr))
            			return;
            		if(isNaN(tr))
            			return;
            		scope.timeRightF = formatTime(tr);
            		scope.timeBoth = Number(scope.timeLeft) + Number(tr);
            	});

            	scope.$watch('timeBoth', function (tb) {
            		if(angular.isUndefined(tb))
            			return;
            		if(isNaN(tb))
            			return;
            		scope.timeBothF = formatTime(tb);
            	});

            	scope.$watch('inProgress', function (progress) {
            		if(angular.isUndefined(progress) || progress == 'none') {
            			// progress NONE
            			scope.leftButton = texts.buttonLeft[0];
            			scope.rightButton = texts.buttonRight[0];
            		} else if(progress == 'left') {
            			// button texts
            			scope.leftButton = texts.buttonLeft[1];
        				scope.rightButton = texts.buttonRight[0];
            		} else if(progress == 'right') {
            			// button texts
            			scope.leftButton = texts.buttonLeft[0];
        				scope.rightButton = texts.buttonRight[1];
            		}
            	});

            	scope.$on('$destroy', function handleDestroyEvent() {
            		scope.stop();
            	});
            }
        };
    }]);