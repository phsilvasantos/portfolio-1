'use strict';

angular.module('gnApp.services', [])
        .factory('appNotificationsCounter', function () {
          return {
            counter: 0,
            enabled: false,
            cordovaNotification: null,
            getCounter: function () {
              return this.counter;
            },
            enable: function () {
              this.enabled = true;
            },
            disable: function () {
              this.enabled = false;
            },
            increaseCounter: function (number) {
              return this.counter += number;
            },
            decreaseCounter: function (number) {
              this.counter -= number;
              if (this.counter < 0) {
                this.counter = 0;
              }

              return this.counter;
            }
          };

        })

        .factory('deviceState', function ($interval, $rootScope) {
          this.active = true;
          var self = this;

          return {
            isInBackground: function () {
              return !self.active;
            },
            pause: function () {
              self.active = false;
              window.appIsInForeground = false;

              notificationsService.sendParseConnectionStatus(false);
              $interval.cancel($rootScope.sendActivity);

              console.log('PAUSE!', self.active);
            },
            resume: function () {
              self.active = true;
              setTimeout(function() { window.appIsInForeground = true; }, 2000);

              notificationsService.sendParseConnectionStatus(true);
              $rootScope.sendActivity = $interval($rootScope.registerActivity, 60000);

              console.log('RESUME!', self.active);
            }
          };
        })

        .factory('QueryParams', function () {
          return {
            parse: function () {
              var sear = window.location.href.split('?')[1];
              var params = {};
              if (sear) {
                var a = sear.split('&');
                if (a) {
                  for (var i = 0; i < a.length; ++i) {
                    var p = a[i].split('=');
                    if (p.length != 2)
                      continue;
                    params[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                  }
                }
              }
              return params;
            },
            get: function (key) {
              return this.parse()[key];
            }
          };

        })

        .factory('HttpUtils', function (Utils) {
          return {
            requestPin: function (phoneNum, callback) {
              Utils.showIndicator();
              Parse.Cloud.run('resetPin', {
                phone: phoneNum
              }, {
                success: function (response) {
                  Utils.hideIndicator();
                  callback(response);
                },
                error: function (error) {
                  Utils.hideIndicator();
                  Utils.alert('An error occurred while requesting passcode.');
                }
              });
            },
            getUserGroups: function (user, callback, errorCallback) {
              user = user || Parse.User.current();
              Parse.Cloud.run('groupsForUser', {id: user.id}, {
                success: function (response) {
                  callback(response);
                },
                error: function (error) {
                  Utils.hideIndicator();
                  Utils.alert('An error occurred while listing groups for this user.');
                  if (errorCallback) {
                    errorCallback(error);
                  }
                }
              });
            }
          };

        })

        .factory('AppConfig', function () {
          return {
            config: function () {
              return Parse.Config.get();
            }
          }
        })

        .factory('Utils', function ($ionicLoading, $ionicPopup, AppConfig, DefaultTimezone, DefaultDatetimeFormat) {
          var UtilsSrv = {
            config: null,
            showIndicator: function () {
              window.iL = $ionicLoading;
              console.log('SHOW INDICATOR');
              $ionicLoading.show({
                template: '<span class="preloader preloader-white"></span>'
              });
            },
            hideIndicator: function () {
              $ionicLoading.hide();
            },
            alert: function (msg, title, callback) {
              title = title || UtilsSrv.config.get('organizationName');
              var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
              });
              if (callback) {
                alertPopup.then(function (res) {
                  callback();
                });
              }
            },
            confirm: function (msg, title, success, cancel) {
              var confirmPopup = $ionicPopup.confirm({
                title: title || UtilsSrv.config.get('organizationName'),
                template: msg
              });
              confirmPopup.then(function (res) {
                if (res) {
                  if (success)
                    success();
                } else {
                  if (cancel)
                    cancel();
                }
              });
            },
            formatDate: function (dt, format) {
              if (!format) {
                format = DefaultDatetimeFormat;
              }
              return moment(dt).tz(DefaultTimezone).format(format);
            },
            correctImageDataURI: function (dataURI) {
              //if mime type is not defined(specifically on samsung galaxy)
              if (/data:;?base64,/.test(dataURI)) {
                dataURI = dataURI.replace(/data:;?base64,/, 'data:image/jpeg;base64,');
              }
              return dataURI;
            },
            getThumbImage: function (obj) {
              var thumbUrl;
              if (obj.thumbImage) {
                thumbUrl = obj.thumbImage.url();
              }
              if (!thumbUrl && obj.get) {
                if (obj.get('thumbImage')) {
                  thumbUrl = obj.get('thumbImage').url();
                }
                if (!thumbUrl && obj.get('contentType')) {
                  thumbUrl = UtilsSrv.getFileTypeIcon(obj.get('contentType'));
                }
              }
              return thumbUrl || 'img/default_image.svg';
            }
          };

          AppConfig.config().then(function (conf) {
            UtilsSrv.config = conf;
          });

          return UtilsSrv;
        })

        .factory('EventUtils', function ($rootScope, Utils) {
          var eventUtilsSrv = {
            myAttendees: [],
            loadMyAttendedEvents: function (callback) {
              var query = new Parse.Query(Parse.Object.extend('Attendee'));
              query.equalTo("user", Parse.User.current());
              query.find({
                success: function (data) {
                  $rootScope.$apply(function () {
                    eventUtilsSrv.myAttendees = data;
                  });
                  if (callback) {
                    callback(data);
                  }
                }
              });
            },
            hasRepliedYes: function (event) {
              return this.getResponse(event).get('response') == 'yes';
            },
            hasRepliedNo: function (event) {
              return this.getResponse(event).get('response') == 'no';
            },
            hasRepliedMaybe: function (event) {
              return this.getResponse(event).get('response') == 'maybe';
            },
            hasReplied: function (event) {
              var responseObj = this.getResponse(event);
              if (responseObj) {
                return responseObj != 'no_response';
              } else {
                return false;
              }
            },
            // attendeesForEvent: function(event) {
            //   var rval = eventUtilsSrv.myAttendees.filter(function (i) {
            //     if(i.get('event').id == event.id) {
            //       return val.get('respnse');
            //     } else {
            //       return null;
            //     }
            //   });
            //   return _.compact(rval);
            // },

            getResponse: function (event) {
              if (!event)
                return 'no_response';
              return eventUtilsSrv.myAttendees.filter(function (val) {
                if (val && val.get('event').id == event.id) {
                  return val.get('response');
                }
              })[0] || 'no_response';
            },
            /**
             * check if current user is attended or not to specific event
             *
             * @param {type} event
             * @returns Attendee or false
             */
            isAttended: function (event) {
              if (!event) {
                return false;
              }
              return eventUtilsSrv.myAttendees.filter(function (val) {
                return val && val.get('event').id == event.id;
              })[0] || false;
            },
            displayEventDate: function (dt, format) {
              return Utils.formatDate(dt, format);
            },
            getLocationString: function (event) {
              if (!event) {
                return '';
              }
              var cityStr = (event.get('city') || '') + ' ' + (event.get('zip') || '');
              var locationStr = event.get('streetAddress1') || '';
              if (locationStr && jQuery.trim(cityStr)) {
                locationStr += ', ';
              }
              locationStr += cityStr;
              return locationStr ? jQuery.trim(locationStr) : '';
            },
            attendingTense: function (event) {
              if (eventUtilsSrv.isPast(event))
                return 'Attended';
              var registeredAttendee = eventUtilsSrv.isAttended(event);
              var response = registeredAttendee ? registeredAttendee.get('response') : '';
              return (response === 'no' ? 'Not ' : response) + ' Attending';
            },
            isPast: function (event) {
              if (event == null)
                return false;
              var d = new Date();
              d.setHours(0, 0, 0, 0);
              return d > event.get('startAt');
            },
            updateAttendeeCount: function (event) {
              var query = new Parse.Query(Parse.Object.extend('Attendee'));
              query.equalTo("event", event);
              query.count({
                success: function (count) {
                  event.save({attendeeCount: count});
                }
              });
            }
          };

          return eventUtilsSrv;
        })
        .factory('Mentions', function($timeout) {
          var r = {};

          r.inputElement = null;
          r.mentionKeyCharacter = '@';
          r.mentioned = [];
          r.coordinatesOfPotentionalMention = [];
          r.showMention = false;
          r.mentionWord = '';
          r.availableUsersCb = function() { console.log('PLEASE DEFINE ME')};
          r.ready = false;
          r.mentionUsersList = [];

          r.reset = function() {
            this.ready = false;

            this.mentioned = [];
            this.coordinatesOfPotentionalMention = [];
            this.showMention = false;
            this.mentionWord = '';
            this.mentionUsersList = [];
          }

          r.initialize = function(inputElement, availableUsersCb) {
            this.inputElement = inputElement;
            this.availableUsersCb = availableUsersCb;

            this.ready = true;
          };

          r.displayMentionsList = function() {
            console.log('displayMentionsList', this.showMention);
            return this.showMention;
          };

          r.watchIfMentionCalled = function(message){
            console.log('watchIfMentionCalled', message);
            console.log(this.inputElement, this.mentionKeyCharacter);

            var cursor = this.getCursorPosition(this.inputElement.get(0));
            var re = new RegExp('(?:^|\\W)' + this.mentionKeyCharacter + '(\\w+)(?!\\w)', 'g'); // match the word that starts with mention character
            var match;
            this.showMention = false;
            while (match = re.exec(message)) {
              console.log('User type @');

              var matchedStringIndex = match.index;
              var matchedStringEndIndex = match.index + match[0].length;
              if(matchedStringIndex < cursor && matchedStringEndIndex >= cursor && match[1].length > 1){
                console.log('Potential mention here');

                this.mentionWord = match[1];
                this.coordinatesOfPotentionalMention = [matchedStringIndex, matchedStringEndIndex];
                this.grepMentionUsers();
              }
              else{
                if(this.showMention
                ) this.showMention = false;
              }
            }
          };

          r.getCursorPosition = function(el) {
            var pos = 0;
            if('selectionStart' in el) {
              pos = el.selectionStart;
            } else if('selection' in document) {
              el.focus();
              var Sel = document.selection.createRange();
              var SelLength = document.selection.createRange().text.length;
              Sel.moveStart('character', -el.value.length);
              pos = Sel.text.length - SelLength;
            }
            return pos;
          }

          r.setCursorPosition = function(el, caretPos) {
            el.value = el.value;
            if (el !== null) {
              if (el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
                return true;
            }
            else {
                if (el.selectionStart || el.selectionStart === 0) {
                  el.focus();
                  el.setSelectionRange(caretPos, caretPos);
                  return true;
                }
                else  {
                  el.focus();
                  return false;
                }
              }
            }
          };

          r.grepMentionUsers = function() {
            var keyword = this.mentionWord.toLowerCase().trim();
            var self = this;

            if (keyword.length) {
              var users = [];
              $.grep(this.availableUsersCb(), function(user) {
                var searchString = (user.attributes.email + ' ' + user.attributes.firstName + ' ' + user.attributes.lastName).toLowerCase();
                if (searchString.indexOf(keyword) > -1) {
                  var item = {
                    id: user.id,
                    email: user.attributes.email,
                    firstName: user.attributes.firstName,
                    lastName: user.attributes.lastName,
                    avatarUrl: self.getAvatar(user)
                  };
                  users.push(item);
                }
              });

              this.mentionUsersList = users;
              console.log('GREPED MENTIONS USERS', users);
              if(this.mentionUsersList.length){
                this.showMention = true;
              }
            }else{
              this.mentionUsersList = [];
              this.showMention = false;
            }
          };

          r.getMentionUsersList = function() {
            return this.mentionUsersList;
          }

          r.getAvatar = function(user) {
            var userAvatar = null;
            if (user && user.attributes.profile) {
              userAvatar = user.attributes.profile.get('thumbImage');
            }

            if (userAvatar) {
              return userAvatar.url();
            }
            return 'http://placehold.it/70x70'
          };

          r.formMentionedList = function() {
            var sendList = [];
            var string;
            for (var user in this.mentioned){
              if(this.mentioned[user]){
                string = { "id": this.mentioned[user].id, "stub": this.formMentionString(this.mentioned[user]) };
                sendList.push(JSON.stringify(string));
              }
            }
            this.mentioned = [];
            console.log('FORM MENTIONED LIST', sendList);
            return sendList;
          };

          r.formMentionString = function(user) {
            return '@' + user.firstName + ' ' + user.lastName;
          };

          r.addUserToMentions = function(user, currentMessage, callback) {
            var self = this;
            this.mentioned.push(user);
            console.log(this.mentioned);
            var mention = this.formMentionString(user);
            var message = this.formMessageAfterMention(mention, currentMessage);
            this.showMention = false;
            var jsInputElement = this.inputElement.get(0);
            $timeout(function(){
              jsInputElement.focus(); //focus after click
              self.setCursorPosition(jsInputElement, self.coordinatesOfPotentionalMention[0] + mention.length + 1); //set caret in needed place
              callback.call();
            });

            return message;
          };

          r.formMessageAfterMention = function(mention, message) {
            var startCoords = this.coordinatesOfPotentionalMention[0] ? this.coordinatesOfPotentionalMention[0] + 1 : 0;
            var endCoords = this.coordinatesOfPotentionalMention[1];
            return message.slice(0, startCoords) + mention + ' ' + message.slice(endCoords, message.length);
          }

          r.checkMentionedOnTheirPlaces = function(message) {
            console.log(this.mentioned);
            var mentionString, mentionUser;
            for (var user in this.mentioned){
              mentionUser = this.mentioned[user];
              mentionString = this.formMentionString(mentionUser);
              var re = new RegExp(mentionString, 'gi');
              var res = message.match(re);
              if(!res){
                this.mentioned[user] = false;
              }
            }
            return true;
          };

          r.parseMentionsInText = function(body, mentions) {
            var parsedMention;

            if (mentions) {
              for (var mention in mentions){
                parsedMention = mentions[mention];
                try{
                  parsedMention = JSON.parse(parsedMention);
                  var regexp = new RegExp(parsedMention.stub, 'g');
                  if(parsedMention.stub){
                    body = body.replace(parsedMention.stub, '<span class="mention">' + parsedMention.stub + '</span>');
                  }
                }
                catch(err){
                  console.log('Wrong mention! ' + err);
                }
              }
            }

            return body;
          };

          return r;
        });
