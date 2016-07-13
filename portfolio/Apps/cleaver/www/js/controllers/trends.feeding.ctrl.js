angular.module('cleverbaby.controllers')

    .controller('FeedingCtrl', ['$scope','$timeout', function ($scope, $timeout) {

        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 200,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    tickValues: [0, 1, 2, 3, 4, 5, 6],
                    axisLabel: 'Month'
                },
                yAxis: {
                    axisLabel: 'Quantity',
                    tickFormat: function(d){
                        return d3.format('.0f')(d);
                    },
                    axisLabelDistance: 50
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            }
        };


        var data = [
            [2.5, 3.4, 4.4, 5.1, 5.6, 6.1, 6.4],
            [2.9, 3.9, 4.9, 5.6, 6.2, 6.7, 7.1],
            [3.3, 4.5, 5.6, 6.4, 7, 7.5, 7.9],
            [3.9, 5.1, 6.3, 7.2, 7.9, 8.4, 8.9],
            [4.3, 5.7, 7, 7.9, 8.6, 9.2, 9.7]
        ];

        function readyData(){
            $scope.data = [];

            for(var i = 0; i < data.length; i++) {

                var datarow = {
                    "key" : i,
                    "values" : []
                };
                for(var z = 0; z < data[i].length; z++) {
                    datarow.values.push(
                        {x: z, y: data[i][z]}
                    );
                }
                $scope.data.push(datarow);
            }
        }

        readyData();

        $scope.config = {
            visible: true, // default: true
            extended: false, // default: false
            disabled: false, // default: false
            autorefresh: true, // default: true
            refreshDataOnly: false // default: false
        };

        $scope.trendTemplate = 'templates/trends/growth.html';



    }])