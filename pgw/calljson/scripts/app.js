'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
        .module('myApp', [
            'myApp.controllers',
            'myApp.constants',
            'myApp.directives',
        ]).run(function($rootScope, $compile) {
            
    $$(document).on('pageInit', function(e) {
        // Do something here when page loaded and initialized
        $compile(angular.element(e.target))($rootScope);
        $rootScope.$apply();
        //element.replaceWith($compile(result.data)($rootScope));
    });
    
});
