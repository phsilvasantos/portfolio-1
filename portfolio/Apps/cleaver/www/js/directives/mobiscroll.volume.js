angular.module('cleverbaby.directives')
    .directive('mobiscrollVolume', ['$timeout', '$sce', 'MeasureunitService', 'ConvertunitService', '$localStorage',
        function($timeout, $sce, MeasureunitService, ConvertunitService, $localStorage) {

            return {
                restrict: 'A',
                scope: {
                    // stored value for bi-directional update (wachted inside)
                    'mobiscrollModelValue': '=',
                    // our directive controls units so there is no need to listen outside unit changes separately
                    'mobiscrollModelUnit': '=',
                    'mobiscrollId': '@',
                    'defaultValue': '@',
                    'defaultUnit': '@'
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
                        mode = 'volume',
                        cat = angular.isDefined(attrs['cat']) ? attrs['cat'] : 0,  // ml or L
                        measure = MeasureunitService.getSettings()[mode],
                        units = measure.units[cat],
                        systemUnit = measure.units[cat][measure.value],
                        isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());
                    
                    var convert = ConvertunitService.volume;
                    var defSetup = {
                        'volume': {
                            'oz': {
                                'range': getRange(1, 16, 0.5),
                            },
                            'ml': {
                                'range': getRange(10, 500, 10),
                            },
                        },
                    }

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
                        return convert[valObj.unit].parse(valObj.value) + ' ' + valObj.unit;
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
                            lastUnit = getLastInputUnit(),
                            defValue = scope.defaultValue ? scope.defaultValue : 0,
                            defUnit = scope.defaultUnit ? scope.defaultUnit : systemUnit;

                        var valObj = {
                            value: lastVal ? lastVal : defValue,
                            unit: lastUnit ? lastUnit : defUnit
                        }
                        return valObj;
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
                                    // we have object here
                                    var valueNorm = convert[val.unit].parse(val.value);
                                    return [valueNorm, val.unit];
                                }
                            }

                            var unit = getDefaults().unit,
                                value = getDefaults().value,
                                valueNorm = convert[unit].parse(value);
                            return [valueNorm, unit];
                        },
                        formatValue: function(data) {
                            var valObj = {
                                'value': convert[data[1]].normalize(data[0]),
                                'unit': data[1],
                            };
                            return JSON.stringify(valObj);
                        },
                        onSelect: function(valueText, inst) {
                            if(valueText && valueText == '')
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
                        value: 0,
                        unit: scope.mobiscrollModelUnit
                    };

                    // update interface changes > update visible input & ng-model
                    jHidden.on('change', function(event) {
                        jInput.val(getFriendlyValue(event.target.value));

                        if (event.target.value && event.target.value !== '') {
                            valObj = JSON.parse(event.target.value);

                            scope.currentObj.value = valObj.value;
                            scope.currentObj.unit = valObj.unit;

                            $timeout(function () {
                                scope.mobiscrollModelValue = valObj.value;
                                scope.mobiscrollModelUnit = valObj.unit;      
                            });
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
                }
            }
        }
    ]);
