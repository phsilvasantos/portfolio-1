angular.module('cleverbaby')
    .service('ConvertunitService', ["$ionicLoading", "$timeout", "$localStorage", function($ionicLoading, $timeout, $localStorage) {

    	// sturcture
    	// area -> unit -> { normalize, parse}
    	var serviceObject = {};
    	var normalizer = 1000;

    	// WEIGHT
    	serviceObject.weight = {};
    	serviceObject.weight.kg = {
    		'normalize': function (valueInt, valueFlt) {
                // to grams * normalizer
                return (valueInt * 1000 + valueFlt * 10) * normalizer;
            },
            'parse': function (normValue) {
                // back from grams * normalizer
                var grams = normValue / normalizer;
                return {
                    valueInt: (grams - (grams % 1000)) / 1000,
                    valueFlt: (grams % 1000) / 10
                }
            },
            toString: function (normValue) {
                var v = this.parse(normValue)
                return (Number(v.valueInt) + Number('0.' + v.valueFlt)) + ' kg';
            }
    	};
    	serviceObject.weight.lb = {
    		'normalize': function (valueInt, valueFlt) {
                // to grams * normalizer
                // 1lb = 453.59 grams (rounded to 453.60)
                return Number(((Number(valueInt) + Number('0.' + valueFlt)) * 453.6 * normalizer).toFixed(0))
            },
            'parse': function (normValue) {
                // back from grams * normalizer
                var lb = normValue / (453.6 * normalizer);
                return {
                    valueInt: (lb - (lb % 1)),
                    valueFlt: Number(lb % 1).toFixed(2) * 100
                };
            },
            toString: function (normValue) {
                var v = this.parse(normValue)
                return (Number(v.valueInt) + Number('0.' + v.valueFlt)) + ' lb';
            }
    	};

    	serviceObject.length = {};
    	serviceObject.length.cm = {
    		'normalize': function (valueInt, valueFlt) {
                // to mm * normalizer
                return (Number(valueInt) + Number('0.' + valueFlt)) * normalizer;
            },
            'parse': function (normValue) {
                // back from mm * 100
                var mm = normValue / normalizer;
                return {
                    valueInt: (mm - (mm % 1)),
                    valueFlt: Number(mm % 1).toFixed(1) * 10
                }
            },
            toString: function (normValue) {
                var v = this.parse(normValue)
                return (Number(v.valueInt) + Number('0.' + v.valueFlt)) + ' cm';
            }
    	};
    	serviceObject.length.inch = {
    		'normalize': function (valueInt, valueFlt) {
                // to mm * normalizer
                // 1 inch = 25.4 mm
                return Number(((Number(valueInt) + Number('0.' + valueFlt)) * 25.4 * normalizer).toFixed(0))
            },
            'parse': function (normValue) {
                // back from mm * normalizer
                var mm = normValue / (25.4 * normalizer);
                return {
                    valueInt: (mm - (mm % 1)),
                    valueFlt: Number(mm % 1).toFixed(1) * 10
                };
            },
            toString: function (normValue) {
                var v = this.parse(normValue)
                return (Number(v.valueInt) + Number('0.' + v.valueFlt)) + ' inch';
            }
    	}
		
		// Volume is one scroller selection
    	serviceObject.volume = {};
    	serviceObject.volume.ml = {
    		'normalize': function (value) {
                // to ml * normalizer
                return value * normalizer;
            },
            'parse': function (normValue) {
                // back from ml * normalizer
                var v = normValue / normalizer;
                return v;
            },
            toString: function (normValue) {
                var v = this.parse(normValue)
                return v + ' ml';
            }
    	};
    	serviceObject.volume.oz = {
    		'normalize': function (value) {
                // to ml * normalizer
                return Number((value * 29.6 * normalizer).toFixed(0));
            },
            'parse': function (normValue) {
                // back from ml * normalizer
                var v = normValue / (29.6 * normalizer),
                	aprx = v.toFixed(1);

            	// allow 0.5 precision
            	var vInt = aprx - aprx % 1,
            		vFlt = Number(((aprx % 1) * 10).toFixed(0));

        		if(0 < vFlt && vFlt < 5)
        			vFlt = 0;
        		else if(5 < vFlt && vFlt < 10) {
        			vFlt = 0;
        			vInt ++;
        		}

                return (Number(vInt) + Number('0.' + vFlt));
            },
            toString: function (normValue) {
                var v = this.parse(normValue)
                return v + ' oz';
            }
    	};

    	serviceObject.temp = {};
    	serviceObject.temp.C = {
    		'normalize': function (valueInt, valueFlt) {
    			// to F * normalizer
    			return ((Number(valueInt) + Number('0.' + valueFlt)) * 1.8 + 32).toFixed(1) * normalizer;
    		},
    		'parse': function (normValue) {
    			// back from C * normalizer
    			var val = normValue / normalizer,
    				c = Number(((val - 32) / 1.8).toFixed(1));
				return {
					valueInt: (c - c % 1),
					valueFlt: Number(c % 1).toFixed(1) * 10
				}
    		},
            toString: function (normValue) {
                var v = this.parse(normValue)
                return (Number(v.valueInt) + Number('0.' + v.valueFlt)) + ' C';
            }
    	};
    	serviceObject.temp.F = {
    		'normalize': function (valueInt, valueFlt) {
    			// multiply normalizer
    			return (Number(valueInt) + Number('0.' + valueFlt)) * normalizer;
    		},
    		'parse': function (normValue) {
    			// back from normalizer
                var f = normValue / normalizer;
                return {
                    valueInt: (f - (f % 1)),
                    valueFlt: Number(f % 1).toFixed(1) * 10
                }
    		},
            toString: function (normValue) {
                var v = this.parse(normValue)
                return (Number(v.valueInt) + Number('0.' + v.valueFlt)) + ' F';
            }
    	}

    	return serviceObject;
    }]);