define(["app", "js/alarmModel", "js/list/listView"], function (app, Alarm, ListView) {

  /**
   * Bindings array. Bind DOM event to some handler function in controller
   * @type {*[]}
   */
  var bindings = [{
      element: '.contact-add-link',
      event: 'click',
      handler: openAddPopup
    }, {
      element: '.list-panel-all',
      event: 'click',
      handler: showAll
    }, {
      element: '.contact-home-link',
      event: 'click',
      handler: goHome
    }, {
      element: '.checkbox',
      event: 'click',
      handler: changeStatus
    }, {
      element: '.alarm-edit-link',
      event: 'click',
      handler: selectAlarm
    }
  ];

  var state = {
    isFavorite: false
  };

  function init() {
    var alarms = loadAlarms();
    console.log(alarms);
    ListView.render({
      bindings: bindings,
      model: alarms
    });
  }

  function openAddPopup() {
    app.router.load('alarmEdit', {'isFavorite': state.isFavorite});
  }
  
  function goHome() {
    app.router.load('list');
    app.mainView.reloadPage('index.html');
  }

  function changeStatus() {
    var status = $$(this).data('status');
    var id = $$(this).data('id');
    status = status==="false" ? true : false;
    $$(this).attr('data-status', status);
    app.utils.setStatus(id, status);
    app.utils.setAlarms();
  }
  function selectAlarm(){
    var id = $$(this).data('alarmid');
    app.router.load('alarmEdit', {id: id});
  }
  function showAll() {
    state.isFavorite = false;
    var alarms = loadAlarms();
    ListView.reRender({bindings: bindings, model: alarms, header: "Alarms"});
  }

  function loadAlarms() {
    var f7Alarms = localStorage.getItem("f7Alarms");
    var alarms = f7Alarms ? JSON.parse(f7Alarms) : [];
    alarms = app.utils.setActivePoint(alarms);
    alarms.sort(app.utils.alarmSort);

    var date = new Date;
    var weekday = app.utils.setWeekDayString(date.getDay());
    return {'list': alarms, weekday: weekday};
  }
  
  return {
    init: init
  };
});