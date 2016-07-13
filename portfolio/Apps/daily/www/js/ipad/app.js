/**
 * Application Context
 */

var Application = function() {
};
(function() {'use strict';

	Application.prototype = {
		id : "application",
		
		// data center for news downloading
		data : new DataCenter(),

		// called when the application context is initialized
		initialize : function() {
			var self = this;
		}
	};

})();
