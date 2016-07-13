'use strict';

angular.module('gnApp.controllers')
  .controller('ChaptersController', function ($scope, Utils, $state, $location) {
    $scope.chapters = [];

    $scope.getGroupTypeByName = function (name) {
      Utils.showIndicator();
      var query = new Parse.Query(Parse.Object.extend('GroupType'));
      query.equalTo('name', name);
      query.find().then(function (groupTypes) {
        if (groupTypes.length > 0) {
          $scope.loadGroups(groupTypes[0]);
        }else{
          Utils.hideIndicator();
        }
      });
    };

    $scope.gotoGroupDetail = function (group) {
      Utils.showIndicator();
      Parse.Cloud.run('checkGroupVisibility', {groupId: group.id}).then(function (response) {
        $scope.$apply(function () {
          if (response) {
            $location.path('/group-feed/' + group.id);
          } else {
            $location.path('/members/' + group.id);
          }
        });
      });
    };

    $scope.loadGroups = function (groupType) {
      var query = new Parse.Query(Parse.Object.extend('Group'));
      query.equalTo('type', groupType);
      query.ascending('name');
      query.find().then(function (chapters) {
        $scope.$apply(function () {
          $scope.chapters = chapters;
        });
        Utils.hideIndicator();
      });
    };

    $scope.getGroupTypeByName('chapter');
  });
