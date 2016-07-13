angular.module('cleverbaby.directives')
    .directive('mobiscrollDatetime', ['$timeout', '$sce', function($timeout, $sce) {

        return {
            restrict: 'EA',
            require: "?ngModel",
            scope: {
                'mobiscrollModel': '=',
                'calendarFormat': '@',
            },
            template: function(element, attrs) {
                var usrClasses = angular.isDefined(attrs['class-child']) ? attrs['class-child'] : '';
                var usrStyles = angular.isDefined(attrs['style-child']) ? attrs['style-child'] : '';

                // WebView for in browser testing
                var isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());

                if (isApple)
                    return '<input type="text" class="mobiscroll-input ' + usrClasses + '" style="' + usrStyles + ' background-color: transparent;" readonly="readonly" /><input type="datetime-local" ng-model="appleDateModel" class="mobiscroll-hidden" style="padding-top: 14px;" />';

                // if android
                return '<input type="text" class="mobiscroll-input ' + usrClasses + '" style="' + usrStyles + ' background-color: transparent;" readonly="readonly" /><input type="hidden" class="mobiscroll-hidden ' + usrClasses + '" style="' + usrStyles + ' background-color: transparent;"  />';
            },

            link: function(scope, element, attrs, ngModel) {

                // format calendar date-time
                moment.locale('en', {
                    calendar: {
                        lastDay: '[Yesterday at] LT ',
                        sameDay: '[Today at] LT',
                        nextDay: '[Tomorrow at] LT',
                        lastWeek: '[last] dddd [at] LT',
                        nextWeek: 'dddd [at] LT',
                        sameElse: 'LLL'
                    }
                });
                moment.locale('en');

                var calendarFormat = true;
                if(angular.isDefined(scope.calendarFormat) && scope.calendarFormat === 'false')
                    calendarFormat = false;

                function formatMoment (mdate) {
                    if(calendarFormat)
                        return mdate.calendar();
                    return mdate.format('Do MMMM [at] h:mm a');
                }

            	// APPLE 
                var isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());
                if (isApple) {

                    var jiInput = $(element).find('.mobiscroll-input'),
                        jiHidden = $(element).find('.mobiscroll-hidden');

                    jiHidden.hide();

                    // redirect clicks
                    jiInput.click(function() {
                        jiInput.hide();
                        jiHidden.show();
                        jiHidden.trigger('focus');
                        jiHidden.trigger('click');
                    })

                    jiHidden.focusout(function() {
                        jiHidden.hide();
                        jiInput.show();
                    });

                    function updateInput() {
                        jiInput.val( formatMoment(moment(scope.appleDateModel)) );
                    }

                    // user change
                    scope.$watch('appleDateModel', function (newDateTime, oldDatetime) {
                        scope.mobiscrollModel = newDateTime;
                        updateInput();
                    });

                    // model change
                    scope.$watch('mobiscrollModel', function (newDateTime, oldDatetime) {
                        if(typeof newDateTime == 'undefined')
                            newDateTime = new Date();
                        scope.appleDateModel = newDateTime;
                        updateInput();
                    });
                    return;
                }

                // ANDROID

                // init mobiscroll
                $(element).find('.mobiscroll-hidden').mobiscroll().datetime({
                    theme: 'android-holo-light', // Specify theme like: theme: 'ios' or omit setting to use default 
                    mode: 'scroller', // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
                    display: 'bottom', // Specify display mode like: display: 'bottom' or omit setting to use default 
                    lang: 'en', // Specify language like: lang: 'pl' or omit setting to use default
					dateFormat: 'yy-mm-dd',
					timeFormat: 'HH:ii:ss'
                });

                // redirect clicks
                $(element).find('.mobiscroll-input').click(function() {
                    $(element).find('.mobiscroll-hidden').trigger('click');
                });

                // model changes > update visible & mobi
                scope.$watch('mobiscrollModel', function (newDateTime, oldDatetime) {
                    if(typeof newDateTime == 'undefined')
                        newDateTime = new Date();
                    
                    $(element).find('.mobiscroll-input').val( formatMoment(moment(newDateTime)) );
                    $(element).find('.mobiscroll-hidden').mobiscroll('setVal', newDateTime, true, false);
                });

                // interface changes > update visible input & ng-model
                $(element).find('.mobiscroll-hidden').on('change', function(event) {
                    $(element).find('.mobiscroll-input').val( formatMoment(moment(event.target.value)) );
                    scope.$apply(function () {
                        scope.mobiscrollModel = moment(event.target.value).toDate();    
                    });
                });
            }
        }
    }]);
