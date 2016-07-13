define(['js/utils'], function (utils) {
  /**
   * Init router, that handle page events
   */
  function init() {
    $$(document).on('pageBeforeInit', function (e) {
      var page = e.detail.page;
      console.log(page.name, page.query);
      load(page.name, page.query);
    });
    document.addEventListener('deviceready', function(){
      document.addEventListener("backbutton", function(e){
         e.preventDefault();
      }, false);
      utils.setAlarms();
    }, false);
  }

  /**
   * Load (or reload) controller from js code (another controller) - call it's init function
   * @param controllerName
   * @param query
   */
  function load(controllerName, query) {
    require(['js/' + controllerName + '/' + controllerName + 'Controller'], function (controller) {
      controller.init(query);
    });
  }

  return {
    init: init,
    load: load
  };
});