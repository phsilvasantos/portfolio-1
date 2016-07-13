$(document).bind("mobileinit", function () {
    $.support.cors = true;
    $.mobile.touchOverflowEnabled = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.pushStateEnabled = true;      
    $.mobile.page.prototype.options.domCache = true;
	$.mobile.loader.prototype.options.text = "Loading, Please Wait...";
	$.mobile.loader.prototype.options.textVisible = true;
	$.mobile.loader.prototype.options.theme = "c";
	$.mobile.loader.prototype.options.html = "";  
	$.mobile.changePage.defaults.allowSamePageTransition = true;
});