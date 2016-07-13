'use strict';

angular.module('gnApp.controllers')
  .controller('EventRegisterController', function ($scope, EventUtils, Utils, $location, $stateParams, $ionicPopover, AppConfig) {
    $scope.eventId = $stateParams.eventId;
    $scope.data = {
      guests: [],
      response: 'yes',
      note: '',
    };

    EventUtils.loadMyAttendedEvents(function(){
      $scope.registeredAttendee = $scope.eventUtils.isAttended($scope.event);
      if($scope.registeredAttendee){
        $scope.data.guests = $scope.registeredAttendee.get('guests') || [];
        $scope.data.response = $scope.registeredAttendee.get('response');
        $scope.data.note = $scope.registeredAttendee.get('note');
      }
    });
    $scope.eventUtils = EventUtils;

    $scope.registeredAttendee = false;

    var EventModel = Parse.Object.extend('Event');

    $scope.loadEvent = function (eventId) {
      eventId = eventId || $scope.eventId;
      Utils.showIndicator();
      var query = new Parse.Query(EventModel);
      query.get(eventId).then(function (event) {
        $scope.$apply(function () {
          $scope.event = event;
          $scope.registeredAttendee = $scope.eventUtils.isAttended($scope.event);
          if($scope.registeredAttendee){
            $scope.data.guests = $scope.registeredAttendee.get('guests') || [];
            $scope.data.response = $scope.registeredAttendee.get('response');
            $scope.data.note = $scope.registeredAttendee.get('note');
          }
          $scope.guestCountList = [];
          for(var i=0; i<$scope.event.get('maxGuestCount')+1; i++){
            $scope.guestCountList.push(i);
          }
        });
        Utils.hideIndicator();
      });
    };

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

    $scope.onSelectGuestCount = function (guestCount) {
      jQuery('#guest_count').text(guestCount);
      $scope.guestsPopover.hide();
      var prevGuests = [];
      if($scope.registeredAttendee){
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
    
    $scope.onSelectResponse = function(type){
      $scope.data.response = type;
      $scope.responsePopover.hide();
    };
    
    $scope.registerEvent = function () {
      //sync guests
      jQuery('.guest-name').each(function(index){
        $scope.data.guests[index] = $(this).val() || 'Guest #' + (index + 1);
      });
      
      if($scope.data.response !== 'yes'){
        $scope.data.guests = [];
      }
      
      if(window.mixpanel) {
        window.mixpanel.track("Register for Event",{
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
            if (typeof window.parsePlugin !== 'undefined'){
              var channel = 'Event_' + $scope.eventId;
              parsePlugin.subscribe(
                channel,
                function ()  {}, // subscribed!
                function (e) {}  // unable to subscribe...
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

    $scope.cancelRegistration = function(){
      if(window.mixpanel) {
        window.mixpanel.track("Cancel Event Registration",{
          "Event ID": $scope.event.id,
          "Event Title": $scope.event.get('title')
        });
      }
      Utils.confirm('Are you sure to cancel registration from this event?', null, function(){
        Utils.showIndicator();
        $scope.registeredAttendee.destroy({
          success: function () {
            Utils.hideIndicator();
            $location.path('/event-detail/' + $scope.eventId);

            //unsubscribe to Event channel
            if (typeof window.parsePlugin !== 'undefined'){
              var channel = 'Event_' + $scope.eventId;
              parsePlugin.unsubscribe(
                channel,
                function ()  {}, // subscribed!
                function (e) {}  // unable to subscribe...
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

    $scope.loadEvent();

  });