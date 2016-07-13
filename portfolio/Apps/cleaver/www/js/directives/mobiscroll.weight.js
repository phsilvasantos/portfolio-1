angular.module('cleverbaby.directives')
    .directive('mobiscrollWeight', ['$timeout', '$sce', 'MeasureunitService', 'ConvertunitService', '$localStorage',
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

                    return '<input type="text" class="mobiscroll-input ' + usrClasses + '" style="' + usrStyles + ' background-color: transparent;" placeholder="' + usrPlaceholder + '" readonly="readonly" /><input type="text" class="mobiscroll-hidden" readonly="readonly" />';
                },

                link: function(scope, element, attrs) {

                    var jInput = $(element).find('.mobiscroll-input'),
                        jHidden = $(element).find('.mobiscroll-hidden'),
                        mode = 'weight',
                        cat = angular.isDefined(attrs['cat']) ? attrs['cat'] : 0,  // ml or L
                        measure = MeasureunitService.getSettings()[mode],
                        units = measure.units[cat],
                        systemUnit = measure.units[cat][measure.value],
                        isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());

                    var convert = ConvertunitService.weight;
                    var defSetup = {
                        'weight': {
                            'kg': {
                                'intRange': getRange(1, 30, 1),
                                'fltRange': getRange(0, 99, 1),
                                'fltRangeNorm': getRangeNorm(0, 99, 1)
                            },
                            'lb': {
                                'intRange': getRange(1, 70, 1),
                                'fltRange': getRange(0, 99, 1),
                                'fltRangeNorm': getRangeNorm(0, 99, 1)
                            },
                        }
                    };

                    function getRange (min, max, step) {
                        var list = [];
                        for (var v = min; v <= max; v += step)
                            list.push(v);
                        return list;
                    }

                    function getRangeNorm (min, max, step) {
                        var list = [];
                        for (var v = min; v <= max; v += step) {
                            var t = v;
                            if(v <= 0) {
                                t = '00'
                            } else if(v < 10){
                                t = '0' + v;
                            } else if(v % 10 === 0)
                                t = '' + (v / 10).toFixed(0);
                            list.push(t);
                        }
                            
                        return list;    
                    }

                    function getFriendlyValue (value) {
                        var valObj = {};
                        if (typeof value == 'string') {
                            if (value == '')
                                return "";
                            valObj = JSON.parse(value);
                        }
                        var values = convert[valObj.unit].parse(valObj.value);
                        return values.valueInt + '.' + values.valueFlt + ' ' + valObj.unit;
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
                                values: defSetup[mode][getDefaults().unit].intRange,
                            }, {
                                label: '',
                                keys: defSetup[mode][getDefaults().unit].fltRange,
                                values: defSetup[mode][getDefaults().unit].fltRangeNorm
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
                            var currUnit = inst._tempWheelArray[2];
                            if (typeof currUnit == 'undefined')
                                currUnit = getDefaults().unit;

                            if (index == 2 && currUnit != prevUnit) {
                                decs = defSetup[mode][currUnit].intRange;
                                flts = defSetup[mode][currUnit].fltRange;

                                wheel[0][0].values = decs;
                                wheel[0][1].values = flts;

                                inst.settings.wheels = wheel;
                                inst.changeWheel([0, 1]);
                                prevUnit = currUnit;
                            }
                        },
                        parseValue: function(val) {
                            if (val !== '') {
                                var valObj = JSON.parse(val);
                                if ((typeof valObj === "object") && (valObj !== null)) {
                                    // we have object here
                                    var values = convert[valObj.unit].parse(valObj.value);
                                    return [values.valueInt, values.valueFlt, valObj.unit];
                                }
                            }
                            var unit = getDefaults().unit,
                                value = getDefaults().value,
                                values = convert[unit].parse(value);
                            return [values.valueInt, values.valueFlt, unit];
                        },
                        formatValue: function(data) {
                            //debugger;
                            var valObj = {
                                'value': convert[data[2]].normalize(data[0], data[1]),
                                'unit': data[2],
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
                        //console.log(this.id + ' > jHidden change');

                        jInput.val(getFriendlyValue(event.target.value));

                        if (event.target.value && event.target.value !== '') {
                            var valObj = JSON.parse(event.target.value);

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
                        //console.log(scope.id + ' > mobiscrollModelValue watch');

                        if (typeof newValue == 'undefined') {
                            newValue = getDefaults().value;
                        }

                        // newValue should be Normalized value
                        var valObj = {
                            value: newValue,
                            unit: scope.currentObj.unit ? scope.currentObj.unit : getDefaults().unit
                        };

                        jHidden.mobiscroll('setVal', JSON.stringify(valObj), true, true);
                    });

                    /*
                    var x = ConvertunitService.temperature['c'].normalize(36, 8);
                    var y = ConvertunitService.temperature['c'].parse(x);
                    // LB normalization and parse test
                    var vals = [];
                    for (var i = 1; i < 70; i++) {
                        for(var j = 0; j <= 99; j++) {
                            vals.push( convert['lb'].normalize(i, j) );
                        }
                    }
                    console.log(vals);
                    for(var ix in vals) {
                        console.log( convert['lb'].parse(vals[ix]));
                    }
                    */
                }
            }
        }
    ]);
