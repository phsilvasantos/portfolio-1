'use strict';

angular.module('gnApp.filters', [])
        .filter("messageListDate", function ($filter) {
          return function (date) {
            var result = ''

            if (date) {
              var dateObj = new Date(date);
              var today = new Date();
              if ($filter('date')(dateObj, 'dd/MMM/yyyy') === $filter('date')(today, 'dd/MMM/yyyy')) {
                result = $filter('date')(dateObj, 'HH:mm');
              }
              else {
                result = $filter('date')(dateObj, 'MMM d');
              }
            }

            return result;
          };
        })

        .filter("messageRoomDate", function ($filter) {
          return function (date) {
            var today = new Date(),
                    dateObj = new Date(date);

            if ((new Date(date).setHours(0, 0, 0, 0)) == today.setHours(0, 0, 0, 0)) {
              return moment(dateObj).format("hh:mma");
            } else {
              return moment(dateObj).format("M/D/YY hh:mma")
            }
          };
        })

        .filter("nl2br", function ($filter) {
          return function (data) {
            if (!data)
              return data;
            return data.replace(/\n\r?/g, '<br />');
          };
        })

        .filter('gnYear', function () {
          return function (input, fields) {
            if (input == undefined) {
              return '';
            }
            return typeof (input) == 'string' ? input.split('-')[0] : input.getFullYear();
          };
        })
        .filter('gnHideYear', function () {
          return function (input, fields) {
            if (input == undefined) {
              return input;
            }
            var ary = input.split(/-/g);
            if (ary.length == 3) {
              if (ary[ary.length - 1].length == 4) {
                ary.pop();
              } else {
                ary = ary.slice(1);
              }
            }
            return ary.join('-');
          };
        })
        .filter('gnMembersSearch', function () {
          return function (dataArray, searchTerm) {
            if (!dataArray || !searchTerm) {
              return dataArray;
            }

            var term = searchTerm.toLowerCase();
            return dataArray.filter(function (item) {
              var name = item.get('firstName') + ' ' + item.get('lastName');
              if (name.toLowerCase().indexOf(term) > -1) {
                return true;
              }
              if (item.get('profile')) {
                var profileSections = item.get('profile').get('sections');
                for (var sectionTitle in profileSections) {
                  for (var fieldKey in profileSections[sectionTitle]) {
                    if ((profileSections[sectionTitle][fieldKey] || '').toLowerCase().indexOf(term) > -1) {
                      return true;
                    }
                  }
                }
              }
              return false;
            });
          };
        })
        .filter('gnFeedsSearch', function () {
          return function (dataArray, searchParam) {
            if (!dataArray || !searchParam) {
              return dataArray;
            }

            var type = (searchParam.type || '').toLowerCase();
            var filteredArray = null;
            if (type == 'event') {
              filteredArray = dataArray.filter(function (item) {
                return item.type.toLowerCase() === type;
              });
            } else if (type == 'announcement') {
              filteredArray = dataArray.filter(function (item) {
                return item.type.toLowerCase() !== 'event';
              });
            }
            return filteredArray || dataArray;
          };
        })
        .filter('toSentenceUsing', function () {
          return function (input, key) {
            if (typeof (input) != 'object') {
              return input;
            }
            input = _.map(input, function (i) {
              return i ? i.get(key) : '';
            });
            if (input.length == 0)
              return 'asdfasdf';
            if (input.length == 1)
              return input[0];
            if (input.length == 2)
              return input[0] + ' and ' + input[1];
            return input.slice(0, input.length - 1).join(', ') + ", and " + input.slice(-1);
          }
        })
        .filter('friendlySectionTitle', function () {
          return function (input) {
            if (input == 'Personal Info') {
              return 'Personal Info';
            } else {
              return input;
            }
          }
        })
        .filter('toPhoneNumber', function () {
          return function (input) {
            input = input.replace(/\D/g, '');
            return '(' + input.substr(0, 3) + ')' + input.substr(3, 3) + '-' + input.substr(6);
          }
        })
        .filter('capitalize', function () {
          return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
          }
        })
        .filter('htmlToPlaintext', function () {
          return function (text) {
            if (!text) {
              return text;
            }
            text = String(text).replace(/<br>/gi, ' ');
            return String(text).replace(/<[^>]+>/gm, '');
          };
        })
        .filter('plain2html', function () {
          return function (text) {
            if (!text) {
              return text;
            }
            text = String(text).replace(/\n/gi, '<br>');
            return text;
          };
        });
