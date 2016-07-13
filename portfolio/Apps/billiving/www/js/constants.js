'use strict';

angular.module('myApp.constants', [])
        .constant('AppConfig', {
          organizationName: 'BILLIVING',
     /*   endpoint: 'http://localhost/InvoiceApp.Webapi/v1/', */
      	  endpoint: 'https://billiving-qa.azurewebsites.net/api2/v1/',
          dateFormatString : "MM-DD-YYYY",
          currencySimbolString : "$",
          currencyID : "",
          languageID : ""
        });

		
		
	
	
	