cordova.define("com.finder.admob.plugin.AdMob", function(require, exports, module) { 
var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var admobExport = {};

admobExport.AD_SIZE = {
  BANNER: 'BANNER',
  IAB_MRECT: 'IAB_MRECT',
  IAB_BANNER: 'IAB_BANNER',
  IAB_LEADERBOARD: 'IAB_LEADERBOARD',
  SMART_BANNER: 'SMART_BANNER'
};

admobExport.setOptions =
	function(options, successCallback, failureCallback) {
	  if(typeof options === 'object' 
		  && typeof options.publisherId === 'string'
	      && options.publisherId.length > 0) {
		  cordova.exec(
			      successCallback,
			      failureCallback,
			      'AdMob',
			      'setOptions',
			      [options]
			  );
	  } else {
		  if(typeof failureCallback === 'function') {
			  failureCallback('options.publisherId should be specified.')
		  }
	  }
	};


admobExport.createBannerView =
function(options, successCallback, failureCallback) {
  if(typeof options === 'undefined' || options == null) options = {};
  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'createBannerView',
      [ options ]
  );
};

admobExport.createInterstitialView =
function(options, successCallback, failureCallback) {
  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'createInterstitialView',
      [ options ]
  );
};

admobExport.destroyBannerView =
function(options, successCallback, failureCallback) {
  if(typeof options === 'undefined' || options == null) options = {};
  cordova.exec(
	      successCallback,
	      failureCallback,
	      'AdMob',
	      'destroyBannerView',
	      []
	  );
};



admobExport.requestAd =
function(options, successCallback, failureCallback) {
	  if(typeof options === 'undefined' || options == null) options = {};
  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'requestAd',
      [ options ]
  );
};


admobExport.requestInterstitialAd =
function(options, successCallback, failureCallback) {
	  if(typeof options === 'undefined' || options == null) options = {};
  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'requestInterstitialAd',
      [ options ]
  );
};

admobExport.showAd = 
function( show, successCallback, failureCallback) {
	if (show === undefined) {
		show = true;
	}

	cordova.exec(
		successCallback,
		failureCallback, 
		'AdMob', 
		'showAd', 
		[ show ]
	);
};

admobExport.showInterstitialAd = 
	function( show, successCallback, failureCallback) {
		if (show === undefined) {
			show = true;
		}

		cordova.exec(
			successCallback,
			failureCallback, 
			'AdMob', 
			'showInterstitialAd', 
			[ show ]
		);
	};

module.exports = admobExport;


});
