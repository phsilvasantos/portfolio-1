define(['app', 'js/alarmModel'], function (app, Alarm) {

  function render(params) {
    app.f7.popup(app.tplMng.renderTplById('alarmActive',{model: params.model, state: params.state}));
    bindEvents(params.bindings);
    bindSaveEvent(params.doneCallback, params.model);
  }

  function bindEvents(bindings) {
    for (var i in bindings) {
      $$(bindings[i].element).off(bindings[i].event);
      $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
    }
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