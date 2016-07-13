define(['app'], function (app) {

  function render(params) {
    $$('.alarms-list-content ul').html(app.tplMng.renderTplById('list', params.model));
    $$('.searchbar-cancel').click();
    bindEvents(params.bindings);
  }

  function reRender(params) {
    $$('.alarms-list-content ul').html(app.tplMng.renderTplById('list', params.model));
    $$('.alarms-list-content-header').text(params.header);
    $$('.searchbar-cancel').click();
    bindEvents(params.bindings);
  }

  function bindEvents(bindings) {
    for (var i in bindings) {
      $$(bindings[i].element).off(bindings[i].event);
      $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
    }
  }

  return {
    render: render,
    reRender: reRender
  };
});