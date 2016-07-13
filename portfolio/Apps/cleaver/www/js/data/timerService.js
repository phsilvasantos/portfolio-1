angular.module('cleverbaby.services', [])
.service('timerService', ['$rootScope',
	function ($rootScope) {
	    function start(){
	        $rootScope.$broadcast('timer-start');
       		$rootScope.timerRunning = true;
	    }
	    function stopTimer(){
	    	$rootScope.$broadcast('timer-stop');
       		$rootScope.timerRunning = false;
	    }
	    function alarm(){

	    }
	    function getTime(){
	    	var time = "";
	    	$rootScope.$on('timer-stopped', function (event, data){
                time = data;
            });
            return time;
	    }
	    return{

	    	setTimer  : start,
	    	stopTimer : stopTimer,
	    	getTime : getTime

	    };
}])
