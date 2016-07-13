cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.finder.device/www/deviceinfo.js",
        "id": "com.finder.device.deviceinfo",
        "clobbers": [
            "deviceinfo"
        ]
    },
    {
        "file": "plugins/com.finder.sharedprefs/www/sharedprefs.js",
        "id": "com.finder.sharedprefs.sharedprefs",
        "clobbers": [
            "sharedprefs"
        ]
    },
    {
        "file": "plugins/com.finder.admob.plugin/www/AdMob.js",
        "id": "com.finder.admob.plugin.AdMob",
        "clobbers": [
            "window.plugins.AdMob"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.launchmyapp/www/android/LaunchMyApp.js",
        "id": "nl.x-services.plugins.launchmyapp.LaunchMyApp",
        "clobbers": [
            "window.plugins.launchmyapp"
        ]
    },
    {
        "file": "plugins/com.finder.inappbilling/www/inappbilling.js",
        "id": "com.finder.inappbilling.InAppBillingPlugin",
        "clobbers": [
            "inappbilling"
        ]
    },
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/www/phonegap/plugin/facebookConnectPlugin/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/com.finder.location/www/LocationInfo.js",
        "id": "com.finder.location.LocationInfo",
        "clobbers": [
            "LocationInfo"
        ]
    },
    {
        "file": "plugins/com.google.android.gcm.finder.app/www/GcmPlugin.js",
        "id": "com.google.android.gcm.finder.app.GcmPlugin",
        "clobbers": [
            "GcmPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.finder.device": "0.2.10",
    "com.finder.sharedprefs": "0.2.10",
    "org.apache.cordova.console": "0.2.9-dev",
    "com.finder.admob.plugin": "2.0.1",
    "nl.x-services.plugins.launchmyapp": "3.2.0",
    "com.finder.inappbilling": "3.0.0",
    "com.ionic.keyboard": "1.0.2",
    "nl.x-services.plugins.socialsharing": "4.3.2",
    "org.apache.cordova.device": "0.2.10",
    "org.apache.cordova.geolocation": "0.3.8",
    "org.apache.cordova.inappbrowser": "0.4.1-dev",
    "com.phonegap.plugins.facebookconnect": "0.9.0",
    "com.finder.location": "0.2.10",
    "com.google.android.gcm.finder.app": "0.0.1"
}
// BOTTOM OF METADATA
});