angular.module('cleverbaby.directives')
    .directive('mobiscrollCustomunits', ['$timeout', '$sce', 'MeasureunitService', '$localStorage',
        function($timeout, $sce, MeasureunitService, $localStorage) {

            return {
                restrict: 'A',
                scope: {
                    'mobiscrollModelValue': '=',
                    'mobiscrollModelUnit': '=',
                    'mobiscrollId': '@',
                    'mobiscrollMode': '@',
                },
                template: function(element, attrs) {
                    var usrClasses = angular.isDefined(attrs['class-child']) ? attrs['class-child'] : '',
                        usrStyles = angular.isDefined(attrs['style-child']) ? attrs['style-child'] : '',
                        usrPlaceholder = angular.isDefined(attrs['placeholder']) ? attrs['placeholder'] : '';

                    return '<input type="text" class="mobiscroll-input ' + usrClasses + '" style="' + usrStyles + ' background-color: transparent;" placeholder="' + usrPlaceholder + '" readonly="readonly" /><input type="hidden" class="mobiscroll-hidden" readonly="readonly" />';
                },

                link: function(scope, element, attrs) {

                    var jInput = $(element).find('.mobiscroll-input'),
                        jHidden = $(element).find('.mobiscroll-hidden'),
                        mode = angular.isDefined(scope.mobiscrollMode) ? scope.mobiscrollMode : 'volume',
                        cat = angular.isDefined(attrs['cat']) ? attrs['cat'] : 0,  // ml or L
                        measure = MeasureunitService.getSettings()[mode],
                        units = measure.units[cat],
                        systemUnit = measure.units[cat][measure.value],
                        isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());
                console.log('jHidden', jHidden);

                    function getRange (min, max, step) {
                        var list = [];
                        for (var v = min; v <= max; v += step)
                            list.push(v);
                        return list;
                    }

                    function getFriendlyValue (value) {
                        var valObj = {};
                        if (typeof value == 'string') {
                            if (value == '')
                                return "";
                            valObj = JSON.parse(value);
                        }
                        return valObj.value + ' ' + valObj.unit;
                    }

                    function getLastInputValue () {
                        if( typeof $localStorage.inputHistory == 'undefined' ||
                            typeof $localStorage.inputHistory[mode] == 'undefined' ||
                            typeof $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId] == 'undefined' ||
                            typeof $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId].value == 'undefined')
                            return null;
                        return $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId].value;
                    }

                    function getLastInputUnit () {
                        if( typeof $localStorage.inputHistory == 'undefined' ||
                            typeof $localStorage.inputHistory[mode] == 'undefined' ||
                            typeof $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId] == 'undefined' ||
                            typeof $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId].unit == 'undefined')
                            return null;
                        return $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId].unit;
                    }

                    function setLastInput (value, unit) {
                        if(!$localStorage.inputHistory)
                            $localStorage.inputHistory = {};
                        if(!$localStorage.inputHistory[mode])
                            $localStorage.inputHistory[mode] = {};

                        $localStorage.inputHistory[mode]['mb_' + scope.mobiscrollId] = {
                            value: value,
                            unit: unit
                        }
                    }

                    function getDefaults () {
                        var lastVal = getLastInputValue(),
                            lastUnit = getLastInputUnit();

                        var valObj = {
                            value: lastVal ? lastVal : 0,
                            unit: lastUnit ? lastUnit : systemUnit
                        }
                        return valObj;
                    }

                    var defSetup = {
                        'volume': {
                            'oz': {
                                'min': 1,
                                'max': 16,
                                'step': 0.5,
                                'range': getRange(1, 16, 0.5),
                            },
                            'ml': {
                                'min': 10,
                                'max': 500,
                                'step': 10,
                                'range': getRange(10, 500, 10),
                            },
                        },
                        'weight': {
                            'kg': {
                                'min': 1,
                                'max': 16,
                                'step': 0.5,
                                'range': getRange(1, 16, 0.5),
                            },
                            'lb': {
                                'min': 10,
                                'max': 500,
                                'step': 10,
                                'range': getRange(10, 500, 10),
                            },
                        },
                        'length': {
                            'cm': {
                                'range': getRange(10, 160, 1),
                            },
                            'inch': {
                                'range': getRange(4, 63, 0.5),
                            }
                        }
                    }

                    var prevUnit = '',
                        wheel = [
                            [{
                                label: '',
                                values: defSetup[mode][getDefaults().unit].range
                            }, {
                                label: 'Unit',
                                values: units
                            }]
                        ];

                    jHidden.mobiscroll().scroller({
                        theme: isApple ? 'ios' : 'android-holo-light',
                        display: 'bottom',
                        wheels: wheel,
                        headerText: '',
                        validate: function(html, index, time, dir, inst) {
                            var currUnit = inst._tempWheelArray[1];
                            if (typeof currUnit == 'undefined')
                                currUnit = getDefaults().unit;

                            if (index == 1 && currUnit != prevUnit) {
                                decs = defSetup[mode][currUnit].range;

                                wheel[0][0].values = decs;

                                inst.settings.wheels = wheel;
                                inst.changeWheel([0]);
                                prevUnit = currUnit;
                            }
                        },
                        parseValue: function(val) {
                            if (val !== '') {
                                val = JSON.parse(val);
                                if ((typeof val === "object") && (val !== null)) {
                                    return [val['value'], val['unit']];
                                }
                            }
                            return [getDefaults().value, getDefaults().unit];
                        },
                        formatValue: function(data) {
                            var valObj = {
                                'value': data[0],
                                'unit': data[1],
                            };
                            return JSON.stringify(valObj);
                        },
                        onSelect: function(valueText, inst) {
                            if(valueText == '')
                                return;

                            var valObj = JSON.parse(valueText);
                            setLastInput(valObj.value, valObj.unit)
                        }
                    });

                    // redirect clicks
                    jInput.click(function() {
                        jHidden.trigger('click');
                    });

                    scope.currentObj = {
                        value: null,
                        unit: null
                    };

                    // update interface changes > update visible input & ng-model
                    jHidden.on('change', function(event) {
                        jInput.val(getFriendlyValue(event.target.value));

                        if (event.target.value && event.target.value !== '') {
                            valObj = JSON.parse(event.target.value);

                            scope.mobiscrollModelValue = valObj.value;
                            scope.mobiscrollModelUnit = valObj.unit;    
                        }
                    });

                    // model changes > update visible and mobi
                    scope.$watch('mobiscrollModelValue', function(newValue, oldValue) {
                        if (typeof newValue == 'undefined') {
                            newValue = getDefaults().value;
                        }

                        var valObj = {
                            value: newValue,
                            unit: scope.currentObj.unit ? scope.currentObj.unit : getDefaults().unit
                        };

                        jHidden.mobiscroll('setVal', JSON.stringify(valObj), true, true);
                    });

                    // model changes > update visible and mobi
                    scope.$watch('mobiscrollModelUnit', function(newUnit, oldUnit) {
                        if (typeof newUnit == 'undefined') {
                            newUnit = getDefaults().unit;
                        }

                        if (newUnit == oldUnit)
                            return;

                        var valObj = {
                            value: scope.currentObj.value ? scope.currentObj.value : getDefaults().value,
                            unit: newUnit
                        };

                        jHidden.mobiscroll('setVal', JSON.stringify(valObj), true, true);
                    });
                }
            }
        }
    ]);
