'use strict';

angular.module('myApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })
      .state('app.clients', {
        url: '/clients',
        views: {
          'menuContent': {
            templateUrl: 'templates/clients.html',
            controller: 'ClientsCtrl'
          }
        }
      })
      .state('app.edit-client', {
        url: '/edit-client:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-client.html',
            controller: 'EditClientCtrl'
          }
        }
      })
      .state('app.send-mail', {
        url: '/send-mail:id?dataurl',
        views: {
          'menuContent': {
            templateUrl: 'templates/send-mail.html',
            controller: 'SendMailCtrl'
          }
        }
      })
      .state('app.items', {
        url: '/items',
        views: {
          'menuContent': {
            templateUrl: 'templates/items.html',
            controller: 'ItemsCtrl'
          }
        }
      })
      .state('app.edit-item', {
        url: '/edit-item:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-item.html',
            controller: 'EditItemCtrl'
          }
        }
      })
      .state('app.invoices', {
        url: '/invoices',
        views: {
          'menuContent': {
            templateUrl: 'templates/invoices-estimates.html',
            controller: 'InvoicesEstimatesCtrl'
          }
        }
      })
      .state('app.edit-invoice', {
        url: '/edit-invoice:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-invoice-estimate.html',
            controller: 'EditInvoiceEstimateCtrl'
          }
        }
      })
      .state('app.estimates', {
        url: '/estimates',
        views: {
          'menuContent': {
            templateUrl: 'templates/invoices-estimates.html',
            controller: 'InvoicesEstimatesCtrl'
          }
        }
      })
      .state('app.edit-estimates', {
        url: '/edit-estimates:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/edit-invoice-estimate.html',
            controller: 'EditInvoiceEstimateCtrl'
          }
        }
      })
      .state('app.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/setting.html',
            controller: 'SettingCtrl'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/dashboard');
  });
