cordova.define("com.finder.device.deviceinfo", function(require, exports, module) { (function( cordova ) {

    function DeviceInfo() {}

    DeviceInfo.prototype.imeiNumber = function(win, fail) {
        return cordova.exec(
                function (args) { if(win !== undefined) { win(args); } },
                function (args) { if(fail !== undefined) { fail(args); } },
                "DeviceInfo", "imeiNumber", []);
    };

    if(!window.plugins) {
        window.plugins = {};
    }

    if (!window.plugins.DeviceInfo) {
        window.plugins.DeviceInfo = new DeviceInfo();
    }

})( window.cordova );

});
