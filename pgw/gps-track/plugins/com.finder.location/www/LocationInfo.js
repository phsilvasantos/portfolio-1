cordova.define("com.finder.location.LocationInfo", function(require, exports, module) { (function( cordova ) {

    function LocationInfo() {}

    LocationInfo.prototype.locationData = function(win, fail) {
        return cordova.exec(
                function (args) { if(win !== undefined) { win(args); } },
                function (args) { if(fail !== undefined) { fail(args); } },
                "LocationInfo", "locationData", []);
    };

    if(!window.plugins) {
        window.plugins = {};
    }

    if (!window.plugins.LocationInfo) {
        window.plugins.LocationInfo = new LocationInfo();
    }

})( window.cordova );

});
