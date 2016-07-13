/**
 * XML Utility
 */

(function() {'use strict';

	/**
	 * parse xml string to xml object
	 */
	Util.parseXML = function(str) {
		if (window.DOMParser) {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(str,"text/xml");
			return xmlDoc;
		} else {
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(str);
		}
	};

})();
