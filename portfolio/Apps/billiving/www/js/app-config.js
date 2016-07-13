
function initializeCordovaApplication() {
//  window.open = cordova.InAppBrowser.open;
}

document.addEventListener('deviceready', initializeCordovaApplication, false);
document.addEventListener("resume", function (Utils) {
//  Utils.initialize();
}, false);