/**
 * Ajax Utility
 */

(function() {'use strict';

	/**
	 * Send http request to server
	 *
	 * Parameters
	 * - method: Request Method
	 * - url: Request URL
	 * - headers: Request Headers
	 * - data: Request Data
	 * - responseType: Response Data Type - text, xml, json
	 * - success(text): Success Callback
	 * - fail(xmlHttpRequest): Failure callback
	 */
	Util.ajax = function(req) {

		var request = createXMLHttpRequest();

		// request state callback
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					if (req.success != null) {
						if (req.responseType == "xml") {
							req.success(request.responseXML);
						} else if (req.responseType == "json") {
							req.success(JSON.parse(request.responseText));
						} else {
							req.success(request.responseText);							
						}
					}
				} else {
					if (req.done != null) {
						req.done(request);
					}

					if(req.fail != null) {
						req.fail(request);
					}
				}
			}
		};

		// request method
		var method = req.method;
		if (method == null) {
			method = "GET";
		}
		// open the request
		request.open(method, req.url, true);
		// request headers
		var headers = req.headers;
		if (headers != null) {
			for (var key in headers) {
				request.setRequestHeader(key, headers[key]);
			}
		}
		// send request data to server
		if (req.data != null) {
			request.send(req.data);
		} else {
			request.send();
		}
	};

	// cross-browser XMLHttpRequest object
	function createXMLHttpRequest() {
		try {
			return new XMLHttpRequest();
		} catch(e) {
		}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		} catch (e) {
		}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch (e) {
		}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
		}
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
		}
		alert("XMLHttpRequest not supported");
		return null;
	}

})();
