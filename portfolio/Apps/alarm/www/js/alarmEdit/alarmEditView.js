define(['app', 'js/alarmModel'], function (app, Alarm) {

  function render(params) {
    app.f7.popup(app.tplMng.renderTplById('alarmEdit',{model: params.model, state: params.state}));
    bindEvents(params.bindings, params.model);
    bindSaveEvent(params.doneCallback, params.model);
  }

  function bindEvents(bindings, model) {
    for (var i in bindings) {
      $$(bindings[i].element).off(bindings[i].event);
      $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
    }
    var timeArr = model.time.split(':');
    console.log(timeArr);
    var hour = timeArr[0];
    var minute = timeArr[1];

    app.f7.picker({
      input: '#time',
      container: '#picker-date-container',
      toolbar: false,
      rotateEffect: true,
      value: [hour, minute],
      formatValue: function (p, values, displayValues) {
        return values[0] + ':' + values[1];
      },
      cols: [
        // Hours
        {
          values: (function () {
            var arr = [];
            for (var i = 0; i <= 23; i++) {
              arr.push(i < 10 ? '0' + i : i);
            }
            return arr;
          })(),
        },
        // Divider
        {
          divider: true,
          content: ':'
        },
        // Minutes
        {
          values: (function () {
            var arr = [];
            for (var i = 0; i <= 59; i++) {
              arr.push(i < 10 ? '0' + i : i);
            }
            return arr;
          })(),
        }
      ]
    });
  }

  function bindSaveEvent(doneCallback, model) {
    console.log('model', model)
    $$('.alarm-save-link').on('click', function () {
      var inputValues = $$('.alarm-edit-form input');
      doneCallback(inputValues);
    });
  }

  return {
    render: render
  };
});