angular.module('cleverbaby.controllers')
    .controller('MoreMeasuresCtrl', ['$scope', '$timeout', '$localStorage', 'MeasureunitService', '$ionicActionSheet',
        function($scope, $timeout, $localStorage, MeasureunitService, $ionicActionSheet) {

            $scope.measures = MeasureunitService.getSettings();

            $scope.unitsAsButtons = function (units) {
            	var buttons = [];
            	for(var u in units) {
            		buttons.push({ text: units[u] });
            	}
            	return buttons;
            };

            $scope.change = function(key, measure) {
                key;
                measure.unitsNames;
                measure.value;
                
                var hideSheet = $ionicActionSheet.show({
                    buttons: $scope.unitsAsButtons(measure.unitsNames),
                    titleText: measure.label,
                    cancelText: 'Cancel',
                    cancel: function() {
                    },
                    buttonClicked: function(index) {
                    	MeasureunitService.setSetting(key, index);
                    	$scope.measures = MeasureunitService.getSettings();
                        return true;
                    }
                });
            };
        }
    ]);
