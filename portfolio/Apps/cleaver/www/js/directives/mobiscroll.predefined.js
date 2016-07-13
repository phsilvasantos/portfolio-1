
var MODE_LIST = "list",
	MODE_URL = "url",
	MODE_PREDEFINED = "predefined";

angular.module('cleverbaby.directives')
    .directive('mobiscrollPredefined', ['$timeout', '$sce', function($timeout, $sce) {

    	var predefinedData = {
            'comment': [{
                'value': 'None',
                'text': 'None'
            }, {
                'value': 'Burped',
                'text': 'Burped'
            }, {
                'value': 'BurpedAndSpitUp',
                'text': 'Burped And SpitUp'
            }, {
                'value': 'SpitUp',
                'text': 'SpitUp'
            }],

            'gender':[
                {
                    'value': 'm',
                    'text': 'Boy'
                },
                {
                    'value': 'f',
                    'text': 'Girl'
                }
            ],

    		'bottle_type': [{
    			'value': 'formula',
    			'text': 'Formula',
    		}, {
    			'value': 'breastmilk',
    			'text': 'Breastmilk',
    		}, {
    			'value': 'milk',
    			'text': 'Milk',
    		}, {
    			'value': 'water',
    			'text': 'Water',
    		}, {
    			'value': 'juice',
    			'text': 'Juice',
    		}],            

            'pump_side': [{
                'value': 'left',
                'text': 'Left'
            }, {
                'value': 'right',
                'text': 'Right'
            }, {
                'value': 'both',
                'text': 'Both'
            }],

            'pump_side_start': [{
                'value': 'left',
                'text': 'Left'
            }, {
                'value': 'right',
                'text': 'Right'
            }],

            'solid_foodtype': [{
                'value': 'cereal',
                'text': 'Cereal'
            }, {
                'value': 'mash',
                'text': 'Mash'
            }, {
                'value': 'others',
                'text': 'Others'
            }],

            'diaper_brand': [{
                'value': 'pampers',
                'text': 'Pampers'
            }, {
                'value': 'other',
                'text': 'Other'
            }],

            'sleep_location': [{
                'value': 'bassinet',
                'text': 'Bassinet'
            }, {
                'value': 'bed',
                'text': 'Bed'
            }, {
                'value': 'crib',
                'text': 'Crib'
            }, {
                'value': 'stroller',
                'text': 'Stroller'
            }, {
                'value': 'swing',
                'text': 'Swing'
            }, {
                'value': 'withmommy',
                'text': 'Withmommy'
            }, {
                'value': 'carseat',
                'text': 'Carseat'
            }, {
                'value': 'other',
                'text': 'Other'
            }],

            'sleep_duration': [{
                'value': '300',
                'text': '5 min'
            }, {
                'value': '600',
                'text': '10 min'
            }, {
                'value': '900',
                'text': '30 min'
            }, {
                'value': '1800',
                'text': '1 hour'
            }, {
                'value': '3600',
                'text': '2 hour'
            }, {
                'value': '5400',
                'text': '3 hour'
            }, {
                'value': '7200',
                'text': '4 hour'
            }, {
                'value': '9000',
                'text': '5 hour'
            }, {
                'value': '10800',
                'text': '6 hour'
            }],

            'milestone_type': [{
                'value': 'firstsmile',
                'text': 'First smile'
            }, {
                'value': 'firstwalk',
                'text': 'First walk'
            }, {
                'value': 'firstword',
                'text': 'First word'
            }, {
                'value': 'other',
                'text': 'Other'
            }],

            'bath_types': [{
                'value': 'bubblebath',
                'text': 'Bubblebath'
            }, {
                'value': 'shower',
                'text': 'Shower'
            }, {
                'value': 'other',
                'text': 'Other'
            }],

            'play_comment': [{
                'value': 'tummytime',
                'text': 'Tummy-Time'
            }, {
                'value': 'crawling',
                'text': 'Crawling'
            }, {
                'value': 'crusing',
                'text': 'Crusing'
            }, {
                'value': 'storytime',
                'text': 'Story-Time'
            }, {
                'value': 'tvtime',
                'text': 'Tv-Time'
            }, {
                'value': 'others',
                'text': 'Others'
            }],

            'play_location': [{
                'value': 'ourbed',
                'text': 'Ourbed'
            }, {
                'value': 'outdoors',
                'text': 'Outdoors'
            }, {
                'value': 'others',
                'text': 'Others'
            }],

            'doctor_type': [{
                'value': 'checkup',
                'text': 'Checkup'
            }, {
                'value': 'sickvisit',
                'text': 'Sick Visit'
            }, {
                'value': 'therapy',
                'text': 'Therapy'
            }, {
                'value': 'vaccine',
                'text': 'Vaccine'
            }, {
                'value': 'followup',
                'text': 'Follow Up'
            }],

            'sick_symptom': [{
                'value': 'fever',
                'text': 'Fever'
            }, {
                'value': 'cough',
                'text': 'Cough'
            }, {
                'value': 'others',
                'text': 'Others'
            }],

            'allergy_source': [{
                'value': 'egg',
                'text': 'Egg'
            }, {
                'value': 'fish',
                'text': 'Fish'
            }, {
                'value': 'milk',
                'text': 'Milk'
            }, {
                'value': 'peanut',
                'text': 'Peanut'
            }, {
                'value': 'shellfish',
                'text': 'Shellfish'
            }, {
                'value': 'soybean',
                'text': 'Soybean'
            }, {
                'value': 'treenut',
                'text': 'Tree Nut'
            }, {
                'value': 'wheat',
                'text': 'Wheat'
            }],

            'allergy_reaction': [{
                'value': 'safe',
                'text': 'Safe'
            }, {
                'value': 'rash',
                'text': 'Rash'
            }, {
                'value': 'notSure',
                'text': 'Not Sure'
            }, {
                'value': 'other',
                'text': 'Other'
            }],

            'allergy_severity': [{
                'value': 'none',
                'text': 'None'
            }, {
                'value': 'mild',
                'text': 'Mild'
            }, {
                'value': 'moderate',
                'text': 'Moderate'
            }, {
                'value': 'severe',
                'text': 'Severe'
            }, {
                'value': 'verysevere',
                'text': 'Very Severe'
            }],

            'eta_fixed_duration': [{
                'value': '-1',
                'text': 'Calculate Automatically'
            }, {
                'value': '60',
                'text': 'Every Hour'
            }, {
                'value': '120',
                'text': 'Every 2 Hours'
            }, {
                'value': '180',
                'text': 'Every 3 Hours'
            }, {
                'value': '240',
                'text': 'Every 4 Hours'
            }, {
                'value': '300',
                'text': 'Every 5 Hours'
            }, {
                'value': '360',
                'text': 'Every 6 Hours'
            }, {
                'value': '420',
                'text': 'Every 7 Hours'
            }],
    	};

        return {
            restrict: 'EA',
            scope: {
                'mobiscrollModel': '=',
                'mobiscrollMode': '@',
                'mobiscrollValues': '@',
                'mobiscrollList': '=',
                'mobiscrollUrl': '=',
            },
            template: function(element, attrs) {
                var usrClasses = angular.isDefined(attrs['class-child']) ? attrs['class-child'] : '';
                var usrStyles = angular.isDefined(attrs['style-child']) ? attrs['style-child'] : '';

                return '<input type="text" class="mobiscroll-input ' + usrClasses + '" style="' + usrStyles + '" readonly="readonly"/>';
            },
            link: function(scope, element, attrs) {

            	var mode = angular.isDefined(scope.mobiscrollMode) ? scope.mobiscrollMode : MODE_PREDEFINED,
            		data = {},
                    isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());
        		
            	if(mode == MODE_PREDEFINED) {
            		// get data from source
            		var cat = scope.mobiscrollValues ? scope.mobiscrollValues : '';
            		data = predefinedData[cat] ? predefinedData[cat] : {};
            	} else if(mode == MODE_URL) {
            		// get data from source
            	} else if(mode == MODE_LIST) {
            		// get data from source
            		// set watch on data changes
            	}

            	var jInput = $(element).find('.mobiscroll-input')

            	jInput.mobiscroll().select({
                    theme: isApple ? 'ios' : 'android-holo-light',
                    display: 'bottom',
                    minWidth: 200,
                    label: '',
                    data: data,
                    onSelect: function(valueText, inst) {
                    }
                });

        		jInput.on('change', function (event) {
    				// update model
    				scope.mobiscrollModel = jInput.val();
    				scope.$apply();
        		});

            	scope.$watch('mobiscrollModel', function (newModel, oldModel) {
            		// external change occured
            		jInput.mobiscroll('setVal', newModel, true, false);
            	});

            	if(angular.isUndefined(scope.mobiscrollModel)) {
					scope.mobiscrollModel = data[0].value;
        		}
            }
        };
    }]);
