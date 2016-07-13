define(["app", "js/alarmModel", "js/alarmEdit/alarmEditView"], function (app, Alarm, View) {

  var alarm = null;
  var state = {
    isNew: false
  };
  var bindings = [
    {
      element: '.alarm-delete-button',
      event: 'click',
      handler: deleteAlarm
    },
    {
      element: '.alarm-week-segment',
      event: 'click',
      handler: selectWeek
    }
  ];

  
  function init(query) {
    var alarms = JSON.parse(localStorage.getItem("f7Alarms"));
    if (query && query.id) {
      alarm = new Alarm(_.find(alarms, {id: query.id}));
      state.isNew = false;
    }
    else {
      alarm = new Alarm();
      state.isNew = true;
    }
    console.log(alarm);
    View.render({model: alarm, bindings: bindings, state: state, doneCallback: saveAlarm});
  }

  function selectWeek() {
    if ($$(this).hasClass('active')) {
      $$(this).removeClass('active');
    } else {
      $$(this).addClass('active');
    }
    alarm[$$(this).data('id')] = !alarm[$$(this).data('id')];
  }

  function deleteAlarm() {
    app.f7.actions([[{
          text: 'Delete Alarm',
          red: true,
          onClick: function () {
            var alarms = JSON.parse(localStorage.getItem("f7Alarms"));
            _.remove(alarms, {id: alarm.id});
            localStorage.setItem("f7Alarms", JSON.stringify(alarms));
            app.router.load('list');
            app.f7.closeModal();
          }
        }], [{
          text: 'Cancel',
          bold: true
        }]]);
  }

  function saveAlarm(inputValues) {
    console.log(inputValues);
    alarm.setValues(inputValues);

    var f7Alarms = localStorage.getItem("f7Alarms");
    var alarms = f7Alarms ? JSON.parse(f7Alarms) : [];

    if (!state.isNew) {
      _.remove(alarms, {id: alarm.id});
    }
    if ((_.find(alarms, {time: alarm.time}))) {
      app.f7.alert("Already registered!");
      return;
    }
    alarm.status = true;
    console.log('set alarm', alarm);
    alarms.push(alarm);
    localStorage.setItem("f7Alarms", JSON.stringify(alarms));
    app.utils.setAlarms();
    app.router.load('list'); // reRender main page view
    closePage();
  }

  function closePage() {
    app.mainView.reloadPage('index.html');
    app.f7.closeModal();
  }

  return {
    init: init
  };
});