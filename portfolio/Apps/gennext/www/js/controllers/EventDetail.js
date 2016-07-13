'use strict';

angular.module('gnApp.controllers')
        .controller('EventDetailController', function ($scope, EventUtils, Utils, $location, $stateParams, $state, $timeout, $ionicPopover) {
          $scope.eventId = $stateParams.eventId;
          $scope.isRegisterPage = $state.includes('app.event-register');
          $scope.activeTab = $location.search().tab || 'content';

          $scope.event = new (Parse.Object.extend('Event'))();
          $scope.event.id = $scope.eventId;

          EventUtils.loadMyAttendedEvents();
          $scope.eventUtils = EventUtils;

          var EventModel = Parse.Object.extend('Event');

          function __photoGrid() {
            return new Masonry('.etab-content .photos-wrapper', {
              itemSelector: '.photo-item'
            });
          }

          $scope.selectTab = function (tab) {
            $scope.activeTab = tab;
            if (tab == 'photo') {
              $scope.loadEventPhotos(function () {
                $timeout(__photoGrid, 1000);
                $timeout(__photoGrid, 2000);
                $timeout(__photoGrid, 3000);
              });
            } else if (tab == 'attendees') {
              $scope.loadEventAttendees();
            } else {
              $scope.loadEvent();
              $scope.loadEventAttendees();
            }
          };

          $scope.loadEvent = function (eventId) {
            eventId = eventId || $scope.eventId;
            Utils.showIndicator();
            var query = new Parse.Query(EventModel);
            query.get(eventId).then(function (event) {
              if (window.mixpanel) {
                window.mixpanel.track("View Event", {
                  "Event ID": event.id,
                  "Event Title": event.get('title')
                });
              }

              $scope.$apply(function () {
                $scope.event = event;
                $scope.addReadBy();

                if ($scope.isRegisterPage) {
                  $scope.registeredAttendee = $scope.eventUtils.isAttended($scope.event);
                  if ($scope.registeredAttendee) {
                    $scope.data.guests = $scope.registeredAttendee.get('guests') || [];
                    $scope.data.response = $scope.registeredAttendee.get('response');
                    $scope.data.note = $scope.registeredAttendee.get('note');
                  }
                  $scope.guestCountList = [];
                  for (var i = 0; i < $scope.event.get('maxGuestCount') + 1; i++) {
                    $scope.guestCountList.push(i);
                  }
                }
              });
              Utils.hideIndicator();
            });
          };

          $scope.loadEventRecap = function () {
            var eventPointer = new Parse.Object('Event');
            eventPointer.id = $scope.eventId;
            var query = new Parse.Query(Parse.Object.extend('EventRecap'));
            query.equalTo("event", eventPointer);
            query.find({
              success: function (data) {
                $scope.$apply(function () {
                  $scope.eventRecap = data.length > 0 ? data[0] : null;
                });
              }
            });
          };
          $scope.loadEventRecap();

          $scope.loadEventAttendees = function () {
            Utils.showIndicator();
            var query = new Parse.Query(Parse.Object.extend('Attendee'));
            query.equalTo("event", $scope.event);
            query.equalTo("response", 'yes');
            query.include('user,user.profile');
            query.descending('createdAt');
            query.find({
              success: function (data) {
                var thumbnailsList = [];
                data.forEach(function (m) {
                  var obj = {};
                  try {
                    obj.thumbUrl = m.get('user').get('profile').get('thumbImage').url();
                  } catch (exc) {
                  }
                  thumbnailsList.push(obj);
                });
                $scope.$apply(function () {
                  $scope.attendees = data;
                  $scope.attendeeThumbnails = thumbnailsList;
                });
                Utils.hideIndicator();
              },
              error: function () {
                Utils.hideIndicator();
              }
            });
          };

          $scope.loadEventPhotos = function (callback) {
            Utils.showIndicator();
            var query = new Parse.Query(Parse.Object.extend('EventPhoto'));
            query.equalTo("event", $scope.event);
            query.descending('createdAt');
            query.find({
              success: function (data) {
                var photos = [];
                data.forEach(function (item) {
                  photos.push({
                    'id': item.id,
                    'imageUrl': item.get('photo').url(),
                    'thumbImageUrl': item.get('thumbImage').url(),
                    'author': item.get('speaker'),
                    'title': item.get('title'),
                    'createdAt': item.createdAt
                  });
                });
                $scope.$apply(function () {
                  $scope.photos = photos;
                  if (callback)
                    callback();
                });
                Utils.hideIndicator();
              },
              error: function () {
                Utils.hideIndicator();
              }
            });
          };

          $scope.showAddToCalendarConfirm = function () {
            $(document.body).append($('#tpl-addtocal-confirm').html());
            $('.mdl-addtocal-confirm').fadeIn(100);
            $('#btn_addtocalendar').click(function () {
              $(this).prop('disabled', true);
              $scope.addToCalendar();
            });
            $('#btn_hidecalendar').click(function () {
              $scope.hideAddToCalendarConfirm();
            });
          };
          $scope.hideAddToCalendarConfirm = function () {
            $('.mdl-addtocal-confirm').fadeOut(function () {
              $(this).remove();
            });
          };

          $scope.addToCalendar = function () {
            if (window.plugins && window.plugins.calendar) {
              var startDate = moment($scope.event.get('startAt'));
              var endDate = null;
              if ($scope.event.get('endsAt')) {
                endDate = moment($scope.event.get('endsAt'));
              } else {
                endDate = moment($scope.event.get('startAt')).add(1, 'hours');
              }
              Utils.showIndicator();
              window.plugins.calendar.createEvent(
                      $scope.event.get('title'),
                      $scope.event.get('streetAddress1') + ', ' + $scope.event.get('city') + ' ' + $scope.event.get('state'),
                      $scope.event.get('description'),
                      startDate.toDate(),
                      endDate.toDate(),
                      function () {
                        Utils.hideIndicator();
                        Utils.alert('This event has been added to your calendar successfully!');
                        $scope.hideAddToCalendarConfirm();
                      },
                      function (msg) {
                        alert('Calendar Error: ' + JSON.stringify(msg));
                        $scope.hideAddToCalendarConfirm();
                      }
              );
            } else {
              Utils.alert('You have no calendar plugin installed.');
              $scope.hideAddToCalendarConfirm();
            }
          };

          $scope.addReadBy = function () {
            $scope.event.relation('readBy').add(Parse.User.current());
            $scope.event.set('visitCount', ($scope.event.get('visitCount') || 0) + 1);
            $scope.event.save();
          };

          $scope.onSelectGuestCount = function (guestCount) {
            jQuery('#guest_count').text(guestCount);
            $scope.guestsPopover.hide();
            var prevGuests = [];
            if ($scope.registeredAttendee) {
              prevGuests = $scope.registeredAttendee.get('guests') || [];
            }
            if (prevGuests.length > guestCount) {
              $scope.data.guests = [];
              for (var i = 0; i < guestCount; i++) {
                $scope.data.guests.push(prevGuests[i]);
              }
            } else {
              $scope.data.guests = prevGuests;
              for (var i = prevGuests.length; i < guestCount; i++) {
                $scope.data.guests.push('Guest #' + (i + 1));
              }
            }
          };

          $scope.onSelectResponse = function (type) {
            $scope.data.response = type;
            $scope.responsePopover.hide();
          };

          $scope.registerEvent = function () {
            //sync guests
            jQuery('.guest-name').each(function (index) {
              $scope.data.guests[index] = $(this).val() || 'Guest #' + (index + 1);
            });

            if ($scope.data.response !== 'yes') {
              $scope.data.guests = [];
            }

            if (window.mixpanel) {
              window.mixpanel.track("Register for Event", {
                "Event ID": $scope.event.id,
                "Event Title": $scope.event.get('title'),
                "Additional Guests": jQuery('#guest_count').text() * 1
              });
            }
            var Attendee = Parse.Object.extend("Attendee");
            Utils.showIndicator();
            if ($scope.registeredAttendee) { //update existing one
              $scope.registeredAttendee.set('responseAt', new Date());
              $scope.registeredAttendee.save($scope.data, {
                success: function () {
                  Utils.hideIndicator();
                  $location.path('/event-detail/' + $scope.eventId);
                },
                error: function () {
                  Utils.hideIndicator();
                  Utils.alert('Failed in saving data.');
                }
              });
            } else { //add new event
              var newAttendee = new Attendee($scope.data);
              newAttendee.set("event", $scope.event);
              newAttendee.set("user", Parse.User.current());
              newAttendee.set('responseAt', new Date());
              newAttendee.save(null, {
                success: function (attendee) {
                  Utils.hideIndicator();
                  $location.path('/event-detail/' + $scope.eventId);

                  //subscribe to Event channel
                  if (typeof window.parsePlugin !== 'undefined') {
                    var channel = 'Event_' + $scope.eventId;
                    parsePlugin.subscribe(
                            channel,
                            function () {
                            }, // subscribed!
                            function (e) {
                            }  // unable to subscribe...
                    );
                  }
                },
                error: function () {
                  Utils.hideIndicator();
                  Utils.alert('Failed in saving data.');
                }
              });
            }
          };

          $scope.cancelRegistration = function () {
            if (window.mixpanel) {
              window.mixpanel.track("Cancel Event Registration", {
                "Event ID": $scope.event.id,
                "Event Title": $scope.event.get('title')
              });
            }
            Utils.confirm('Are you sure to cancel registration from this event?', null, function () {
              Utils.showIndicator();
              $scope.registeredAttendee.destroy({
                success: function () {
                  Utils.hideIndicator();
                  $location.path('/event-detail/' + $scope.eventId);

                  //unsubscribe to Event channel
                  if (typeof window.parsePlugin !== 'undefined') {
                    var channel = 'Event_' + $scope.eventId;
                    parsePlugin.unsubscribe(
                            channel,
                            function () {
                            }, // subscribed!
                            function (e) {
                            }  // unable to subscribe...
                    );
                  }
                },
                error: function () {
                  Utils.hideIndicator();
                  Utils.alert('Failed in deleting data.');
                }
              });
            });
          };

          $scope.getResponseLabel = function (response) {
            if(!response){
              return '';
            }
            return (response == 'no' ? 'Not' : response) + ' Attending';
          };

          if ($scope.isRegisterPage) {
            $scope.data = {
              guests: [],
              response: 'yes',
              note: ''
            };
            $scope.registeredAttendee = false;

            EventUtils.loadMyAttendedEvents(function () {
              $scope.registeredAttendee = $scope.eventUtils.isAttended($scope.event);
              if ($scope.registeredAttendee) {
                $scope.data.guests = $scope.registeredAttendee.get('guests') || [];
                $scope.data.response = $scope.registeredAttendee.get('response');
                $scope.data.note = $scope.registeredAttendee.get('note');
              }
            });

            /** == guests menu == */
            $scope.guestsPopover = null;
            $ionicPopover.fromTemplateUrl('additionalguests-popover', {
              scope: $scope
            }).then(function (popover) {
              $scope.guestsPopover = popover;
            });

            /** == attend type menu == */
            $scope.responsePopover = null;
            $ionicPopover.fromTemplateUrl('response-popover', {
              scope: $scope
            }).then(function (popover) {
              $scope.responsePopover = popover;
            });

            $scope.$on('$destroy', function () {
              $scope.guestsPopover.remove();
              $scope.responsePopover.remove();
            });
          }

          $scope.selectTab($scope.activeTab);
          if ($scope.activeTab !== 'content') {
            $scope.loadEvent();
          }

        });