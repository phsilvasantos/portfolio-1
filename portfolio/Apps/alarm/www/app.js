require.config({
  paths: {
    AlarmTpl: "templates/alarm.tpl.html",
    text: "lib/text"
  },
  shim: {
    handlebars: {
      exports: "Handlebars"
    }
  }
});
define('app', ['js/router', 'js/utils', 'js/tplManager'], function (Router, Utils, tplManager) {
  window.$$ = Dom7;
  Router.init();
  var f7 = new Framework7({
    modalTitle: 'My Alarm',
    swipePanel: 'left',
    animateNavBackIcon: true
  });
  var mainView = f7.addView('.view-main', {
    dynamicNavbar: true,
    domCache:true
  });

  return {
    f7: f7,
    mainView: mainView,
    router: Router,
    utils: Utils,
    tplMng:tplManager
  };
});