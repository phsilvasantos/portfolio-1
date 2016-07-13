define(["app","js/alarm/alarmView", "js/alarmModel"], function(app, AlarmView, Alarm) {
	var alarm = null;
	var bindings = [{
		element: '.contact-edit-link',
		event: 'click',
		handler: runEditMode
	},{
		element: '.alarm-set-button',
		event: 'click',
		handler: testAlarmMode
	}];

	function init(query){
		var alarms = JSON.parse(localStorage.getItem("f7Alarms"))?JSON.parse(localStorage.getItem("f7Alarms")):[];
		if (query && query.id) {
			alarm = new Alarm(_.find(alarms, { id: query.id }));
		}else{
      alarms.sort(alarmSort);
      alarm = new Alarm(alarms[alarms.length-1]);
      var date = new Date;
      var curhour = date.getHours();
      var curminute = date.getMinutes();
      var weekday = app.utils.setTimeString(date.getDay());
      for(var i = 0; i < alarms.length; i++){
        var alarmObj = new Alarm(alarms[i]);
        if(!alarmObj[weekday]) continue;
        if(new Date('1970/01/01 ' + alarmObj.time) - new Date('1970/01/01 ' + curhour + ':' + curminute)){
          alarm = new Alarm(alarmObj);
          break;
        }
      }
    }
    alarm.status = (alarm.status)?'ON':'OFF';
		AlarmView.render({
			model: alarm,
			bindings: bindings
		});
    setTimeContent()
    setInterval(function () {
      setTimeContent();
    }, 3000);
	}

	function runEditMode() {
		app.router.load('alarmEdit', {id: alarm.id });
	}
  
  function testAlarmMode() {
		app.utils.alarmTest(alarm);
	}
  
  function alarmSort(a, b) {
    return new Date('1970/01/01 ' + b.time) - new Date('1970/01/01 ' + a.time);
	}
  
  function setTimeContent() {
    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hour = date.getHours();

    $$('.alarm-hours').html(app.utils.setTimeString(hour));
    $$('.alarm-minute').html(app.utils.setTimeString(minutes));
  }

	return {
		init: init
	};
});