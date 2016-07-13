define(['app','js/alarmModel'], function(app, Alarm) {

  function render(params) {
		$$('.contact-page').html(app.tplMng.renderTplById('alarm',{ model: params.model }));
		bindEvents(params.bindings);
	}

	function bindEvents(bindings) {
		for (var i in bindings) {
			$$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	return {
		render: render
	}
});