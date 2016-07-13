var appStateManager;

appStateManager = (function() {
  function appStateManager() {}

  appStateManager.isInitialized = false;
  appStateManager.shouldProcessCallbacks = true;

  appStateManager.handlers = {resume: [], pause: []};

  appStateManager.onPause = function(callback, force) {
    this._registerHandler("pause", callback, force);
  }

  appStateManager.onResume = function(callback, force) {
    this._registerHandler("resume", callback, force);
  }

  appStateManager.switchContext = function(callback, scope) {
    var context = {switchBack: function() { appStateManager._turnProcessingOn(); }}

    appStateManager._turnProcessingOff();
    callback.call(scope, context);
  }

  appStateManager.openUrl = function(url, target, options) {
    if (!target)
      target = '_blank';

    if (!options)
      options = 'location=no,clearsessioncache=yes,clearcache=yes';

    var self = this;

    appStateManager._turnProcessingOff();
    var browserRef = window.open(url, target, options);
    browserRef.addEventListener("exit", function(event) {
      appStateManager._turnProcessingOn();
    });

    return browserRef;
  }

  appStateManager.initialize = function() {
    if (!this.initialized) {
      document.addEventListener("resume", this._processOnResumeHandlers, false);
      document.addEventListener("pause",  this._processOnPauseHandlers,  false);

      this.initialized = true;
    }
  }

  appStateManager._turnProcessingOn = function() {
    setTimeout(function() { console.log("turn Processing On"); appStateManager.shouldProcessCallbacks = true; }, 200);
  }

  appStateManager._turnProcessingOff = function() {
    console.log("turn Processing Off");
    appStateManager.shouldProcessCallbacks = false;
  }

  appStateManager._registerHandler = function(state, callback, force) {
    this.initialize();

    if (force)
      document.addEventListener(state,  callback,  false);
    else
      this.handlers[state].push(callback);
  }

  appStateManager._processOnPauseHandlers = function() {
    appStateManager._processHandlers('pause');
  }

  appStateManager._processOnResumeHandlers = function() {
    appStateManager._processHandlers('resume');
  }

  appStateManager._processHandlers = function(type) {
    if (appStateManager.shouldProcessCallbacks) {
      for (var i in appStateManager.handlers[type]) {
        console.log('process callback', appStateManager.shouldProcessCallbacks);
        appStateManager.handlers[type][i].call()
      }
    }

  }

  return appStateManager;
})();
