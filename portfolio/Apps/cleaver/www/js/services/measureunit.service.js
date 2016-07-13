angular.module('cleverbaby')
    .service('MeasureunitService', ["$ionicLoading", "$timeout", "$localStorage", function($ionicLoading, $timeout, $localStorage) {

        var serviceObject = {};

        var measures = {
            'weight': {
            	'label': 'Weight oz/lb or g/kg',
            	'default': '0',
            	'isGroup': true,
            	'units': [['g', 'oz'], ['kg', 'lb']],
            	'unitsNames': ['g/kg', 'oz/lb'],
            	'value': '0',
            },
            'length': {
            	'label': 'Length inch/ft or cm/m',
            	'default': '0',
            	'isGroup': true,
            	'units': [['cm', 'inch'], ['m', 'ft']],
            	'unitsNames': ['cm/m', 'inch/ft'],
            	'value': '0',
            },
            'volume': {
            	'label': 'Volume oz/lb or ml/L',
            	'default': '0',
            	'isGroup': true,
            	'units': [['oz', 'ml'], ['lb', 'L']],
            	'unitsNames': ['oz/lb', 'ml/L'],
            	'value': '0',
            },
            'temp': {
            	'label': 'Temperature C or F',
            	'default': '0',
            	'isGroup': false,
            	'units': ['C', 'F'],
            	'unitsNames': ['C', 'F'],
            	'value': '0',
            },
        };

        serviceObject.getSettings = function () {
        	if(typeof $localStorage.measures == 'undefined') {
        		$localStorage.measures = measures;
        	}

        	var copyMeasures = jQuery.extend(measures, $localStorage.measures, true);
        	for(var m in copyMeasures) {
        		var val = copyMeasures[m].value;

        		copyMeasures[m].valueName = copyMeasures[m].unitsNames[val];
        	}
        	return copyMeasures;
        };

        serviceObject.setSetting = function (measure, value) {
        	if(typeof $localStorage.measures == 'undefined') {
        		$localStorage.measures = measures;
        	}

        	$localStorage.measures[measure].value = value;
        };

        return serviceObject;
    }]);
