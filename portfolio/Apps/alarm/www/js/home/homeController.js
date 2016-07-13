define(["app", "js/home/homeView", "js/alarmModel"], function (app, HomeView, Alarm) {
  var alarm = null;
  var bindings = [{
      element: '.alarm-list-link',
      event: 'click',
      handler: runEditMode
    }, {
      element: '.go-list-button',
      event: 'click',
      handler: goToList
    }, {
      element: '.checkbox',
      event: 'click',
      handler: changeStatus
    }, {
      element: '.alarm-add-button',
      event: 'click',
      handler: alarmAddPopup
    }, {
      element: '.alarm-test-button',
      event: 'click',
      handler: alarmTestPopup
    }, {
      element: '.alarm-ok-button',
      event: 'click',
      handler: stopAlarm
    }];

  function init(query) {
    var alarms = JSON.parse(localStorage.getItem("f7Alarms"))?JSON.parse(localStorage.getItem("f7Alarms")):[];
    if (query && query.id) {
      alert(query.id);
			alarm = new Alarm(_.find(alarms, { id: query.id }));
      HomeView.render({
        model: alarm,
        isData: false,
        isActive:true,
        bindings: bindings
      });
		}else{
      alarm = loadAlarm();
      var isData = false;
      isData = (alarm) ? true : false;
      alarm = new Alarm(alarm);
      HomeView.render({
        model: alarm,
        isData: isData,
        isActive:false,
        bindings: bindings
      });
    }
    

    setTimeContent()
    setInterval(function () {
      setTimeContent();
    }, 1000)
  }

  function runEditMode() {
    app.router.load('alarmEdit', {id: alarm.id});
  }
  function goToList() {
    app.router.load('list');
    app.mainView.reloadPage('list.html');
  }
  function changeStatus() {
    var status = $$(this).data('status');
    var id = $$(this).data('id');
    status = status==="false" ? true : false;
    $$(this).attr('data-status', status);
    app.utils.setStatus(id, status);
    app.utils.setAlarms();
  }
  function alarmTestPopup() {
    app.utils.alarmPlay(alarm);
  }
  function stopAlarm() {
    app.utils.alarmStop();
  }
  function activeAlarm(query){
    var alarms = JSON.parse(localStorage.getItem("f7Alarms"))?JSON.parse(localStorage.getItem("f7Alarms")):[];
		if (query && query.id) {
			alarm = new Alarm(_.find(alarms, { id: query.id }));
		}
    if(app.mainView.activePage.name != "home"){
      app.router.load('alarmActive', {id: alarm.id});
    }else{
      HomeView.render({
        model: alarm,
        isData: false,
        isActive:true,
        bindings: bindings
      });
    }
  }

  function alarmAddPopup() {
    app.router.load('alarmEdit');
  }

  function loadAlarm() {
    var f7Alarms = localStorage.getItem("f7Alarms");
    var alarms = f7Alarms ? JSON.parse(f7Alarms) : [];

    alarms = app.utils.setActivePoint(alarms);
    alarms.sort(app.utils.alarmSort);

    return alarms[0];
  }

  function setTimeContent() {
    var date = new Date;
    var minutes = date.getMinutes();
    var hour = date.getHours();

    $$('.alarm-hours').html(app.utils.setTimeString(hour));
    $$('.alarm-minute').html(app.utils.setTimeString(minutes));
  }

  return {
    init: init,
    activeAlarm:activeAlarm
  };
});