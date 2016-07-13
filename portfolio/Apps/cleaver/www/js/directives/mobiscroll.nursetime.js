
angular.module('cleverbaby.directives')
    .directive('mobiscrollNursetime', ['$timeout', '$sce', function($timeout, $sce) {
        return {
            restrict: 'EA',
            scope: {
                'mobiscrollModel': '=',
            },
            template: function(element, attrs) {
                var usrClasses = angular.isDefined(attrs['classChild']) ? attrs['classChild'] : '';
                var usrStyles = angular.isDefined(attrs['styleChild']) ? attrs['styleChild'] : '';

                return '<input type="text" class="mobiscroll-input ' + usrClasses + '" style="' + usrStyles + '" readonly="readonly"/>';
            },
            link: function(scope, element, attrs) {
                
            	var mode = angular.isDefined(scope.mobiscrollMode) ? scope.mobiscrollMode : MODE_PREDEFINED,
            		data = [],
                    isApple = ionic.Platform.isWebView() && (ionic.Platform.isIPad() || ionic.Platform.isIOS());
        		
                // from 0min to 60 min, interval 1min
                for(var v = 0; v <= 60; v++) {
                    data.push({
                        'value': v * 60,
                        'text': v + ' min'
                    });
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
                    $timeout(function () {
                        scope.mobiscrollModel = jInput.val();    
                    });
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
