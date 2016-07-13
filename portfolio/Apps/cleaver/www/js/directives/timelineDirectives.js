angular.module('cleverbaby.directives')
    .directive('cbTimeLineChart', ['ActivityService', '$timeout', '$ionicModal', '$ionicScrollDelegate', '$rootScope', function (ActivityService, $timeout, $ionicModal, $ionicScrollDelegate, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'templates/elements/timeline-chart.html',
            link: function (scope, element) {

                ActivityService.getAllActivitiesByBabyId($rootScope.babyId, 0, 100).then(function(activities){

                    var dateToday = moment(new Date()).format("MM-DD-YYYY");
                    var dateYesterday = moment(new Date()).subtract(1, 'days').format("MM-DD-YYYY");

                    function dateToString(date){
                        var formatDate = moment(new Date(date)).format("MM-DD-YYYY");
                        if(formatDate == dateToday){
                            return "Today";
                        }else if(formatDate == dateYesterday){
                            return "Yesterday";
                        }else{
                            var month = moment(new Date(date)).format("MMMM");
                            var day = moment(new Date(date)).format("Do");

                            return day + " " + month
                        }
                    };

                    var unorderedDate = {};

                    //group by date the activities
                    angular.forEach(activities, function(value, index){
                        var valueDateStart = moment(value.time).format("MM-DD-YYYY");
                        var valueDateEnd = moment(value.time_end).format("MM-DD-YYYY");

                        var midnight = moment(value.time).set({'hour': 00, 'second': 00, 'minute': 00});
                        var morning = moment(value.time).set({'hour': 6, 'second': 00, 'minute': 00});

                        if( moment(value.time) >= midnight && moment(value.time) <= morning ){
                            valueDateStart = moment(value.time).subtract(1, 'days').format("MM-DD-YYYY");
                        }

                        if(unorderedDate[valueDateStart]){
                            unorderedDate[valueDateStart].activities.unshift(value);
                        }else{
                            var dateObjectStructure = {
                                'activities': [value],
                                'dateString': dateToString(valueDateStart)
                            }
                            unorderedDate[valueDateStart] = dateObjectStructure;
                        }
                    });

                    //1440minutes in one day
                    //get percentage of 1minute in 1440 minutes
                    // (332/1440) * durationMinute = fillPx
                    //(fillpx / 332) x 100
                    var timelineIonContentWidth = parseInt(screen.width); //332px sample

                    /****** IMPORTANT ul.timeline-grid, the right width for this is required currently its 144.8% ******/

                    var widthPerBlockPercentage = 144.8 / 100;
                    var widthOfBlockCon = (widthPerBlockPercentage * timelineIonContentWidth) + 8; //because there is a -6 margin left on its css

                    function calculateDurationPercentage(startTime, endTime){
                        var startTime = moment.duration(startTime);
                        var valueDateEnd = moment.duration(endTime);
                        var durationMinute = valueDateEnd.subtract(startTime).asMinutes(); //
                        var durationPercentage = (widthOfBlockCon/1440) * durationMinute;
                        var fillPercentage = (durationPercentage/ widthOfBlockCon) * 100;

                        return fillPercentage;
                    }

                    /**
                     * calculates
                     * @param activityStartTime - date of activity
                     * @returns (int) the margin left percentage
                     */
                    function calculateMarginLeftPercentage(activityStartTime) {
                        //8 blocks in one grid
                        //widthOfBlockCon / 8
                        //3hours per block
                        /*
                            eg. starttime is 9am
                            9am - 6am = 3hrs
                            //one block is 3 hrs gap so divide by 3
                            (3 / 3) * lengthPerBlank
                         */
                        var startTime = moment(activityStartTime).set({'hour': 6, 'second': 00, 'minute': 00});;
                        var lengthPerBlank = widthOfBlockCon / 8;


                        var valueDateEnd = moment(activityStartTime);

                        var midnight = moment(activityStartTime).set({'hour': 00, 'second': 00, 'minute': 00});
                        var morning = moment(activityStartTime).set({'hour': 6, 'second': 00, 'minute': 00});
                        if( moment(activityStartTime) >= midnight && moment(activityStartTime) <= morning ) {
                            startTime = moment(startTime).subtract(1, 'days');
                        }

                        var duration = moment.duration(valueDateEnd.diff(startTime));

                        var durationHours = duration.asHours();
                        var marginLeftPercentage = (durationHours / 3) * lengthPerBlank;
                        return marginLeftPercentage;
                    }

                    function getFillPercentages(activity){
                        var fillAray = [];

                        angular.forEach(activity, function(activity, index){
                            var timeEnd;
                            if(activity.type == "sleep"){
                                timeEnd = moment(activity.sleep_timeend);
                            }else{
                                timeEnd = angular.isDefined(activity.time_end) ? moment(activity.time_end) : moment(activity.time).add(10, 'm');

                            }
                            fillAray.push({'marginLeft': calculateMarginLeftPercentage(activity.time), 'percentage': calculateDurationPercentage(activity.time, timeEnd), 'type': activity.type, 'startTime': activity.time, 'endTime': timeEnd});
                        });

                        return fillAray;
                    }

                    scope.orderedDateFinal = [];

                    //create the fill percentage && rearrange latest to oldest
                    angular.forEach(unorderedDate, function(dateArrayActivity, index){
                        dateArrayActivity.fill = getFillPercentages(dateArrayActivity.activities)
                        scope.orderedDateFinal.push(dateArrayActivity);
                    });

                    console.log(scope.orderedDateFinal);
                });
				
				$timeout(function () {
					$timeout(function(){
						// fix the problem that vertical scrolling is not working when dragging inside the horizontal ion-scroll views, wrapped in double timeout to only execute when DOM is fully finished rendering
							
						for (i = 0; i < scope.orderedDateFinal.length; i++) { 
							// bit ugly, executes the touch event override code below for each horizontal scroll view, not sure this is the best way, but it works for the moment 
							var anon = function(i) {
								var sv = $ionicScrollDelegate.$getByHandle('horizontal'+i).getScrollView();
								
								var container = sv.__container;

								var originaltouchStart = sv.touchStart;
								var originalmouseDown = sv.mouseDown;
								var originaltouchMove = sv.touchMove;
								var originalmouseMove = sv.mouseMove;

								container.removeEventListener('touchstart', sv.touchStart);
								container.removeEventListener('mousedown', sv.mouseDown);
								document.removeEventListener('touchmove', sv.touchMove);
								document.removeEventListener('mousemove', sv.mousemove);
								

								sv.touchStart = function(e) {
								  e.preventDefault = function(){}
								  if (originaltouchStart) originaltouchStart.apply(sv, [e]);
								}

								sv.touchMove = function(e) {
								  e.preventDefault = function(){}
								  if (originaltouchMove) originaltouchMove.apply(sv, [e]);
								}
								
								sv.mouseDown = function(e) {
								  e.preventDefault = function(){}
								  if (originalmouseDown) originalmouseDown.apply(sv, [e]);
								}

								sv.mouseMove = function(e) {
								  e.preventDefault = function(){}
								  if (originalmouseMove) originalmouseMove.apply(sv, [e]);
								}

								container.addEventListener("touchstart", sv.touchStart, false);
								container.addEventListener("mousedown", sv.mouseDown, false);
								document.addEventListener("touchmove", sv.touchMove, false);
								document.addEventListener("mousemove", sv.mouseMove, false);
							
							} 
							anon(i);
						}
						
						
						
						
					}, 0);
				}, 0);
            }
        }
    }]);