
/**
 * Initialize application
 */

(function() {'use strict';

	// Initialize application
	if (Util.isCordova()) {
		// cordova version
		document.addEventListener("deviceready", function() {
			app.initialize();
			initPushwoosh();
			onSizeChange();
		});
	} else {
		// not cordova version
		$(document).ready(function() {
			$(window).load(function() {
				setTimeout(function() {
					app.initialize();
					//initPushwoosh();
					onSizeChange();
				}, 1);
			});
		});
	}

	// Prevent default phone bounce behavior
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	// adjust rem root size
	function onResetREM() {
		$(document.documentElement).css("font-size", ($(window).width() / 100) + "px");
	}
	onResetREM();
	function onSizeChange() {
		onResetREM();
		// invoke page onResize event
		for (var pageId in app.getController().mobilePages) {
			var page = app.getController().mobilePages[pageId];
			if (page.onResize != null) {
				page.onResize();
			}
		}
	}


	function initPushwoosh() {
	    var pushNotification = window.plugins.PushNotification;	 
	    //set push notification callback before we initialize the plugin
	    document.addEventListener('push-notification', function(event) {
	        //get the notification payload
	        var notification = event.notification;
	         //display alert to the user for example
	        alert(notification.aps.alert);
            //clear the app badge
	        pushNotification.setApplicationIconBadgeNumber(0);
	     });
	 
	    //initialize the plugin
	    pushNotification.onDeviceReady({pw_appid:"B0C16-5A821"});
	     
	    //register for pushes
	    pushNotification.registerDevice(
	        function(status) {
	            var deviceToken = status['deviceToken'];
	            console.warn('registerDevice: ' + deviceToken);
	        },
	        function(status) {
	            console.warn('failed to register : ' + JSON.stringify(status));
	            //alert(JSON.stringify(['failed to register ', status]));
	        }
	    );
	     
	    //reset badges on app start
	    pushNotification.setApplicationIconBadgeNumber(0);
	}


	window.onresize = onSizeChange;


})();
