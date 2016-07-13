'use strict';

angular.module('myApp.filters', [])
        .filter("nl2br", function($filter) {
          return function(data) {
            if (!data)
              return data;
            return data.replace(/\n\r?/g, '<br />');
          };
        })

        .filter('toPhoneNumber', function() {
          return function(input) {
            input = input.replace(/\D/g, '');
            return '(' + input.substr(0, 3) + ')' + input.substr(3, 3) + '-' + input.substr(6);
          }
        })
        .filter('capitalize', function() {
          return function(input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
          }
        })
        .filter('html2plain', function() {
          return function(text) {
            if (!text) {
              return text;
            }
            text = String(text).replace(/<br>/gi, ' ');
            return String(text).replace(/<[^>]+>/gm, '');
          };
        })
        .filter('plain2html', function() {
          return function(text) {
            if (!text) {
              return text;
            }
            text = String(text).replace(/\n/gi, '<br>');
            return text;
          };
        })
        .filter('clientsSearch', function() {
          return function(dataArray, searchTerm) {
            if (!dataArray || !searchTerm) {
              return dataArray;
            }

            var term = searchTerm.toLowerCase();
            return dataArray.filter(function(item) {
              if ((item.ContactName || '').toLowerCase().indexOf(term) !== -1 ||
                      (item.OrganizationName || '').toLowerCase().indexOf(term) !== -1 ||
                      (!item.OrganizationName && (item.Email || '').toLowerCase().indexOf(term) !== -1)) {
                return true;
              }
              return false;
            });
          };
        });
