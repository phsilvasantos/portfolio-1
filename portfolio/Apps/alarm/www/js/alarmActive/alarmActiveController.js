define(["app", "js/alarmModel", "js/alarmActive/alarmActiveView"], function (app, Alarm, View) {

  var alarm = null;
  var myInterval;
  var state = {
    isNew: false
  };
  var bindings = [
    {
      element: '.alarm-confirm-button',
      event: 'click',
      handler: closePage
    }
  ];

  function init(query) {
    var alarms = JSON.parse(localStorage.getItem("f7Alarms"));
    if (query && query.id) {
      alarm = new Alarm(_.find(alarms, {id: query.id}));
    }
    else {
      alarm = _.find(alarms, {time: setTimeString(new Date().getHours()) + ':' + setTimeString(new Date().getMinutes())});
      console.log('sdfsdfsdfsdfsdfsdfsdf', alarm);
      alarm = new Alarm(alarm);
    }
    console.log(alarm);
    View.render({model: alarm, bindings: bindings, state: state});
    
    setTimeContent()
    myInterval = setInterval(function () {
      setTimeContent();
    }, 30000);
  }

  function closePage() {
    clearTimeout(myInterval);
    app.mainView.reloadPage('index.html');
    stopAudio();
    app.f7.closeModal();
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